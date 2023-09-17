const jwt = require('jsonwebtoken');
const docusign = require('docusign-esign');
const {dsConfig} = require('./dsConfig')

class PrivateDSToken {
    constructor(){
        console.log("User DSToken class to instatiate object")
    }
    async getToken(){
        if(this.token != null && this.isTokenValid()) return  this.token;
        await this.initToken();
        return this.token;
    }

    async initToken(){
        const dsApiClient = new docusign.ApiClient({basePath: dsConfig.dsApiBasePath});

        try{
            const response = await dsApiClient.requestJWTUserToken(dsConfig.integratorKey, dsConfig.userId,['signature impersonation'],dsConfig.privateKey, 3600)
            this.token = response.body.access_token
            this.iat = Date.now();
        }catch(err){
            console.log(err)
        }
    }
    isTokenValid(){
        return this.iat + 350000 > Date.now()
    }
}

module.exports = class DSToken {
    static _instance;

    static instance() {
        if (!this._instance) {
            this._instance = new PrivateDSToken();
            this._instance.getToken();
        }
        return this._instance;
    }
}
