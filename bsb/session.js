//-------------------------------------------------------//
//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: /bsb/session.js
// Created: 2019-11-12
// Updates: 2019-11-12,2021-01-22
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const db = require('./db.js');
//-------------------------------------------------------//
// LEVEL 1
this.data = function(req , res){
    let sid  = req.body.sid;
    (async function main(){
        try {
            const returnedData = await getSesion(sid);        
            res.status(200).json(returnedData);
        } catch (err) {
            console.log(err.message);
        }
    })();
}
//-------------------------------------------------------//
// LEVEL 2
async function getSesion(sid){
    let conn = await db.getConnection();
    let sql = "SELECT `desk.lang` AS lang,`desk.id` AS desk,`user.id` AS uid,`user.name` AS uname,`role.id` AS rid FROM `sessions` WHERE `id` = ?";
    //console.log(sql+"<>"+sid);
    const rowSet = await conn.query(sql,[sid]);
    conn.end();
    let obj = {'desk.lang':rowSet[0].lang,'desk.id':rowSet[0].desk,
        'user': {'id': rowSet[0].uid,'name': rowSet[0].uname},
        'role': {'id': rowSet[0].rid}
    };
    return obj;
}
//-------------------------------------------------------//
// AUXILIAR