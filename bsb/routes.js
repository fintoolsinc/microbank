//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: /bsb/routes.js
// Created: 2019-11-12,2021-01-15
// Updates: 2019-11-12,2021-01-22
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//

const routes = require('express').Router();
const portal = require("./portal.js");
const log    = require("./log.js");
const desk   = require("./desk.js");
const record = require("./record.js");
const collection = require("./collection.js");
const session = require("./session.js");
const search = require("./search.js");
const file = require("./file.js");
const generate = require("./generate.js");

routes.get('/', (req, res) => { portal.option(req,res); } );
routes.get('/option', (req, res) => { portal.option(req,res) } );
routes.post('/login', (req, res) => { log.in(req,res) } );
routes.post('/logout', (req, res) => { log.out(req,res) } );
routes.post('/captcha', (req, res) => { log.captcha(req,res) } );
routes.post('/crypt', (req, res) => { log.crypt(req,res) } );
routes.post('/session', (req, res) => { session.data(req,res) } );
routes.post('/desk.nav', (req, res) => { desk.nav(req,res) } );
routes.post('/record.pair', (req, res) => { record.pair(req,res) } );
routes.post('/record.get', (req, res) => { record.get(req,res) } );
routes.post('/record.association', (req, res) => { record.association(req,res) } );
routes.post('/record.set', (req, res) => { record.set(req,res) } );
routes.post('/record.save', (req, res) => { record.save(req,res) } );
routes.post('/record.remove', (req, res) => { record.remove(req,res) } );
routes.post('/collection.pair', (req, res) => { collection.pair(req,res) } );
routes.post('/collection.get', (req, res) => { collection.get(req,res) } );
routes.post('/collection.getQuery', (req, res) => { collection.getQuery(req,res) } );
routes.post('/collection.count', (req, res) => { collection.count(req,res) } );
routes.post('/collection.pairFiltered', (req, res) => { collection.pairFiltered(req,res) } );
routes.get('/search.header', (req, res) => { search.header(req,res) } );
routes.get('/search.data', (req, res) => { search.data(req,res) } );
routes.get('/file.archivo', (req, res) => { file.archivo(req,res) } );
routes.get('/file.archivosCarne', (req, res) => { file.archivosCarne(req,res) } );
routes.get('/file.obtenerArchivo', (req, res) => { file.obtenerArchivo(req,res) } );
routes.post('/file.get', (req, res) => { file.get(req,res) } );
routes.post('/file.remove', (req, res) => { file.remove(req,res) } );
routes.post('/file.search', (req, res) => { file.search(req,res) } );
routes.post('/file.upload', (req, res) => { file.upload(req,res) } );
routes.post('/file.uploadCarne', (req, res) => { file.uploadCarne(req,res) } );

routes.post('/generate.app', (req, res) => { generate.app(req,res) } );
routes.post('/generate.configuration', (req, res) => { generate.configuration(req,res) } );
routes.post('/generate.schema', (req, res) => { generate.schema(req,res) } );
routes.post('/generate.appPopulate', (req, res) => { generate.appPopulate(req,res) } );
routes.post('/generate.object', (req, res) => { generate.object(req,res) } );
routes.post('/generate.class', (req, res) => { generate.class(req,res) } );
routes.post('/generate.classProperties', (req, res) => { generate.classProperties(req,res) } );
routes.post('/generate.viewRecordElements', (req, res) => { generate.viewRecordElements(req,res) } )
routes.post('/generate.viewSearchColumns', (req, res) => { generate.viewSearchColumns(req,res) } )
routes.post('/generate.viewFormColumns', (req, res) => { generate.viewFormColumns(req,res) } )
routes.post('/generate.collection', (req, res) => { generate.collection(req,res) } );
routes.post('/generate.interface', (req, res) => { generate.interface(req,res) } );
routes.post('/generate.xml', (req, res) => { generate.xml(req,res) } );
routes.post('/generate.html', (req, res) => { generate.html(req,res) } );
routes.post('/generate.js', (req, res) => { generate.js(req,res) } );

module.exports = routes;
//----------------------------------------------------------//
