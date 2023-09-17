// const dsConfig = require('./config/docusign-config.js').config;
// const docusign = require('docusign-esign');
const fs = require("fs");
const DSToken = require("./DSToken");
const docusign = require("docusign-esign");
const path = require("path");
const { dsConfig } = require("./dsConfig");
const { getSigners } = require("./docusing-helper.js");
async function createSignablePDF(
    currentUser,
    pdfPath,
    signers,
    assetAgreement
) {
    const tokenObj = DSToken.instance();
    const token = await tokenObj.getToken();
    const dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(dsConfig.dsApiBasePath);
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
    const envelopesApi = new docusign.EnvelopesApi(dsApiClient);

    let envelope = makeEnvelope(pdfPath, signers, assetAgreement);

    const envelopeData = await envelopesApi.createEnvelope(dsConfig.accountId, {
        envelopeDefinition: envelope,
    });
    const results = await makeRecipientViewRequest(
        envelopesApi,
        currentUser,
        assetAgreement,
        envelopeData.envelopeId
    );

    return { envelopeId: envelopeData.envelopeId, envelopeUrl: results?.url };
}

async function makeRecipientViewRequest(
    envelopesApi,
    currentUser,
    assetAgreement,
    envelopeId
) {
    if (!envelopesApi) {
        const tokenObj = DSToken.instance();
        const token = await tokenObj.getToken();

        const dsApiClient = new docusign.ApiClient();
        dsApiClient.setBasePath(dsConfig.dsApiBasePath);
        dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
        envelopesApi = new docusign.EnvelopesApi(dsApiClient);
    }
    try{
        let viewRequest = new docusign.RecipientViewRequest();
        viewRequest.returnUrl =
            process.env.APP_URL + `/asset-agreements/details/${assetAgreement._id}`;
    
        viewRequest.authenticationMethod = "none";
    
        viewRequest.email = currentUser.Email;
        viewRequest.userName = currentUser.FullName;
        viewRequest.clientUserId = currentUser._id;
        results = await envelopesApi.createRecipientView(
            dsConfig.accountId,
            envelopeId,
            { recipientViewRequest: viewRequest }
        );
        return results;
    }catch(err){
        console.log(err,"Something went wrong")
        return null;
    }

}

function makeEnvelope(pdfPath, signers, assetAgreement) {
    let docPdfBytes;
    // read file from a local directory
    // The read could raise an exception if the file is not available!
    docPdfBytes = fs.readFileSync(pdfPath, { encoding: "base64" });
    // create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = "Please sign this document";

    // add the documents
    let doc1 = new docusign.Document(),
        doc1b64 = docPdfBytes;
    doc1.documentBase64 = doc1b64;
    doc1.name = assetAgreement.name; // can be different from actual file name
    doc1.fileExtension = "pdf";
    doc1.documentId = assetAgreement._id;

    // The order in the docs array determines the order in the envelope
    env.documents = [doc1];

    const signersObjArr = getSigners(signers);
    // Add the recipient to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
        signers: signersObjArr,
    });
    env.recipients = recipients;

    // Request that the envelope be sent by setting |status| to "sent".
    // To request that the envelope be created as a draft, set to "created"
    env.status = "sent";

    return env;
}

async function getEnvelope(envelopesApi, envelopeId) {
        if (!envelopesApi) {
            const tokenObj = DSToken.instance();
            const token = await tokenObj.getToken();
    
            const dsApiClient = new docusign.ApiClient();
            dsApiClient.setBasePath(dsConfig.dsApiBasePath);
            dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
            envelopesApi = new docusign.EnvelopesApi(dsApiClient);
        }
    
        return await envelopesApi.getEnvelope(dsConfig.accountId, envelopeId);
}
async function getEnvelopesForUser(envelopeIds) {
    const tokenObj = DSToken.instance();
    const token = await tokenObj.getToken();    
    const dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(dsConfig.dsApiBasePath);
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
    envelopesApi = new docusign.EnvelopesApi(dsApiClient);
    const options = {envelopeIds, include: 'recipients'}
    const envelopes = await envelopesApi.listStatusChanges(dsConfig.accountId, options);
    return envelopes
}

module.exports = {
    makeRecipientViewRequest,
    getEnvelope,
    getEnvelopesForUser,
    createSignablePDF,
};
