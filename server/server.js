import express from 'express';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
//import api from './api';
//import config from './config';

const { NODE_ENV, PORT, HOST, DOMAIN } = process.env;

const app = express();

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log('Connected to mongod server');
});
/*
mongoose.Promise = require('bluebird');
mongoose.connect(config.db,{
  useMongoClient: true,
});
*/
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(bodyParser.json());

//app.use('/api',api);

app.get('*.js', function(req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'text/javascript');
  next();
});

app.get('*.css', function(req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'text/css');
  next();
});

app.get('*.scss', function(req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'text/x-scss');
  next();
});

if (NODE_ENV == "development") {
  console.log("Server is running on development mode");
  const webpackConfig = require("../webpack.dev.config"); 
  let compiler = webpack(webpackConfig);
  let devServer = new WebpackDevServer(compiler, webpackConfig.devServer);
  devServer.listen(3001, () => {
    console.log("webpack-dev-server is listening on port", 3001);
  });
}   

app.use("/", express.static(__dirname + "/../public"));

app.get('*', (req,res)=>{
  res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

var httpServer = http.createServer(app);

httpServer.listen(3000, () => {
  console.log("Express listening on port", 3000);
});