const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./helpers/http-error-helper');

const authRouter = require('./routes/auth-routes.js');
const userRouter = require('./routes/user-routes.js');
const assetRouter = require('./routes/asset-routes.js');
const employeeRouter = require('./routes/employee-routes.js');
const assetAgreementRouter = require('./routes/asset-agreement-routes.js');
const appSettingsRouter = require('./routes/application-settings-routes.js');
const app = express();

app.use(cors({
    origin: '*',
    credentials: true,
    exposedHeaders: 'Content-Disposition'
  }));
app.use(bodyParser.json());
app.use('/api',[authRouter,userRouter, assetRouter, employeeRouter,assetAgreementRouter,appSettingsRouter]);

const port = process.env.PORT || 5001;

app.listen(port, ()=>{console.log(`Server is running on port ${port}`)});