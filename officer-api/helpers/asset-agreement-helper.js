const openConnection = require("../services/database");
const {
    assetAgreement,
} = require("../services/PDFGenerator/templates/Agreement document/body-section");
const moment = require("moment/moment");
const { generatePdf } = require("../services/PDFGenerator/pdf-generator");
const userControler = require("../controllers/User/user-controller")
exports.createAssetAgreement = async function (
    name,
    reason,
    userId,
    documentUrl
) {
    if (!name || !reason || !userId || !documentUrl)
        throw new HttpError("AssetAgreement missis parameters", 500);
    const sql = `INSERT INTO AssetAgreement(Name, Reason, Status, UserId, DocumentURL) VALUES(?,?,?,?,?)`;
    const db = await openConnection();
    try {
        console.log("connection open");
        const scope = await db.run(sql, [
            name,
            reason,
            "CREATED",
            userId,
            documentUrl,
        ]);
        return scope;
    } catch (err) {
        console.log(err);
        throw new HttpError("Database failed",500);
    } finally {
        db.close();
    }
};

exports.getDataForPDF = async function (id) {
    const db = await openConnection();
    const sql = `SELECT * FROM vw_AssetAgreementFull WHERE _id = ?`;
    try {
        const data = await db.get(sql, [id]);
        return data;
    } catch (err) {
        throw new HttpError(err, 500);
    } finally {
        db.close();
    }
};

exports.updateDocumentURL = async function (url, id) {
    const db = await openConnection();
    const sql = `UPDATE AssetAgreement SET DocumentURL = ? WHERE _id = ?`;
    try {
        const data = await db.run(sql, [url, id]);
        return data;
    } catch (err) {
        throw new HttpError(err, 500);
    } finally {
        db.close();
    }
};

exports.generatePDFFromData = async function (data, company, reviewers) {
    const user = {
        FullName: data.FullName,
        OIB: data.OIB,
        Address: data.Address,
    };
    const agreement = {
        Date: moment().format("DD/MM/YYYY"),
    };

    const html = assetAgreement(
        user,
        company,
        agreement,
        data.Assets,
        reviewers,
        "Zadužnica za opremu",
        ""
    );

    const pdfData = await generatePdf(html, data.Name);

    return pdfData;
};

exports.createAssetsForAgreement = async function (assetAgreementId, assets) {
    if (!assetAgreementId || !assets.length > 0)
        throw new HttpError("AssetAgreement missis parameters", 500);
    const insertStmt = `INSERT INTO AssetAgreementAsset(AssetAgreementId, AssetId) VALUES(?,?);`;
    const values = assets.map((asset) => [assetAgreementId, asset._id]);

    const db = await openConnection();
    try {
        await db.run("BEGIN TRANSACTION");
        await Promise.all(
            values.map(async (element) => {
                await db.run(insertStmt, element);
            })
        );
        await db.run("COMMIT");
    } catch (err) {
        console.log(err);
        db.run("ROLLBACK");
        throw new HttpError(err, 500);
    } finally {
        await db.close();
    }
};

exports.assignEnvelopeToAssetAgreement = async function (envelopeId, assetAgreementId){
    const db = await openConnection();
    const insertStmt = `UPDATE AssetAgreement SET DocumentGUID = ? WHERE _id = ?`;
    try{
        await db.run(insertStmt, [envelopeId, assetAgreementId]);
    }
    catch(err){
        throw new HttpError(err, 500);
    }
    finally{
        await db.close();
    }
}

exports.createReviewersForAgreement = async function (assetAgreementId, reviewers) {
    const db = await openConnection();
    if(reviewers.length <= 0){throw new HttpError("Could not create asset agreement because there are no specified reviewers",400)}
    const insertStmt = `INSERT INTO AssetAgreementReviewer(AssetAgreementId, ReviewerId) VALUES(?,?);`;
    const values = reviewers.map((reviewer) => [
        assetAgreementId,
        reviewer._id,
    ]);
    try{
        await Promise.all(
            values.map(async (element) => {
                await db.run(insertStmt, element);
            })
        );
    }
    catch(err){
        throw new HttpError(err, 500);
    }
    finally{
        await db.close();
    }
    return reviewers;
};

