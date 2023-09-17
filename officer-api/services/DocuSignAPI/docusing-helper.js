const docusign = require("docusign-esign");

exports.getSigners = function(signers){
    return signers.map(signer => {
        const signerObj = docusign.Signer.constructFromObject({
            email: signer.Email,
            name: signer.FullName,
            userName: signer.FullName,
            clientUserId: signer._id,
            recipientId: signer._id,
        });

        const signObj = docusign.SignHere.constructFromObject({
            anchorString: signer.Position,
            anchorYOffset: "-40",
            anchorUnits: "pixels",
            anchorXOffset: "0",
        });

        const tabObj = docusign.Tabs.constructFromObject({
            signHereTabs: [signObj],
        });
        signerObj.tabs = tabObj;
    
        return signerObj
    })
}