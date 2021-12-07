//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: /bsb/record.js
// Created: 2019-11-12
// Updates: 2019-11-12,2021-02-22
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const db =  require('./db.js');
const fs = require('fs');
const { transform } = require('camaro');
//-------------------------------------------------------//
// LEVEL 1
this.pair = async function(req , res){
    let clase = req.body.clase;
    let key   = req.body.key;
    let val   = req.body.val;
    try {
        let map   = await getMap(clase);
        let simple  = await getSimple(map,key,val);
        res.status(200).json(simple);
    } catch (err) {
        console.log(err.message);
    }
}
this.get = async function(req , res){
    let clase = req.body.clase;
    let id    = req.body.id;
    let key   = req.body.key;
    let fds   = req.body.fds;
    let ord   = req.body.order;
    let dir   = req.body.dir;        
    try {        
        let map   = await getMap(clase);
        let collection  = await getCollection(map,key,id,fds,ord,dir);
        res.status(200).json(collection);
    } catch (err) {
        console.log(err.message);
    }
}
this.count = async function(req,res){
    let clase = req.body.clase;
    let keys  = req.body.keys;
    let vals  = req.body.vals;
    try {
        let map   = await getMap(clase);
        let simple  = await getCount(map,keys,vals);
        res.status(200).json(simple);
    } catch (err) {
        console.log(err.message);
    }
}
this.pairFiltered = async function(req , res){
    let clase = req.body.clase;
    let key   = req.body.key;
    let val   = req.body.val;
    let keys   = req.body.keys;
    let values  = req.body.values;
    try {
        let map   = await getMap(clase);
        let simple  = await getFiltered(map,key,val,keys,values);
        res.status(200).json(simple);
    } catch (err) {
        console.log(err.message);
    }
}
this.getQuery = async function(req, res){
    let sql = req.body.sql;
    try {        
        let data  = await getQuery(sql);
        res.status(200).json(data);
    } catch (err) {
        console.log(err.message);
    }
}
//-------------------------------------------------------//
// LEVEL 2
async function getMap(clas) {
    const xml = fs.readFileSync("./xml/model/"+clas+".xml", "utf8");
    const template  = {collection:'/model/mapper/class/@collection',key:'/model/mapper/class/@key'};    
    let data = await transform(xml,template );
    return(data);     
}
async function getSimple(map,key,value) {
    let conn = await db.getConnection();
	let as = "";
	if(key==value){as= "as 'desc'"}
    let sql = "SELECT `"+key+"`,`"+value+"` "+as+" FROM `"+map['collection']+"` order by 1";
    //const rowSet = await conn.query("SELECT `"+key+"`,`"+value+"` FROM `"+map['collection']+"` order by 1");
	const rowSet = await conn.query(sql);
    conn.end();    
    let coll = {};
    for(let item of rowSet) {
        let i = 0;
        let k = "";
        let v = "";
        for(let attributename in item){
            if(i==0){ k = item[attributename];}
            if(i==1){ v = item[attributename];}
            i++;
        }
        coll[k] = v; 
    }
    return JSON.stringify(coll);
}
async function getCollection(map,key,id,fds,ord,dir) {
    let conn = await db.getConnection();
    let field = "";
    if(fds==""){field = '*'}else{
        let campo = fds.split(',');
        for(let i=0;i<campo.length;i++){
            field += "`"+campo[i]+"`,";
        } 
        field = field.substr(0,field.length-1);       
    }
    let sql = "SELECT "+field+" FROM `"+map['collection']+"`";
    if(ord != "" && dir != ""){
        sql = "SELECT "+field+" FROM `"+map['collection']+"` order by `"+ord+"` "+dir;
    }
    if(id != ""){
        sql = "SELECT "+field+" FROM `"+map['collection']+"` WHERE `"+key+"`='"+id+"'";
        if(ord != "" && dir != ""){
            sql = "SELECT "+field+" FROM `"+map['collection']+"` WHERE `"+key+"`='"+id+"' order by `"+ord+"` "+dir;
        }            
    }
    //console.log(sql);
    const rowSet = await conn.query(sql);
    conn.end();
    return JSON.stringify(rowSet);
}
async function getCount(map,keys,vals) {
    let conn = await db.getConnection();
    let filtro = "";
    let campo = keys.split(',');
    let valor  = vals.split('|');

    for(let i=0;i<campo.length;i++){
        filtro += "`"+campo[i]+"`='"+valor[i]+"' AND ";
    } 
    filtro = filtro.substr(0,filtro.length-4);

    let sql = "SELECT count(*) FROM `"+map['collection']+"` WHERE "+filtro;
    const rowSet = await conn.query(sql);
    conn.end();

    return rowSet[0]['count(*)'];
}
async function getFiltered(map,key,value,keys,values) {
    let conn = await db.getConnection();
    let filtro = "";
	let as = "";
    let campo = keys.split(',');
    let valor  = values.split('|');
    for(let i=0;i<campo.length;i++){
        filtro += "`"+campo[i]+"`='"+valor[i]+"' AND ";
    } 
    filtro = filtro.substr(0,filtro.length-4);
	if(key==value){as= "as 'desc'"}
    let sql = "SELECT `"+key+"`,`"+value+"` "+as+" FROM `"+map['collection']+"` WHERE "+ filtro +" order by 1";
	//console.log(sql);
    const rowSet = await conn.query(sql);
    conn.end();    
    let coll = {};
    for(let item of rowSet) {
        let i = 0;
        let k = "";
        let v = "";
        for(let attributename in item){
            if(i==0){ k = item[attributename];}
            if(i==1){ v = item[attributename];}
            i++;
        }
        coll[k] = v; 
    }
    return JSON.stringify(coll);
}
async function getQuery(q) {
    let conn = await db.getConnection();
    const rowSet = await conn.query(q);
    conn.end();    
    return JSON.stringify(rowSet);
}
//-------------------------------------------------------//
// LEVEL 3