exports.getAllReviewers = async function () {
    const db = await openConnection();
    const reviewersStmt = "SELECT _id, FullName, Email, Position FROM vw_UserRole WHERE IsReviewer = 1"
        try {
            const db = await openConnection();
            const reviewers = await db.all(reviewersStmt, []);
            return reviewers || []
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }finally{
            await db.close();
        }
};
exports.getReviewersForAssetAgreement = async function (assetAgreementId) {
    const db = await openConnection();
    const reviewersStmt = `SELECT u._id, u.FullName, u.Email, u.Position FROM AssetAgreementReviewer aar
                           JOIN vw_UserRole u ON u._id = aar.ReviewerId
                           WHERE AssetAgreementId = ?`
        try {
            const db = await openConnection();
            const reviewers = await db.all(reviewersStmt, [assetAgreementId]);
            return reviewers || []
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }finally{
            await db.close();
        }
};

exports.updateReviewStatus = async function (assetAgreementId, userId) {
    const db = await openConnection();
    const updateStmt = `UPDATE AssetAgreementReviewer
                            SET Signed = 1 
                        WHERE AssetAgreementId = ? and ReviewerId = ?`;
    try {
        await db.run(updateStmt, [assetAgreementId, userId]);
    } catch (err) {
        console.log(err);
        throw new HttpError(err, 500);
    } finally {
        await db.close();
    }
};

exports.getAssetAgreementForReviewer = async function(assetAgreementId, userData){
    const db = await openConnection();
    const getStmt = `SELECT aa.* FROM AssetAgreement aa
                     JOIN AssetAgreementReviewer aar ON aar.AssetAgreementId = aa._id
                     WHERE aa._id = ? AND  aar.ReviewerId = ?`;
    try {
        const data = await db.get(getStmt, [assetAgreementId, userData._id]);
        return data;
    } catch (err) {
        console.log(err);
        throw new HttpError(err, 500);
    } finally {
        await db.close();
    }
}

exports.getAssetAgreement = async function(assetAgreementId, userData){
    const db = await openConnection();
    const getStmt = `SELECT aa.* FROM vw_AssetAgreementFull aa
                     JOIN AssetAgreementReviewer aar ON aar.AssetAgreementId = aa._id
                     WHERE aa._id = ? AND  aar.ReviewerId = ?`;
    try {
        const data = await db.get(getStmt, [assetAgreementId, userData._id]);
        return data;
    } catch (err) {
        console.log(err);
        throw new HttpError(err, 500);
    } finally {
        await db.close();
    }
}
exports.getAssetAgreementsForUser = async function(userData){
    const db = await openConnection();
    const getStmt = `SELECT aa.* FROM vw_AssetAgreementFull aa
                     JOIN AssetAgreementReviewer aar ON aar.AssetAgreementId = aa._id
                     WHERE aar.ReviewerId = ?`;
    try {
        const data = await db.all(getStmt, [userData._id]);
        return data;
    } catch (err) {
        console.log(err);
        throw new HttpError(err, 500);
    } finally {
        await db.close();
    }
}

exports.getAllAssetAgreements = async function(){
    const db = await openConnection();
    const getStmt = `SELECT * FROM vw_AssetAgreementFull`;
    try {
        const data = await db.all(getStmt);
        return data;
    } catch (err) {
        console.log(err);
        throw new HttpError(err, 500);
    } finally {
        await db.close();
    }
}

exports.getCompanyInfo = async function(){
    const db = await openConnection();
    const getStmt = `SELECT Value FROM ApplicationSettings WHERE Name = 'CompanyInfo'`;
    try {
        const data = await db.get(getStmt);
        return data;
    } catch (err) {
        console.log(err);
        throw new HttpError(err, 500);
    } finally {
        await db.close();
    }
}
