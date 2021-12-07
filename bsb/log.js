//-------------------------------------------------------//
//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: /bsb/login.js
// Created: 2019-11-12
// Updates: 2019-11-12,2020-01-14
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const db        = require('./db.js');
const moment    = require('moment')
const crypto    = require('crypto');
const fetch     = require('isomorphic-fetch');
const fs = require('fs');
const { transform } = require('camaro');
//-------------------------------------------------------//
// LEVEL 1
this.in = async function(req , res){
    let userId  = req.body.login;
    let password = req.body.password;
    let appid	= req.body.appid;
    try {
        let user = await getUser(userId);			
        if (user== null){res.status(200).json({'sid':""});return;}
        let pChk = await checkPass(password,user.password);
        if (pChk == false) {res.status(200).json({'sid':""});return}
        let sessionId  = await getSessionId();
        let inOk = await insertSession(user,sessionId,appid);
        res.status(200).json({'sid':sessionId});
    } catch (err) {
        console.log(err.message);
    }
}
this.out = async function(req , res){
    let sid = req.body.sid;
    try {
        const returnedData = await logout(sid);
        res.status(200).json(returnedData);
    } catch (err) {
        console.log(err.message);
    }
}
this.crypt = function(req , res){
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(req.body.pass, salt, 2048, 32, 'sha512').toString('hex');
    res.status(200).json([salt, hash].join('$'));    
}
this.captcha = function(req , res){
    const secret_key = "6Lc2W88ZAAAAAMDDuOj_WWYrtTO4uBs4MXxDhLFe";
    const token = req.body.token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;
    fetch(url, {
        method: 'post'
    })
        .then(response => response.json())
        .then(google_response => res.json({ google_response }))
        .catch(error => res.json({ error }));
}
//-------------------------------------------------------//
// LEVEL 2
async function getUser(id){
	let authenticationClasses    = await getAuthenticationClasses();
	let authenticationProperties = await getAuthenticationProperties();

	let classesCollection = await getClassesCollection();
	let classesProperties = await buildClassProperties(authenticationProperties);

	let userData = await getClassData(classesProperties['user'],classesCollection['user'],authenticationClasses['user'],id);
	let deskData = await getClassData(classesProperties['desk'],classesCollection['user.desk'],authenticationClasses['user.desk'],id);
	let roleData = await getClassData(classesProperties['role'],classesCollection['user.role'],authenticationClasses['user.role'],id);

	const user = {...userData,...deskData,...roleData}	
    return user;
}
async function checkPass(pass,dbpass) {
    const originalHash = dbpass.split('$')[1];
    const salt = dbpass.split('$')[0];
    const hash = crypto.pbkdf2Sync(pass, salt, 2048, 32, 'sha512').toString('hex');
    return hash === originalHash
}
async function getSessionId() {
    return new Promise((resolve, reject) => {
        resolve(crypto.randomBytes(24).toString('base64'));
    });
}
async function insertSession(user,sid,appid,view){
    let conn = await db.getConnection();
    let time = moment().format('hh:mm:ss')
    let duration = 120;
    let state = "ABIERTO";
	let name = user.first + " " +user.last;
    let sql = "INSERT INTO sessions (`id`,`time`,`duration`,`state`,`desk.id`,`desk.lang`,`user.id`,`user.name`,`app.id`,`role.id`) VALUES (?,?,?,?,?,?,?,?,?,?)";
    const results = await conn.query(sql,[sid,time,duration,state,user['desk.id'],user['desk.lang'],user.id,name,appid,user['role.id']]);
    conn.end();
    return results.affectedRows;
}
async function logout(sid){
    let conn = await db.getConnection();
    const rows = await conn.query("UPDATE `sessions` SET `state`='CERRADO' WHERE `id`= ? ",[sid]);
    conn.end();
    return rows[0];
}
//-------------------------------------------------------//
// LEVEL 3
async function getAuthenticationClasses() {
	const xml  = fs.readFileSync("./xml/app.xml", "utf8");
    const template  = {
        'keys': ['/control/authentication/keys/key', 
            {
                'clase': '@class',
				'id' : '@id'
            }
        ]
    };	
    let data = await transform(xml, template);
	let keyCls = {}
	for (var k in data.keys) {
		const { clase, id } = data.keys[k];
		keyCls[clase] = id;
	}
    return keyCls;
}
async function getAuthenticationProperties(){
	const xml  = fs.readFileSync("./xml/app.xml", "utf8");
    const template  = {
        property: ['/control/authentication/property', 
            {
                id: '@id',
            }
        ]
    };	
    let data = await transform(xml, template);
    return data;	
}
async function getClassesCollection() {
	const xml  = fs.readFileSync("./xml/app.xml", "utf8");
    const template  = {
        'mapper': ['/mapper/class', 
            {
                'name': '@name',
				'collection' : '@collection'
            }
        ]
    };	
    let data = await transform(xml, template);
	let modCls = {}
	for (var k in data.mapper) {
		const { name, collection } = data.mapper[k];
		modCls[name] = collection;
	}
    return modCls;
}
async function buildClassProperties(model){
    let colStr = {};
    for(let item in model['property']){
        for(let name in model['property'][item]){
			pro = model['property'][item][name];
			let dom = pro.split(".");
			if(dom[0]=='user'){
				colStr[dom[0]] += "`" + dom[1] + "`,"				
			}else{
				colStr[dom[0]] += "`" + pro + "`,"
			}
        }
    }
    return colStr;
}
async function getClassData(properties,collection,fieldId,id){
	properties = properties.replace(/undefined/g, "");
	properties = properties.substr(0,properties.length-1);

    let conn = await db.getConnection();
    let sql  = "SELECT "+properties+" FROM `"+collection+"` WHERE `"+fieldId+"`= ? ";

    const rows = await conn.query(sql,[id]);

    conn.end();

	return rows[0];
}
//-------------------------------------------------------//
// AUXILIAR