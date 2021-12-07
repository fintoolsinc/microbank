//-------------------------------------------------------//
//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: /bsb/generator.js
// Created: 2021-03-
// Updates: 2021-03-12
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const db = require('./db.js');
const { promises: fs } = require('fs');
const path = require('path');
const xmlParser = require("xml2json");
const formatXml = require("xml-formatter");
const builder = require('xmlbuilder');

const source_module = "/Users/Usuario/Desktop/ROMA/Apps/node.js/bsb.generator/v4/bsb_module/";
const source_temple = "/Users/Usuario/Desktop/ROMA/Apps/node.js/bsb.generator/v4/bsb_templates/";
const destine = "/Users/Usuario/Desktop/ROMA/Apps/node.js/Generated_Apps/";
//-------------------------------------------------------//
// LEVEL 1
this.app = async (req,res) => {
    try{
        let okCopy = await copyDir(source_module, destine + req.body.id);
        let okConf = await confApp(req.body);
        let okSche = await createSchema(req.body);       
        let okAppJs= await confAppJs(req.body.id);
        let okDbJs = await confDbJs(req.body.id);
        let okColl = await createAppCollections(req.body);
        let okPopu = await populateAppCollections(req.body);
        let okApLo = await createHtmlAppLogin(req.body);
        let okApDk = await createHtmlAppDesk(req.body);
        if(okCopy==true && okConf==true && okSche==true && okAppJs==true && okDbJs==true && okColl && okPopu==true && okApLo==true && okApDk==true){
            res.status(200).json(true);
        }else{
            res.status(200).json(false);
        }
    }catch(err){
        res.status(200).json(false);
    }
}
this.configuration = async (req,res) => {
    try{
        await confApp(req.body);
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.schema = async (req,res) => {
    try{
        await createSchema(req.body);
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.appPopulate = async (req,res) => {
    try{
        await populateAppCollections(req.body);
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.remove = async (req, res) => {
    let fileName= req.body.fileName;
    let path = process.cwd() + "/upload/" ;
    let file = path + fileName;
    try{
        fs.unlink(file, (err) => {
            if (err) throw err;
        });
        res.status(200).json(true);
    }catch(err){ 
        res.status(200).json(false);
    }      
}
this.object = async (req,res) => {
    try{
        let map = await getMap(req.body);
        await createCollection(req.body,map['collection']);
        await createClassXml(req.body,map['collection']); 
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.collection = async (req, res) => {
    try{
        let map = await getMap(req.body);
        await createCollection(req.body,map['collection']);
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.class = async (req, res) => {
    try{
        let map = await getMap(req.body);
        await createClassXml(req.body,map['collection']);
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.classProperties = async (req, res) => {
    try{
        await insertClassProperties(req.body);
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.viewRecordElements = async (req, res) => {
    try{
        let data = await getClassProperties(req.body.id.split(".").shift());
        await insertViewRecordElements(req.body,data);
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.viewSearchColumns = async (req, res) => {
    try{
        let data = await getClassProperties(req.body.id.split(".").shift());
        await insertViewSearchColumns(req.body,data);
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.viewFormColumns = async (req, res) => {
    try{
        let dataMaster = await getClassProperties(req.body.id.replace(/.form/g,"").split(".").shift());		
        let dataDetail = await getClassProperties(req.body.id.replace(/.form/g,""));
        await insertViewFormColumns(req.body,dataMaster,dataDetail);
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.interface = async (req,res) => {
    try{
        let mid  = await getModel(req.body.id);
        let lang = await getLang(mid);
        if(req.body.id.split(".").pop()=="record"){ 
            await createXmlRecord(req.body,mid);
            await createHtmlRecord(req.body,mid,lang);
            await createJsRecord(req.body,mid);
        }
        if(req.body.id.split(".").pop()=="search"){ 
            await createXmlSearch(req.body,mid);
            await createHtmlSearch(req.body,mid,lang);
            await createJsSearch(req.body,mid);
        }
        if(req.body.id.split(".").pop()=="form"){
            await createHtmlForm(req.body,mid,lang);
            await createJsForm(req.body,mid);
        }
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.xml = async (req, res) => {
    try{
		let clas = await getViewClass(req.body['view.id']);
        if(req.body['view.id'].split(".").pop()=="record"){ await createXmlRecord(clas,req.body['view.id'],req.body['id']);}
        if(req.body['view.id'].split(".").pop()=="search"){ await createXmlSearch(clas,req.body['view.id'],req.body['id']);}
        if(req.body['view.id'].split(".").pop()=="form"){ await createXmlForm(clas,req.body['view.id'],req.body['id']);}		
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.html = async (req, res) => {
    try{
		let clas = await getViewClass(req.body['view.id']);
        let lang = await getLang(req.body['id']);
        if(req.body['view.id'].split(".").pop()=="record"){ await createHtmlRecord(clas,req.body['id'],lang);}
        if(req.body['view.id'].split(".").pop()=="search"){ await createHtmlSearch(clas,req.body['id'],lang);}
        if(req.body['view.id'].split(".").pop()=="form"){ await createHtmlForm(clas,req.body['view.id'],req.body['id'],lang);}  
        if(req.body['view.id'].split(".").pop()=="accordion"){ await createHtmlAccordion(clas,req.body['view.id'],req.body['id'],lang);}  
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
this.js = async (req, res) => {
    try{
		let clas = await getViewClass(req.body['view.id']);
        if(req.body['view.id'].split(".").pop()=="record"){ await createJsRecord(clas,req.body['id']);}
        if(req.body['view.id'].split(".").pop()=="search"){ await createJsSearch(clas,req.body['id']);}
        if(req.body['view.id'].split(".").pop()=="form"){ await createJsForm(clas,req.body['id']);}
        if(req.body['view.id'].split(".").pop()=="accordion"){ await createJsAccordion(clas,req.body['id']);}		
        res.status(200).json(true);
    }catch(err){
        res.status(200).json(false);
    }
}
//-------------------------------------------------------//
// LEVEL 2
async function getViewClass(vid){
	let str = "";
	vid.split(".").forEach(function (val, inx) {
		if(vid.split(".").length-1 > inx){ str += val+"."; }
	});
	return str.substr(0,str.length-1);
}
async function getModel(id){
    let conn = await db.getConnection();
    let sql = "SELECT a.id FROM `model.classes` a WHERE a.`class.id` IN (SELECT `class.id` FROM `views` WHERE `id`= ?)";
    const rowSet = await conn.query(sql,id);
    conn.end();
    return rowSet[0].id;
}
async function getLang(mid){
    let lang = await fs.readFile(destine+mid+"/xml/app.data.xml").then(data => {
        const xmlObj = xmlParser.toJson(data, {reversible: true, object: true});
        return xmlObj['data']['portal'].lang.$t;
    });
    return lang;
}
async function getMap(body){
    let conn = await db.getConnection();
    let sql = "SELECT `collection` FROM `classes` WHERE `id` = ?";
    const rowSet = await conn.query(sql,[body['class.id']]);
    conn.end();
    return rowSet[0];
}
async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await fs.copyFile(srcPath, destPath);
    }
    return true;
}
async function confApp(body) {
    fs.readFile(destine+body.id+"/xml/app.data.xml").then(data => {
        const xmlObj = xmlParser.toJson(data, {reversible: true, object: true});

        xmlObj['data'].title.$t = body.desc;

        xmlObj['data']['portal'].app.$t = body.id;
        xmlObj['data']['portal'].port.$t = body.port;
        xmlObj['data']['portal'].lang.$t = body.lang;
        xmlObj['data']['portal'].html.$t = body.home;

        xmlObj['data']['database'].host.$t = body.dbhost;
        xmlObj['data']['database'].port.$t = body.dbport;
        xmlObj['data']['database'].name.$t = body.dbname;
        xmlObj['data']['database'].driver.$t = body.dbdriver;
        xmlObj['data']['database'].user.$t = body.dbuser;
        xmlObj['data']['database'].pass.$t = body.dbpassword;
        xmlObj['data']['database'].connectionLimit.$t = body.dbconnections;
        
        const stringifiedXmlObj = JSON.stringify(xmlObj)
        const finalXml = xmlParser.toXml(stringifiedXmlObj)

        fs.writeFile(destine+body.id+"/xml/app.data.xml", formatXml(finalXml, {collapseContent: true})).then(err => {
          if (err) {
            console.log("err");
          } else {
            console.log("Xml file successfully updated.");
          }
        })
    });
}
async function confAppJs(mid) {
    let app = await fs.readFile(destine+mid+"/xml/app.data.xml").then(data => {
        const xmlObj = xmlParser.toJson(data, {reversible: true, object: true});
        return xmlObj['data']['portal'].app.$t;
    });    
    let code = await (await fs.readFile(source_temple+"js/app.login.js")).toString();
    code = code.replace(/{app}/g,app);
    fs.writeFile(destine+mid+"/res/js/app.login.js", code).then(err => {
        if (err) {
          console.log("err");
        } else {
          //console.log("JS file successfully updated.");
          return true;
        }
    });    
}
async function confDbJs(mid) {
    let code = await (await fs.readFile(destine+mid+"/bsb/db.js")).toString();

    code = code.replace(/{database}/g,mid);

    fs.writeFile(destine+mid+"/bsb/db.js", code).then(err => {
        if (err) {
          console.log("err");
        } else {
          //console.log("JS file successfully updated.");
          return true;
        }
    });  
}
async function createSchema(body){
    let conn = await db.getConnection();
    let drop = await conn.query("DROP DATABASE IF EXISTS `"+body.id+"`");
    let crea = await conn.query("CREATE DATABASE `"+body.id+"`");    
    conn.end();
    return true;
}
async function createAppCollections(body){
    let conn = await db.getConnection();

    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`bars`");
    await conn.query("CREATE TABLE `"+body.id+"`.`bars` (`id` INT(11) NOT NULL AUTO_INCREMENT,`desc` VARCHAR(256) NULL DEFAULT NULL,`text` TEXT NULL DEFAULT NULL,`date` DATE NULL DEFAULT NULL,`in` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),`level` INT(1) NOT NULL DEFAULT 1,`index` INT(11) NULL DEFAULT 0,PRIMARY KEY (`id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM AUTO_INCREMENT=1");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`components`");
    await conn.query("CREATE TABLE `"+body.id+"`.`components` (`id` VARCHAR(256) NOT NULL,`desc` VARCHAR(256) NULL DEFAULT NULL,`text` TEXT NULL DEFAULT NULL,`date` DATE NULL DEFAULT NULL,`in` TIMESTAMP NULL DEFAULT NULL,`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),PRIMARY KEY (`id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`containers`");
    await conn.query("CREATE TABLE `"+body.id+"`.`containers` (`id` VARCHAR(256) NOT NULL,`desc` VARCHAR(256) NULL DEFAULT NULL,`text` TEXT NULL DEFAULT NULL,`date` DATE NULL DEFAULT NULL,`in` TIMESTAMP NULL DEFAULT NULL,`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),PRIMARY KEY (`id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`entities`");
    await conn.query("CREATE TABLE `"+body.id+"`.`entities` (`id` VARCHAR(256) NOT NULL,`desc` VARCHAR(256) NULL DEFAULT NULL,`text` TEXT NULL DEFAULT NULL,`date` DATE NULL DEFAULT NULL,`in` TIMESTAMP NULL DEFAULT NULL,`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),PRIMARY KEY (`id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`menus`");
    await conn.query("CREATE TABLE `"+body.id+"`.`menus` (`id` INT(11) NOT NULL AUTO_INCREMENT,`desc` VARCHAR(256) NULL DEFAULT NULL,`text` TEXT NULL DEFAULT NULL,`date` DATE NULL DEFAULT NULL,`in` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),`index` INT(11) NULL DEFAULT NULL,PRIMARY KEY (`id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM AUTO_INCREMENT=1");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`options`");
    await conn.query("CREATE TABLE `"+body.id+"`.`options` (`id` INT(11) NOT NULL AUTO_INCREMENT,`desc` VARCHAR(256) NULL DEFAULT NULL,`text` TEXT NULL DEFAULT NULL,`date` DATE NULL DEFAULT NULL,`in` DATETIME NULL DEFAULT NULL,`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),`entity.id` VARCHAR(256) NOT NULL DEFAULT '',`component.id` VARCHAR(256) NOT NULL DEFAULT '',`container.id` VARCHAR(256) NOT NULL DEFAULT '',PRIMARY KEY (`id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM AUTO_INCREMENT=1");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`roles`");
    await conn.query("CREATE TABLE `"+body.id+"`.`roles` (`id` VARCHAR(256) NOT NULL,`desc` VARCHAR(256) NULL DEFAULT NULL,`text` TEXT NULL DEFAULT NULL,`date` DATE NULL DEFAULT NULL,`in` TIMESTAMP NULL DEFAULT NULL,`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),PRIMARY KEY (`id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`role.options`");
    await conn.query("CREATE TABLE `"+body.id+"`.`role.options` (`id` VARCHAR(256) NOT NULL DEFAULT '',`desc` VARCHAR(256) NULL DEFAULT NULL,`text` TEXT NULL DEFAULT NULL,`date` DATE NULL DEFAULT NULL,`in` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),`option.id` INT(11) NOT NULL,`bar.id` INT(11) NOT NULL,`menu.id` INT(11) NOT NULL,`index` INT(11) NULL DEFAULT NULL,`count` INT(11) NOT NULL AUTO_INCREMENT,PRIMARY KEY (`count`)) COLLATE='utf8_general_ci'ENGINE=MyISAM AUTO_INCREMENT=1");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`users`");
    await conn.query("CREATE TABLE `"+body.id+"`.`users` (`id` VARCHAR(128) NOT NULL,`first` VARCHAR(256) NULL DEFAULT NULL,`last` VARCHAR(256) NULL DEFAULT NULL,`password` VARCHAR(128) NULL DEFAULT NULL,`desc` VARCHAR(256) NULL DEFAULT NULL,`text` TEXT NULL DEFAULT NULL,`date` DATE NULL DEFAULT NULL,`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),`in` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00', PRIMARY KEY (`id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`user.desks`");
    await conn.query("CREATE TABLE `"+body.id+"`.`user.desks` (`id` VARCHAR(128) NOT NULL,`desk.id` VARCHAR(128) NOT NULL,`desk.lang` VARCHAR(128) NULL DEFAULT 'es',`state` VARCHAR(50) NULL DEFAULT 'ACTIVO',`date` DATE NULL DEFAULT NULL,`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),`in` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',`count` INT(11) NOT NULL AUTO_INCREMENT,UNIQUE INDEX `count` (`count`),UNIQUE INDEX `usuario.id` (`id`, `desk.id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM AUTO_INCREMENT=1");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`user.roles`");
    await conn.query("CREATE TABLE `"+body.id+"`.`user.roles` (`id` VARCHAR(128) NOT NULL,`role.id` VARCHAR(128) NOT NULL,`state` VARCHAR(50) NULL DEFAULT 'ACTIVO',`date` DATE NULL DEFAULT NULL,`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),`in` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',`count` INT(11) NOT NULL AUTO_INCREMENT,UNIQUE INDEX `count` (`count`),UNIQUE INDEX `usuario.id` (`id`, `role.id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM AUTO_INCREMENT=1");
    await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`sessions`");
    await conn.query("CREATE TABLE `"+body.id+"`.`sessions` (`id` VARCHAR(64) NOT NULL,`time` TIME NULL DEFAULT NULL,`duration` INT(8) NULL DEFAULT NULL,`state` CHAR(10) NULL DEFAULT NULL,`cookie` VARCHAR(64) NULL DEFAULT NULL,`hhost` VARCHAR(64) NULL DEFAULT NULL,`referer` VARCHAR(256) NULL DEFAULT NULL,`agent` VARCHAR(256) NULL DEFAULT NULL,`https` CHAR(8) NULL DEFAULT NULL,`addr` VARCHAR(64) NULL DEFAULT NULL,`host` VARCHAR(64) NULL DEFAULT NULL,`port` VARCHAR(64) NULL DEFAULT NULL,`user` VARCHAR(64) NULL DEFAULT NULL,`method` VARCHAR(64) NULL DEFAULT NULL,`uri` VARCHAR(256) NULL DEFAULT NULL,`desk.lang` CHAR(2) NULL DEFAULT NULL,`desk.id` VARCHAR(64) NULL DEFAULT NULL,`app.id` VARCHAR(128) NULL DEFAULT NULL,`user.id` VARCHAR(64) NULL DEFAULT NULL,`user.name` VARCHAR(64) NULL DEFAULT NULL,`role.id` VARCHAR(64) NULL DEFAULT NULL,`update` TIMESTAMP NOT NULL DEFAULT current_timestamp(),`in` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',PRIMARY KEY (`id`)) COLLATE='utf8_general_ci' ENGINE=MyISAM");

    conn.end();
    return true;
}
async function populateAppCollections(body){
    let conn = await db.getConnection();

    await conn.query("INSERT INTO `"+body.id+"`.`bars` (`id`, `desc`, `text`, `date`, `in`, `update`, `level`, `index`) VALUES (1, 'Dashboards', \"<i class='bi bi-bar-chart px-2' style='font-size: 1.25rem;color: gray;'></i>\", '2021-01-20', '2021-01-20 15:58:08', '2021-01-20 15:58:08', 1, 1)");
    await conn.query("INSERT INTO `"+body.id+"`.`bars` (`id`, `desc`, `text`, `date`, `in`, `update`, `level`, `index`) VALUES (2, 'Registry', \"<i class='bi bi-book px-2' style='font-size: 1.25rem;color: gray;'></i>\", '2021-01-20', '2021-01-20 15:58:31', '2021-01-20 15:58:31', 1, 2)");
    await conn.query("INSERT INTO `"+body.id+"`.`bars` (`id`, `desc`, `text`, `date`, `in`, `update`, `level`, `index`) VALUES (3, 'Generator', \"<i class='bi bi-gear px-2' style='font-size: 1.25rem;color: gray;'></i>\", '2021-01-20', '2021-01-20 16:01:03', '2021-01-20 16:01:03', 1, 3)");
    await conn.query("INSERT INTO `"+body.id+"`.`bars` (`id`, `desc`, `text`, `date`, `in`, `update`, `level`, `index`) VALUES (5, 'Configuration', \"<i class='bi bi-clipboard-check px-2' style='font-size: 1.25rem;color: gray;'></i>\", '2021-01-20', '2021-01-20 16:22:01', '2021-01-20 16:22:01', 1, 5)");
    await conn.query("INSERT INTO `"+body.id+"`.`bars` (`id`, `desc`, `text`, `date`, `in`, `update`, `level`, `index`) VALUES (6, 'Params', \"<i class='bi bi-list-check px-2' style='font-size: 1.25rem;color: gray;'></i>\", '2021-01-24', '2021-01-24 13:47:33', '2021-01-24 13:47:33', 1, 6)");

    await conn.query("INSERT INTO `"+body.id+"`.`components` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('desk', 'Desk', 'Este es un comentario', '2021-01-20', '2021-01-20 15:43:05', '2021-01-20 15:43:05')");
    await conn.query("INSERT INTO `"+body.id+"`.`components` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('login', 'Login', NULL, '2021-01-20', '2021-01-20 15:43:35', '2021-01-20 15:43:35')");
    await conn.query("INSERT INTO `"+body.id+"`.`components` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('logout', 'Logout', NULL, '2021-01-20', '2021-01-20 15:44:02', '2021-01-20 15:44:02')");
    await conn.query("INSERT INTO `"+body.id+"`.`components` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('option', 'Option', NULL, '2021-01-20', '2021-01-20 15:44:18', '2021-01-20 15:44:18')");
    await conn.query("INSERT INTO `"+body.id+"`.`components` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('record', 'Record', NULL, '2021-01-20', '2021-01-20 15:45:40', '2021-01-20 15:45:40')");
    await conn.query("INSERT INTO `"+body.id+"`.`components` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('rept', 'Report', NULL, '2021-01-20', '2021-01-20 15:45:57', '2021-01-20 15:45:57')");
    await conn.query("INSERT INTO `"+body.id+"`.`components` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('search', 'Search', NULL, '2021-01-20', '2021-01-20 15:46:13', '2021-01-20 15:46:13')");
    await conn.query("INSERT INTO `"+body.id+"`.`components` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('form', 'Form', NULL, '2021-01-20', '2021-01-20 15:46:36', '2021-01-20 15:46:36')");
    await conn.query("INSERT INTO `"+body.id+"`.`components` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('upload', 'Upload', NULL, '2021-01-20', '2021-01-20 15:46:51', '2021-01-20 15:46:51');");

    await conn.query("INSERT INTO `"+body.id+"`.`containers` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('div', 'Desk Div', NULL, '2021-01-20', '2021-01-20 15:49:21', '2021-01-20 15:49:21')");
    await conn.query("INSERT INTO `"+body.id+"`.`containers` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('tab', 'Browser Tab', NULL, '2021-01-20', '2021-01-20 15:49:54', '2021-01-20 15:49:54')");
    await conn.query("INSERT INTO `"+body.id+"`.`containers` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('win', 'Browser Window', NULL, '2021-01-20', '2021-01-20 15:50:17', '2021-01-20 15:50:17')");

    await conn.query("INSERT INTO `"+body.id+"`.`entities` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('bar', 'Bar', NULL, '2021-01-20', '2021-01-20 16:34:48', '2021-01-20 16:34:48')");
    await conn.query("INSERT INTO `"+body.id+"`.`entities` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('container', 'Container', NULL, '2021-01-20', '2021-01-20 16:40:35', '2021-01-20 16:40:35')");
    await conn.query("INSERT INTO `"+body.id+"`.`entities` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('component', 'Component', NULL, '2021-01-20', '2021-01-20 16:40:02', '2021-01-20 16:40:02')");
    await conn.query("INSERT INTO `"+body.id+"`.`entities` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('entity', 'Entity', NULL, '2021-01-20', '2021-01-20 16:42:20', '2021-01-20 16:42:20')");
    await conn.query("INSERT INTO `"+body.id+"`.`entities` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('menu', 'Menu', NULL, '2021-01-20', '2021-01-20 16:44:07', '2021-01-20 16:44:07')");
    await conn.query("INSERT INTO `"+body.id+"`.`entities` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('option', 'Option', NULL, '2021-01-20', '2021-01-20 16:44:24', '2021-01-20 16:44:24')");
    await conn.query("INSERT INTO `"+body.id+"`.`entities` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('role', 'Role', NULL, '2021-01-20', '2021-01-20 16:49:52', '2021-01-20 16:49:52')");
    await conn.query("INSERT INTO `"+body.id+"`.`entities` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('user', 'Users', NULL, '2021-01-20', '2021-01-20 17:23:24', '2021-01-20 17:23:24')");
    
    await conn.query("INSERT INTO `"+body.id+"`.`menus` (`id`, `desc`, `text`, `date`, `in`, `update`, `index`) VALUES (1, 'Tasks', 'Comment', '2021-01-20', '2021-01-20 18:17:13', '2021-01-20 18:17:13', 1)");

    await conn.query("INSERT INTO `"+body.id+"`.`options` (`id`, `desc`, `text`, `date`, `in`, `update`, `entity.id`, `component.id`, `container.id`) VALUES (1, 'Bars', 'Comment', '2021-01-20', '2021-03-03 11:08:00', '2021-01-20 17:33:54', 'bar', 'search', 'div')");
    await conn.query("INSERT INTO `"+body.id+"`.`options` (`id`, `desc`, `text`, `date`, `in`, `update`, `entity.id`, `component.id`, `container.id`) VALUES (2, 'Components', NULL, '2021-01-20', '2021-03-03 11:08:03', '2021-01-20 17:45:13', 'component', 'search', 'div')");
    await conn.query("INSERT INTO `"+body.id+"`.`options` (`id`, `desc`, `text`, `date`, `in`, `update`, `entity.id`, `component.id`, `container.id`) VALUES (3, 'Containers', NULL, '2021-01-20', '2021-03-03 11:08:04', '2021-01-20 17:47:13', 'container', 'search', 'div')");
    await conn.query("INSERT INTO `"+body.id+"`.`options` (`id`, `desc`, `text`, `date`, `in`, `update`, `entity.id`, `component.id`, `container.id`) VALUES (4, 'Entities', NULL, '2021-01-20', '2021-03-03 11:08:06', '2021-01-20 17:51:07', 'entity', 'search', 'div')");
    await conn.query("INSERT INTO `"+body.id+"`.`options` (`id`, `desc`, `text`, `date`, `in`, `update`, `entity.id`, `component.id`, `container.id`) VALUES (5, 'Menus', NULL, '2021-01-20', '2021-03-03 11:08:07', '2021-01-20 17:52:56', 'menu', 'search', 'div')");
    await conn.query("INSERT INTO `"+body.id+"`.`options` (`id`, `desc`, `text`, `date`, `in`, `update`, `entity.id`, `component.id`, `container.id`) VALUES (6, 'Options', NULL, '2021-01-20', '2021-03-03 11:08:08', '2021-01-20 17:53:57', 'option', 'search', 'div')");
    await conn.query("INSERT INTO `"+body.id+"`.`options` (`id`, `desc`, `text`, `date`, `in`, `update`, `entity.id`, `component.id`, `container.id`) VALUES (7, 'Roles', NULL, '2021-01-20', '2021-03-03 11:08:10', '2021-01-20 17:56:15', 'role', 'search', 'div')");
    await conn.query("INSERT INTO `"+body.id+"`.`options` (`id`, `desc`, `text`, `date`, `in`, `update`, `entity.id`, `component.id`, `container.id`) VALUES (8, 'Users', NULL, '2021-01-20', '2021-03-03 11:08:12', '2021-01-20 17:58:39', 'user', 'search', 'div')");

    await conn.query("INSERT INTO `"+body.id+"`.`roles` (`id`, `desc`, `text`, `date`, `in`, `update`) VALUES ('administrator', 'Administrator', NULL, '2021-03-14', '2021-03-14 15:03:17', '2021-03-14 15:03:18')");

    await conn.query("INSERT INTO `"+body.id+"`.`role.options` (`id`, `desc`, `text`, `date`, `in`, `update`, `option.id`, `bar.id`, `menu.id`, `index`, `count`) VALUES ('administrator', 'Bars', '', '2021-01-20', '2021-01-20 18:16:14', '2021-01-20 18:16:14', 1, 6, 1, 1, 1)");
    await conn.query("INSERT INTO `"+body.id+"`.`role.options` (`id`, `desc`, `text`, `date`, `in`, `update`, `option.id`, `bar.id`, `menu.id`, `index`, `count`) VALUES ('administrator', 'Components', '', '2021-01-20', '2021-01-20 18:22:07', '2021-01-20 18:22:07', 2, 6, 1, 2, 2)");
    await conn.query("INSERT INTO `"+body.id+"`.`role.options` (`id`, `desc`, `text`, `date`, `in`, `update`, `option.id`, `bar.id`, `menu.id`, `index`, `count`) VALUES ('administrator', 'Containers', '', '2021-01-20', '2021-01-20 18:23:06', '2021-01-20 18:23:06', 3, 6, 1, 3, 3)");
    await conn.query("INSERT INTO `"+body.id+"`.`role.options` (`id`, `desc`, `text`, `date`, `in`, `update`, `option.id`, `bar.id`, `menu.id`, `index`, `count`) VALUES ('administrator', 'Entities', '', '2021-01-20', '2021-01-20 18:27:19', '2021-01-20 18:27:19', 4, 6, 1, 4, 4)");
    await conn.query("INSERT INTO `"+body.id+"`.`role.options` (`id`, `desc`, `text`, `date`, `in`, `update`, `option.id`, `bar.id`, `menu.id`, `index`, `count`) VALUES ('administrator', 'Menus', '', '2021-01-20', '2021-01-20 18:29:23', '2021-01-20 18:29:23', 5, 6, 1, 5, 5)");
    await conn.query("INSERT INTO `"+body.id+"`.`role.options` (`id`, `desc`, `text`, `date`, `in`, `update`, `option.id`, `bar.id`, `menu.id`, `index`, `count`) VALUES ('administrator', 'Options', '', '2021-01-20', '2021-01-20 18:30:57', '2021-01-20 18:30:57', 6, 6, 1, 6, 6)");
    await conn.query("INSERT INTO `"+body.id+"`.`role.options` (`id`, `desc`, `text`, `date`, `in`, `update`, `option.id`, `bar.id`, `menu.id`, `index`, `count`) VALUES ('administrator', 'Roles', '', '2021-01-20', '2021-01-20 18:34:28', '2021-01-20 18:34:28', 7, 5, 1, 7, 7)");
    await conn.query("INSERT INTO `"+body.id+"`.`role.options` (`id`, `desc`, `text`, `date`, `in`, `update`, `option.id`, `bar.id`, `menu.id`, `index`, `count`) VALUES ('administrator', 'Users', '', '2021-01-20', '2021-01-20 18:37:10', '2021-01-20 18:37:10', 8, 5, 1, 8, 8)");

    await conn.query("INSERT INTO `"+body.id+"`.`users` (`id`, `first`, `last`, `password`, `desc`, `text`, `date`, `update`, `in`) VALUES ('admin@"+body.id+"', 'Administrador', 'System', \"13f1afe813d35dba7a3fc112cb236ca9$a69747758044af0a8b4eca13429eceb8a84e6896036302368776f50874cd63cd\", 'Administrator System', 'Con todos los permisos', '2017-11-26', '2017-11-26 16:19:09', '2018-01-05 19:02:26')");

    await conn.query("INSERT INTO `"+body.id+"`.`user.desks` (`id`, `desk.id`, `desk.lang`, `state`, `date`, `update`, `in`, `count`) VALUES ('admin@"+body.id+"', 'dashboard', 'es', 'ACTIVO', '2021-01-14', '2021-01-14 14:53:30', '2021-01-14 14:53:30', 1)");
  
    await conn.query("INSERT INTO `"+body.id+"`.`user.roles` (`id`, `role.id`, `state`, `date`, `update`, `in`, `count`) VALUES ('admin@"+body.id+"', 'administrator', 'ACTIVO', '2021-01-14', '2021-01-14 11:33:07', '2021-01-14 11:33:33', 1)");

    conn.end();
    return true;
}
async function createCollection(body,table){
    let conn = await db.getConnection();
    let coll = await getCollection(body.id,table,body['class.id']);
               await conn.query("DROP TABLE IF EXISTS `"+body.id+"`.`"+table+"`");
               await conn.query(coll);
    let trig = await getTrigger('localhost',body.id,table);
               await conn.query("DROP TRIGGER IF EXISTS `"+body.id+"`.`"+table+"_before_insert`");
			   await conn.query(trig);
    conn.end();
    return true;
}
async function createClassXml(body,collection){
    let data = await getClassProperties(body['class.id']);
    let root = builder.create('model',{encoding: 'UTF-8'});
    let clas = root.ele('class').att('name',body['class.id']);
    let lkey = "";
    for(let item of data) {
        const {pid,type,length,key} = item; 
        let prop = clas.ele('property').att('id',pid);
        prop.ele('type',type);
        prop.ele('length',length);
        if(key=="yes"){lkey=pid};            
    }
    let mapp = root.ele('mapper');
    let mcla = mapp.ele('class');
    mcla.att('name',body['class.id']);
    mcla.att('collection',collection);
    mcla.att('type','table');
    mcla.att('key',lkey);
    var xml = root.end({ pretty: true});
    //console.log(xml);
    fs.writeFile(destine+body.id+"/xml/model/"+body['class.id']+".xml", formatXml(xml, {collapseContent: true})).then(err => {
        if (err) {
			console.log("err");
			return false;
        } else {
			console.log("Xml file successfully updated.");
			return true;
        }
    });
}
async function createXmlRecord(clas,vid,mid){
    let data = await getRecordProperties(vid);
    let root = builder.create('view',{encoding: 'UTF-8'});
    root.ele('class',clas);
    for(let item of data) {
        const {rid,tag,type,readonly,disabled,columns} = item; 
        let elem = root.ele('element').att('id',rid);
        let attr = elem.ele('attributes');
        attr.ele('tag',tag);
        attr.ele('type',type);
        attr.ele('readonly',readonly);
        attr.ele('disabled',disabled);
        attr.ele('columns',columns);        
    }
    var xml = root.end({ pretty: true});
    //console.log(xml);
    fs.writeFile(destine+mid+"/xml/view/"+clas+".record.xml", formatXml(xml, {collapseContent: true})).then(err => {
        if (err) {
          console.log("err");
		  return false;
        } else {
          console.log("Xml file successfully updated.");
		  return true;
        }
    })
}
async function createXmlSearch(clas,vid,mid){
    let data = await getSearchProperties(vid);
    let root = builder.create('view',{encoding: 'UTF-8'});
    root.att('type','grid')
    root.ele('model',clas);
    let row = root.ele('row').att('id','thead');
    for(let item of data) {
        const {sid,index,header,width,visible} = item; 
        let colu = row.ele('column').att('id',sid);
        let attr = colu.ele('attributes');
        attr.ele('index',index);
        attr.ele('type','text');
        attr.ele('header',header);
        attr.ele('width',width);
        attr.ele('visible',visible);
    }
    var xml = root.end({ pretty: true});
    //console.log(xml);
    fs.writeFile(destine+mid+"/xml/view/"+clas+".search.xml", formatXml(xml, {collapseContent: true})).then(err => {
        if (err) {
          console.log("err");
		  return false;
        } else {
          console.log("Xml file successfully updated.");
		  return true;
        }
    })
}
async function createXmlForm(clas,vid,mid){
    let data = await getFormProperties(vid);
    let root = builder.create('view',{encoding: 'UTF-8'});
	root.att('type','form')	
	let master = root.ele('master').att('class',clas.split(".").shift());
	let detail = root.ele('detail').att('class',clas);
    let row = detail.ele('row').att('id','thead');	
    for(let item of data) {
		const {cid,pid,tag,type,readonly,disabled,required,index,header,width,visible} = item;
		if(clas.split(".").shift()==cid){
			let elem = master.ele('element').att('id',pid);
			let attr = elem.ele('attributes');
			attr.ele('tag',tag);
			attr.ele('type',type);
			attr.ele('readonly',readonly);
			attr.ele('disabled',disabled);
			attr.ele('columns',width);
		}

		if(clas==cid){
			let colu = row.ele('column').att('id',pid);
			let attr = colu.ele('attributes');
			attr.ele('index',index);
			attr.ele('type','text');
			attr.ele('header',header);
			attr.ele('width',width);
			attr.ele('visible',visible);			
		}
    }	
    var xml = root.end({ pretty: true});
    //console.log(xml);
    fs.writeFile(destine+mid+"/xml/view/"+clas+".form.xml", formatXml(xml, {collapseContent: true})).then(err => {
        if (err) {
          console.log("err");
		  return false;
        } else {
          console.log("Xml file successfully updated.");
		  return true;
        }
    })
}
async function createJsRecord(clas,mid){
    let ts = Date.now();

    let date_ob = new Date(ts);
    let hoy = date_ob.getFullYear()+"-"+(date_ob.getMonth() + 1)+"-"+date_ob.getDate();  

    let code = await (await fs.readFile(source_temple+"js/view.record.js")).toString();

    code = code.replace(/{view}/g,clas);
    code = code.replace(/{date}/g,hoy);
    code = code.replace(/{view_desc}/g,clas.capitalize());    

    fs.writeFile(destine+mid+"/res/js/"+clas+".record.js", code).then(err => {
        if (err) {
          console.log("err");
		  return false;
        } else {
          console.log("Xml file successfully updated.");
		  return true;
        }
    });
}
async function createJsSearch(clas,mid){
    let ts = Date.now();

    let date_ob = new Date(ts);
    let hoy = date_ob.getFullYear()+"-"+(date_ob.getMonth() + 1)+"-"+date_ob.getDate();  

    let code = await (await fs.readFile(source_temple+"js/view.search.js")).toString();

    code = code.replace(/{view}/g,clas);
    code = code.replace(/{date}/g,hoy);
    code = code.replace(/{view_desc}/g,clas.capitalize());    

    fs.writeFile(destine+mid+"/res/js/"+clas+".search.js", code).then(err => {
        if (err) {
          console.log("err");
		  return false;
        } else {
          console.log("Xml file successfully updated.");
		  return true;
        }
    });
}
async function createJsForm(clas,mid){
    let ts = Date.now();

    let date_ob = new Date(ts);
    let hoy = date_ob.getFullYear()+"-"+(date_ob.getMonth() + 1)+"-"+date_ob.getDate();  

    let code = await (await fs.readFile(source_temple+"js/view.form.js")).toString();
	let clase = clas.split(".").shift();
    code = code.replace(/{view}/g,clase);
    code = code.replace(/{date}/g,hoy);
    code = code.replace(/{view_desc}/g,clase.capitalize());
    code = code.replace(/{viewGrid}/g,clas);
    code = code.replace(/{viewGridDesc}/g,clas.capitalize());	
    fs.writeFile(destine+mid+"/res/js/"+clas+".form.js", code).then(err => {
        if (err) {
          console.log("err");
		  return false;
        } else {
          console.log("Xml file successfully updated.");
		  return true;
        }
    });	
}
async function createJsAccordion(clas,vid,mid){
    let data = await getFormProperties(vid);
    let ts = Date.now();
    let date_ob = new Date(ts);
    let hoy = date_ob.getFullYear()+"-"+(date_ob.getMonth() + 1)+"-"+date_ob.getDate();  
    let code = await (await fs.readFile(source_temple+"js/view.accordion.js")).toString();
    let acco = code.slice((code.indexOf('BEGIN ACCORDION')+'BEGIN ACCORDION'.length),code.indexOf('END ACCORDION'));
    let bacc = "/*BEGIN ACCORDION loadSearchAccordion('{assoc}',id,2,'{assoc_desc}'); END ACCORDION*/"

    code = code.replace(/{view}/g,clas);
    code = code.replace(/{date}/g,hoy);
    code = code.replace(/{view_desc}/g,clas.capitalize());
    code = code.replace(bacc,"");
    let accos = "";
    for(let item of data) {
        const {cid,index,type,label} = item;
        //console.log(cid+"<>"+index+"<>"+type+"<>"+label);
        if(cid.split(".").pop()=="search"){
            let lacco = acco;
            lacco = lacco.replace(/{assoc}/g,cid).replace(/{assoc_desc}/g,label);
            accos += lacco+"\n";
        }
    }
    code = code.replace(/{search_accordions}/g,accos);
    fs.writeFile(destine+mid+"/res/js/"+clas+".accordion.js", code).then(err => {
        if (err) {
          console.log("err");
		  return false;
        } else {
          console.log("Xml file successfully updated.");
		  return true;
        }
    });
}
async function createHtmlAppLogin(body){
    let code = await (await fs.readFile(source_temple+"html/app.login.html")).toString();
    code = code.replace(/{title}/g,body.desc);

    fs.writeFile(destine+body.id+"/"+body.lang+"/"+body.lang+".app.login.html", code).then(err => {
        if (err) {
          console.log("err");
        } else {
          //console.log("JS file successfully updated.");
        }
    });
}
async function createHtmlAppDesk(body){
    let code = await (await fs.readFile(source_temple+"html/app.desk.html")).toString();
    code = code.replace(/{title}/g,body.desc);

    fs.writeFile(destine+body.id+"/"+body.lang+"/"+body.lang+".app.desk.html", code).then(err => {
        if (err) {
          console.log("err");
        } else {
          //console.log("JS file successfully updated.");
        }
    });
}
async function createHtmlRecord(clas,vid,mid,lang){
    let data = await getRecordProperties(vid);
    let code = await (await fs.readFile(source_temple+"html/view.record.html")).toString();
    let dtyp = "<!DOCTYPE html>";
    let html = code.slice(code.indexOf('<html>'),code.indexOf('</html>')+'</html>'.length);
    let inpu = code.slice((code.indexOf('BEGIN INPUT')+'BEGIN INPUT'.length),code.indexOf('END INPUT'));
    let sele = code.slice((code.indexOf('BEGIN SELECT')+'BEGIN SELECT'.length),code.indexOf('END SELECT'));
    let text = code.slice((code.indexOf('BEGIN TEXT')+'BEGIN TEXT'.length),code.indexOf('END TEXT'));
    let remo = code.slice((code.indexOf('BEGIN BUTTON REMOVE')+'BEGIN BUTTON REMOVE'.length),code.indexOf('END BUTTON REMOVE'));
    let save = code.slice((code.indexOf('BEGIN BUTTON SAVE')+'BEGIN BUTTON SAVE'.length),code.indexOf('END BUTTON SAVE'));    

    html = dtyp+"\n"+html.replace(/{class}/g,clas);
    remo = remo.replace(/{class}/g,clas);
    save = save.replace(/{class}/g,clas);

    let elems = "";
    let butts = remo+save;    

    for(let item of data) {
        const {rid,tag,type,readonly,disabled,columns,required,label} = item;
        if(tag=="input"){ 
            let linpu = inpu; 
            linpu = linpu.replace(/{class}/g,clas).replace(/{rid}/g,rid).replace(/{label}/g,label).replace(/{type}/g,type).replace(/{col}/g,columns);
            if(readonly=="yes"){ linpu = linpu.replace(/{readonly}/g,'readonly'); }else{ linpu = linpu.replace(/{readonly}/g,''); }
            if(required=="yes"){ linpu = linpu.replace(/{required}/g,'required'); }else{ linpu = linpu.replace(/{required}/g,''); }
            if(disabled=="yes"){ linpu = linpu.replace(/{disabled}/g,'disabled'); }else{ linpu = linpu.replace(/{disabled}/g,''); }
            elems += linpu;
        }
        if(tag=="select"){ 
            let lsele = sele; 
            lsele = lsele.replace(/{class}/g,clas).replace(/{rid}/g,rid).replace(/{label}/g,label).replace(/{col}/g,columns);
            if(readonly=="yes"){ lsele = lsele.replace(/{readonly}/g,'readonly'); }else{ lsele = lsele.replace(/{readonly}/g,''); }
            if(required=="yes"){ lsele = lsele.replace(/{required}/g,'required'); }else{ lsele = lsele.replace(/{required}/g,''); }
            if(disabled=="yes"){ lsele = lsele.replace(/{disabled}/g,'disabled'); }else{ lsele = lsele.replace(/{disabled}/g,''); }
            elems += lsele;
        }
        if(tag=="textarea"){ 
            let ltext = text; 
            ltext = ltext.replace(/{class}/g,clas).replace(/{rid}/g,rid).replace(/{label}/g,label).replace(/{col}/g,columns);
            if(readonly=="yes"){ ltext = ltext.replace(/{readonly}/g,'readonly'); }else{ ltext = ltext.replace(/{readonly}/g,''); }
            if(required=="yes"){ ltext = ltext.replace(/{required}/g,'required'); }else{ ltext = ltext.replace(/{required}/g,''); }
            if(disabled=="yes"){ ltext = ltext.replace(/{disabled}/g,'disabled'); }else{ ltext = ltext.replace(/{disabled}/g,''); }
            elems += ltext;
        }
    }
    html = html.replace(/{elements}/g,elems);
    html = html.replace(/{buttons}/g,butts);
    fs.writeFile(destine+mid+"/"+lang+"/"+lang+"."+clas+".record.html", html).then(err => {
        if (err) {
          console.log("err");
		  return false;
        } else {
          console.log("Xml file successfully updated.");
		  return true;
        }
    });
}
async function createHtmlSearch(clas,mid,lang){
    let code = await (await fs.readFile(source_temple+"html/view.search.html")).toString();
    code = code.replace(/{class}/g,clas);

    fs.writeFile(destine+mid+"/"+lang+"/"+lang+"."+clas+".search.html", code).then(err => {
        if (err) {
          console.log("err");
		  return false;
        } else {
          console.log("Xml file successfully updated.");
		  return true;
        }
    });
}
async function createHtmlForm(clas,vid,mid,lang){
    let data = await getFormProperties(vid);
    let code = await (await fs.readFile(source_temple+"html/view.form.html")).toString();
    let dtyp = "<!DOCTYPE html>";
    let html = code.slice(code.indexOf('<html>'),code.indexOf('</html>')+'</html>'.length);
    let inpu = code.slice((code.indexOf('BEGIN INPUT')+'BEGIN INPUT'.length),code.indexOf('END INPUT'));
    let sele = code.slice((code.indexOf('BEGIN SELECT')+'BEGIN SELECT'.length),code.indexOf('END SELECT'));
    let text = code.slice((code.indexOf('BEGIN TEXT')+'BEGIN TEXT'.length),code.indexOf('END TEXT'));
    let remo = code.slice((code.indexOf('BEGIN BUTTON REMOVE')+'BEGIN BUTTON REMOVE'.length),code.indexOf('END BUTTON REMOVE'));
    let save = code.slice((code.indexOf('BEGIN BUTTON SAVE')+'BEGIN BUTTON SAVE'.length),code.indexOf('END BUTTON SAVE'));
	let clase = clas.split(".").shift();
    html = dtyp+"\n"+html.replace(/{class}/g,clase);
    remo = remo.replace(/{class}/g,clase);
    save = save.replace(/{class}/g,clase);
    html = html.replace(/{classGrid}/g,clas);
	
    let elems = "";
    let butts = remo+save;    

    for(let item of data) {
        const {cid,pid,tag,type,readonly,disabled,required,index,header,width,visible} = item;
		if(clase==cid){		
			if(tag=="input"){ 
				let linpu = inpu; 
				linpu = linpu.replace(/{class}/g,clase).replace(/{rid}/g,pid).replace(/{label}/g,header).replace(/{type}/g,type).replace(/{col}/g,width);
				if(readonly=="yes"){ linpu = linpu.replace(/{readonly}/g,'readonly'); }else{ linpu = linpu.replace(/{readonly}/g,''); }
				if(required=="yes"){ linpu = linpu.replace(/{required}/g,'required'); }else{ linpu = linpu.replace(/{required}/g,''); }
				if(disabled=="yes"){ linpu = linpu.replace(/{disabled}/g,'disabled'); }else{ linpu = linpu.replace(/{disabled}/g,''); }
				elems += linpu;
			}
			if(tag=="select"){ 
				let lsele = sele; 
				lsele = lsele.replace(/{class}/g,clase).replace(/{rid}/g,pid).replace(/{label}/g,header).replace(/{col}/g,width);
				if(readonly=="yes"){ lsele = lsele.replace(/{readonly}/g,'readonly'); }else{ lsele = lsele.replace(/{readonly}/g,''); }
				if(required=="yes"){ lsele = lsele.replace(/{required}/g,'required'); }else{ lsele = lsele.replace(/{required}/g,''); }
				if(disabled=="yes"){ lsele = lsele.replace(/{disabled}/g,'disabled'); }else{ lsele = lsele.replace(/{disabled}/g,''); }
				elems += lsele;
			}
			if(tag=="textarea"){ 
				let ltext = text; 
				ltext = ltext.replace(/{class}/g,clase).replace(/{rid}/g,pid).replace(/{label}/g,header).replace(/{col}/g,width);
				if(readonly=="yes"){ ltext = ltext.replace(/{readonly}/g,'readonly'); }else{ ltext = ltext.replace(/{readonly}/g,''); }
				if(required=="yes"){ ltext = ltext.replace(/{required}/g,'required'); }else{ ltext = ltext.replace(/{required}/g,''); }
				if(disabled=="yes"){ ltext = ltext.replace(/{disabled}/g,'disabled'); }else{ ltext = ltext.replace(/{disabled}/g,''); }
				elems += ltext;
			}
		}
    }
    html = html.replace(/{elements}/g,elems);
    html = html.replace(/{buttons}/g,butts);
    fs.writeFile(destine+mid+"/"+lang+"/"+lang+"."+clas+".form.html", html).then(err => {
        if (err) {
          console.log("err");
		  return false;
        } else {
          console.log("Xml file successfully updated.");
		  return true;
        }
    });
}
async function createHtmlAccordion(clas,vid,mid,lang){
    let data = await getFormProperties(vid);
    let code = await (await fs.readFile(source_temple+"html/view.accordion.html")).toString();
    let dtyp = "<!DOCTYPE html>";
    let html = code.slice(code.indexOf('<html>'),code.indexOf('</html>')+'</html>'.length);
    let acco = code.slice((code.indexOf('BEGIN ACCORDION')+'BEGIN ACCORDION'.length),code.indexOf('END ACCORDION'));

    html = dtyp+"\n"+html.replace(/{class}/g,clas);
    let accos = "";    
    for(let item of data) {
        const {cid,index,type,label} = item;
        //console.log(cid+"<>"+index+"<>"+type+"<>"+label);
        let lacco = acco;
        lacco = lacco.replace(/{class}/g,clas).replace(/{cid}/g,cid).replace(/{index}/g,index).replace(/{type}/g,type).replace(/{type}/g,type).replace(/{label}/g,label);
        accos += lacco;
    }    
    html = html.replace(/{accordions}/g,accos);
    fs.writeFile(destine+mid+"/"+lang+"/"+lang+"."+clas+".accordion.html", html).then(err => {
        if (err) {
          console.log("err");
        } else {
          //console.log("JS file successfully updated.");
        }
    });
}
async function insertClassProperties(body){
    let conn = await db.getConnection();
    let type  = body.autoincrement == "yes"  ? "integer":"string";
    let length = body.autoincrement == "yes"  ? "11":"128";

    conn.query("INSERT INTO `class.properties` (`id`,`pid`,`type`,`length`,`key`,`null`,`default`,`order`) VALUES ('"+body.id+"','id','"+type+"',"+length+",'yes','no','',1)");
    conn.query("INSERT INTO `class.properties` (`id`,`pid`,`type`,`length`,`key`,`null`,`default`,`order`) VALUES ('"+body.id+"','desc','varchar','256','no','yes','',2)");
    conn.query("INSERT INTO `class.properties` (`id`,`pid`,`type`,`length`,`key`,`null`,`default`,`order`) VALUES ('"+body.id+"','text','text','0','no','yes','',3)");
    conn.query("INSERT INTO `class.properties` (`id`,`pid`,`type`,`length`,`key`,`null`,`default`,`order`) VALUES ('"+body.id+"','date','date','14','no','yes','',4)");
    conn.query("INSERT INTO `class.properties` (`id`,`pid`,`type`,`length`,`key`,`null`,`default`,`order`) VALUES ('"+body.id+"','in','timestamp','14','no','no','0000-00-00 00:00:00',5)");
    conn.query("INSERT INTO `class.properties` (`id`,`pid`,`type`,`length`,`key`,`null`,`default`,`order`) VALUES ('"+body.id+"','update','timestamp','14','no','no','current_timestamp()',6)");            

    connection.end();    
    return;
}
async function insertViewRecordElements(body,data){
    let conn = await db.getConnection();
    for(let item of data) {
        let tag = "input";
        let ron = "no";
        let dis = "no";
        let col = "4";
        let rqr = "yes";
        const {pid,type,length,key,order} = item; 
        if(type=="text"){tag="textarea"}
        if(pid=="count"){ron="yes"}
        if(pid=="id" && type=="integer"){ron="yes"}
        conn.query("INSERT INTO `view.records` (`id`,`rid`,`tag`,`type`,`readonly`,`disabled`,`columns`,`required`,`label`,`order`) VALUES ('"+body.id+"','"+pid+"','"+tag+"','"+type+"','"+ron+"','"+dis+"','"+col+"','"+rqr+"','"+pid.capitalize()+"','"+order+"')");
    }
    connection.end();    
    return;
}
async function insertViewSearchColumns(body,data){
    let conn = await db.getConnection();
    for(let item of data) {
        const {pid,type,length,key,order} = item; 
        conn.query("INSERT INTO `view.searches` (`id`,`sid`,`index`,`header`,`width`,`visible`) VALUES ('"+body.id+"','"+pid+"','"+order+"','"+pid.toUpperCase()+"','"+length+"','yes')");
    }
    connection.end();    
    return;
}
async function insertViewFormColumns(body,dataMaster,dataDetail){
    let conn = await db.getConnection();
    for(let item of dataMaster) {
        const {pid,type,length,key,order} = item;
        conn.query("INSERT INTO `view.forms` (`id`,`cid`,`pid`,`index`,`header`,`width`,`visible`) VALUES ('"+body.id+"','"+body.id.replace(/.form/g,"").split(".").shift()+"','"+pid+"','"+order+"','"+pid.toUpperCase()+"','"+length+"','yes')");
    }
    for(let item of dataDetail) {
        const {pid,type,length,key,order} = item;
        conn.query("INSERT INTO `view.forms` (`id`,`cid`,`pid`,`index`,`header`,`width`,`visible`) VALUES ('"+body.id+"','"+body.id.replace(/.form/g,"")+"','"+pid+"','"+order+"','"+pid.toUpperCase()+"','"+length+"','yes')");
    }	
    connection.end();    
    return;
}
//-------------------------------------------------------//
// LEVEL 3
async function getCollection(apid,table,cid){
    let conn = await db.getConnection();
    let sql = "SELECT `id`,`pid`,`type`,`length`,`key`,`null` as `nulo`,`default` as `defecto` FROM `class.properties` WHERE `id` = ? ORDER BY `order`";
    const rowSet = await conn.query(sql,[cid]);
    conn.end();
    let columns = "";
    let autoincrement = "";
    let indexes = "";
    for(let item of rowSet) {
        const {id,pid,type,length,key,nulo,defecto} = item;
        let nul = "NOT NULL";
        let def = "";
        if(nulo=="yes"){nul="NULL"}
        if(defecto){
            let func = defecto.split("()");
            if(func.length>0){
                def= " DEFAULT '"+defecto+"'";
            }else{
                def= " DEFAULT '"+defecto+"'";
            }
        }else{
            def = "";
        }
        if(pid=='id' && type=='integer'){autoincrement="AUTO_INCREMENT=1";}
        if(key=="yes"){
            if(type=="integer"){
                columns += "`"+pid+"` INT("+length+") "+nul+" AUTO_INCREMENT,\n";
            }else{
                columns += "`"+pid+"` VARCHAR("+length+") "+nul+",\n";
            }
            indexes += "UNIQUE INDEX `"+pid+"` (`"+pid+"`)";
        }else{
            if(type=="integer"){columns += "`"+pid+"` INT("+length+") "+nul+def+",\n";}
            if(type=="string"){columns += "`"+pid+"` VARCHAR("+length+") "+nul+def+",\n";}
            if(type=="date"){columns += "`"+pid+"` DATE "+nul+def+",\n";}
            if(type=="datetime"){columns += "`"+pid+"` DATETIME "+nul+def+",\n";}
            if(type=="decimal"){columns += "`"+pid+"` DECIMAL("+length+",2) "+nul+def+",\n";}
            if(type=="float"){columns += "`"+pid+"` FLOAT("+length+") "+nul+def+",\n";}
            if(type=="text"){columns += "`"+pid+"` TEXT "+nul+" "+def+",\n";}
            if(type=="time"){columns += "`"+pid+"` VARCHAR("+length+") "+nul+def+",\n";}
            if(type=="timestamp"){
                if(pid.toUpperCase()=="IN"){columns += "`"+pid+"` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',\n";}
                if(pid.toUpperCase()=="UPDATE"){columns += "`"+pid+"` TIMESTAMP DEFAULT current_timestamp(),\n";}                
            }
        }
    }
    let query = "CREATE TABLE `"+apid+"`.`"+table+"` ("+columns+indexes+") COLLATE='utf8_general_ci' ENGINE=MyISAM "+autoincrement;
    //console.log(query);
    return query;
}
async function getTrigger(host,database,table){
    let trig ="USE `"+database+"`; CREATE DEFINER=`root`@`"+host+"` TRIGGER `"+table+"_before_insert` BEFORE INSERT ON `"+table+"` FOR EACH ROW BEGIN SET NEW.in = NOW();END;";
    return trig;
}
async function getClassProperties(id){
    let conn = await db.getConnection();
    let sql = "SELECT `pid`,`type`,`length`,`key`,`order` FROM `class.properties` WHERE `id` = ? ORDER BY `order`";
    const rowSet = await conn.query(sql,id);
	//console.log(rowSet);
    conn.end();
    return rowSet;
}
async function getRecordProperties(vid){
    let conn = await db.getConnection();
    let sql = "SELECT `rid`,`tag`,`type`,`readonly`,`disabled`,`columns`,`required`,`label` FROM `view.records` WHERE `id` = ? ORDER BY `order`";
    const rowSet = await conn.query(sql,vid);
    conn.end();
    return rowSet;
}
async function getSearchProperties(vid){
    let conn = await db.getConnection();
    let sql = "SELECT `sid`,`index`,`header`,`width`,`visible` FROM `view.searches` WHERE `id` = ? ORDER BY `index`";
    const rowSet = await conn.query(sql,vid);
    conn.end();
    return rowSet;
}
async function getFormProperties(vid){
    let conn = await db.getConnection();
    let sql = "SELECT `cid`,`pid`,`tag`,`type`,`readonly`,`disabled`,`required`,`index`,`header`,`width`,`visible` FROM `view.forms` WHERE `id` = ? ORDER BY `index`";
	//console.log(sql+">"+vid);
    const rowSet = await conn.query(sql,vid);
    conn.end();
    return rowSet;
}
//-------------------------------------------------------//
// AUXILIAR
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}