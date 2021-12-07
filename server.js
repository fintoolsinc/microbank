//-------------------------------------------------------//
//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: server.js
// Created: 2019-11-12
// Updates: 2019-11-12,2021-01-12
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const express = require('express');
const static = require('serve-static')
const app = express();
const routes= require('./bsb/routes.js');
const fs = require('fs');
const { transform } = require('camaro');
const bodyParser = require('body-parser');
const formidable = require('formidable');

let xml = fs.readFileSync("./xml/app.data.xml", "utf8");

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.use('/res',static('res', { 'index': ['default.html', 'default.htm'] }));

(async function () {

	let portal = await transform(xml, {app:'/data/portal/app',port:'/data/portal/port',dbPort:'/data/database/port',dbName:'/data/database/name'});
	
	app.listen(portal['port'], () => {
		console.log('App listening on [port : '+portal['port']+']');
		console.log('App data engine [port : '+portal['dbPort']+' db: '+portal['dbName']+')');
	});
})()
//-------------------------------------------------------//