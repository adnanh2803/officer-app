require('dotenv').config({path: '../../.env'})

exports.dsConfig = {
    integratorKey: process.env.DS_INTEGRATION_KEY,
    accountId: process.env.DS_ACCOUNT_ID,
    userId: process.env.DS_USER_ID,
    dsApiBasePath: process.env.DS_BASEPATH,
    privateKey: process.env.DS_PRIVATE_KEY.split(String.raw`\n`).join('\n')
  };