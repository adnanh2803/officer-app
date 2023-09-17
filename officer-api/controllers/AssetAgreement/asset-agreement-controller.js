const coreController = require("../Core/core-controller");
const assetHelper = require("../../helpers/asset-agreement-helper");
const path = require('path')
const fs = require('fs')
const {createSignablePDF, makeRecipientViewRequest, getEnvelope, getEnvelopesForUser} = require('../../services/DocuSignAPI/docusign.js')
exports.get = function (){
    return async(req, res) => {
        try {
            const rows = await assetHelper.getAssetAgreementsForUser(req.body.userData)
            const docGuids = rows.map(d => d.DocumentGUID).join(',')
            if(docGuids.length>0){
                const results = await getEnvelopesForUser(docGuids)
                rows.forEach((row)=>{
                    let doc = results.envelopes?.find((d)=>{
                        return d.envelopeId == row.DocumentGUID;
                    })
                    if(doc && doc.envelopeId != null && doc.envelopeId != ''){
                        row.Status = doc.status.charAt(0).toUpperCase() + doc.status.slice(1);
                    }
                    row.UserStatus = doc?.recipients.signers.map((r)=> {return {email: r.email, status: r.status}})
                })
            }
            return res.status(200).json(rows);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    };
}
exports.getDetails = function () {
    return async(req, res) => {
        const {id} = req.params;
        const {userData} = req.body;
        const assetAgreement = await assetHelper.getAssetAgreement(id, userData);
        try{
        if(!assetAgreement) return res.status(403).json("Either you made the wrong request or you do not have rights for this action")
        const envelope = await getEnvelope(null, assetAgreement.DocumentGUID)
        envelope.status = envelope.status.charAt(0).toUpperCase() + envelope.status.slice(1);
        return res.status(200).json({
            assetAgreement,
            envelope
        })
        }catch(err){
            return res.status(200).json({
                assetAgreement
            })
        }

    };
}
exports.create = function(){ return async (req,res) =>{
    const {Assets, Reason, userData, Employee} = req.body;
    console.log('Create agreement')
    const name = 'AssetAgreemnt' + Date.now().toString()
    try{

        //If there is no provided user for who the agreement is made for. Use the user who initiated creation.
        const assetUser = Employee || userData
        const assetAgreementObj = {
            Name: name,
            FullName:assetUser.FullName,
            OIB: assetUser.OIB,
            Address: assetUser.Address,
            Assets: Assets
        }
        const reviewers = await assetHelper.getAllReviewers();
        //Check if user who initiated agreement is one of the reviewers. If not add it.
        if(!reviewers.some((reviewer)=>{return reviewer._id == assetUser._id})){
            reviewers.push({_id: assetUser._id,Email:assetUser.Email, FullName: assetUser.FullName, Position: assetUser.Position})
        }
        const companyInfo = await assetHelper.getCompanyInfo();
        const pdfData = await assetHelper.generatePDFFromData(assetAgreementObj, JSON.parse(companyInfo.Value), reviewers)
        const scope = await assetHelper.createAssetAgreement(name, Reason, assetUser._id, pdfData.path);
        await assetHelper.createReviewersForAgreement(scope.lastID,reviewers)
        await assetHelper.createAssetsForAgreement(scope.lastID, Assets);
        console.log("Controler Reviewrs: ",reviewers)
        const {envelopeId, envelopeUrl} = await createSignablePDF(assetUser,pdfData.path, reviewers, {_id: scope.lastID, name})
        await assetHelper.assignEnvelopeToAssetAgreement(envelopeId,scope.lastID)
        return res.status(200).json({scope, envelopeUrl})
    }catch(err){
        console.log(err)
        return res.status(err?.statusCode || 500).json(err.message || err)
    }
}}
exports.update = coreController.update
exports.delete = coreController.deleteSoft

exports.pdf = function(){
    return async (req, res) => {
        const {_id} = req.query;
        const data = await assetHelper.getDataForPDF(_id);

        if(data.DocumentURL == '' || !fs.existsSync(data.DocumentURL)){
            const assetAgreementObj = {
                Name: data.Name,
                FullName: data.FullName,
                OIB: data.OIB,
                Address: data.Address,
                Assets: data.Assets.split(',').map((asset)=>{
                    return {Name: asset}
                })
            }
            const reviewers = await assetHelper.getReviewersForAssetAgreement(_id)
            const pdfData = await assetHelper.generatePDFFromData(assetAgreementObj,reviewers)
            req.body.URL = pdfData.path;
            await assetHelper.updateDocumentURL(pdfData.path, _id);
        }
        
        var filePath = data.DocumentURL || req.body.URL
        var fileName = path.basename(filePath);

        res.setHeader('Content-type', 'application/pdf');
        res.download(filePath,fileName)
    }
}
exports.signPdf = function(){
    return async (req, res) => {
        const {id, userData} = req.body;
        const assetAgreement = await assetHelper.getAssetAgreement(id, userData)
        if(!assetAgreement) return res.status(400).json("You are not reviewer for requested asset agreement")
        const data = await makeRecipientViewRequest(null,userData,assetAgreement,assetAgreement.DocumentGUID)
        // await assetHelper.updateReviewStatus(id,userData._id)
        return res.status(200).json(data)
    }
}