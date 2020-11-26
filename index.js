import appSrc from './app.js';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import m from 'mongoose';
// import dot from 'dotenv'
import crypto from 'crypto';
import http from 'http';
import CORS from './CORS.js';
import UserModel from './models/User.js';
// dot.config({path:'./.env'});
const {URL} = process.env.MONGO_URI
const User = UserModel(m);
const app = appSrc(express, bodyParser, fs, crypto, http, CORS, User);
const PORT = process.env.PORT || 443;
try{
    await m.connect(URL, {useNewUrlParser:true, useUnifiedTopology:true});
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
}
catch(e){
    console.log(e.codeName);
}

