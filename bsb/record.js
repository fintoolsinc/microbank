//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: /bsb/record.js
// Created: 2019-11-12
// Updates: 2019-11-12
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const db =  require('./db.js');
const fs = require('fs');
const { transform } = require('camaro');
//-------------------------------------------------------//
// LEVEL 1
this.pair = async function(req , res){
    let key1  = req.body.key;
    let key2  = req.body.key2;
    let id    = req.body.id;
    try {
        let clase   = await getClase(req.body.clase);            
        let map  = await getMap(clase);
        let record  = await getPair(clase,map,key1,id,key2);
        res.status(200).json(record);
    } catch (err) {
        console.log(err.message);
    }
}
this.set = async function(req , res){
    let fid = req.body.fid;
    let id  = req.body.id;
    let key = req.body.key;
    let val = req.body.val;
    try {
        let clase   = await getClase(req.body.clase);
        let map = await getMap(clase);
        let rid  = await setRecord(map,fid,id,key,val);
        res.status(200).json(rid);
    } catch (err) {
        console.log(err.message);
    }
}
this.get = async function(req , res){
    try {
        let clase= await getClase(req.body.clase)
        let map  = await getMap(clase);
        let view = await getView(clase);
        let record  = await getRecord(map['collection'],map['key'],view,req.body.clase,req.body.id);
        res.status(200).json(record);
    } catch (err) {
        console.log(err.message);
    }
}
this.association = async function(req , res){
    try {
        let clase   = await getClase(req.body.clase)
        console.log(clase);
        let map     = await getMap(clase);
        let view    = await getView(clase);
        let fields  = await getFields(map['collection'],view);        
        let filter  = await getFilter(clase,req.body.mid,req.body.id);
        let record  = await getRecordAssociation(map['collection'],fields,filter,req.body.clase); 
        res.status(200).json(record);
    } catch (err) {
        console.log(err.message);
    }
}
this.save = async function(req , res){
    try {
        let id;
        let clase   = await getClase(req.body.clase);
        let model   = await getModel(clase);
        let map     = await getMap(clase);
        let exist   = await checkRecord(map,req.body);
        if(exist>0){
            id = await updateRecord(model,map,req.body,req.body);
        }else{
            id = await insertRecord(model,map,req.body);
        }
        res.status(200).json(id);
    } catch (err) {
        console.log(err.message);
    }
}
this.remove = async function(req , res){
    let id     = req.body.id;
    try {
        let clase   = await getClase(req.body.clase);
        let map  = await getMap(clase);
        let remove  = await removeRecord(map,id);
        res.status(200).json(JSON.stringify({'id':id}));
    } catch (err) {
        console.log(err.message);
    }
}
//-------------------------------------------------------//
// LEVEL 2
async function getSchema() {
    const xml = fs.readFileSync("./xml/app.data.xml", "utf8");
    const template  = {name:'/data/database/name'};    
    let data = await transform(xml,template );
    return(data);     
}
async function getMap(clas) {
    const xml = fs.readFileSync("./xml/model/"+clas+".xml", "utf8");
    const template  = {collection:'/model/mapper/class/@collection',key:'/model/mapper/class/@key'};    
    let data = await transform(xml,template );
    return(data);     
}
async function getClase(dom) {
    //console.log("./xml/view/"+dom+".record.xml");
    const xml = fs.readFileSync("./xml/view/"+dom+".record.xml", "utf8");
    let cla   = dom;
    let template  = {model:'/view/class'};
    let data   = await transform(xml, template);
    return(data.model);
}
async function getFilter(clas,mid,id) {
    console.log(clas+"<>"+mid+"<>"+id);
    const xml = fs.readFileSync("./xml/model/"+clas+".xml", "utf8");
    let template  = {mid:'/model/association/master/@id',id:'/model/association/detail/@id'};
    let data   = await transform(xml, template);
    let filter = "`"+data.mid+"`='"+mid+"' AND `"+data.id+"`='"+id+"'";
    return filter;
}
async function getModel(clas){
    const xml = fs.readFileSync("./xml/model/"+clas+".xml", "utf8");
    const template  = {
        property: ['/model/class/property', 
            {
                id: '@id',
                type: 'type',
            }
        ]
    };
    let data = await transform(xml, template);
    return data;
}
async function getView(clas) {
    const xml = fs.readFileSync("./xml/view/"+clas+".record.xml", "utf8");
    const template  = {
        element: ['/view/element', 
            {
                id: '@id',
                attributes: ['attributes',
                    {
                        tag: 'tag',
                        type: 'type',
                        readOnly: 'readOnly',
                        disabled: 'disabled'
                    }]
            }
        ]
    };
    let data   = await transform(xml, template);
    let result = [];
    for (let i=0;i<data.element.length;i++){
        let id  = data.element[i].id;
        let tag = data.element[i].attributes[0].tag;
        let type = data.element[i].attributes[0].type;
        let readOnly = data.element[i].attributes[0].readOnly;
        let disabled = data.element[i].attributes[0].disabled;
        result.push({'id' : id , 'tag': tag ,'type' : type, 'readOnly' : readOnly , 'disabled' : disabled});
    }    
    return result;
}
async function getPair(clase,map,key1,id,key2) {
    let conn = await db.getConnection();
    let filter = map['key'];
    if(key2!=""){
        filter = key2;
    }
    let sql = "SELECT `"+key1+"` FROM `"+map['collection']+"` WHERE `"+filter+"` = ?";
    const rowSet = await conn.query(sql,[id]);
    //console.log(sql+"><"+id);
    conn.end();
    if (rowSet && rowSet.length) {
        let obj   = JSON.stringify(rowSet[0]);
            obj   = obj.replace(/[{}]/g, "");
        let pairs = obj.split(",");
        let set   = {};
        let kv1   = {};
        let kv2   = {};
        for(let i=0;i<pairs.length;i++){
            let pair = pairs[i].split(":");
            let llave= pair[0];
                llave= llave.replace(/['"]/g, "");
            let value= pair[1];
                value= value.replace(/['"]/g, "");
                value= value.replace(/null/g, "");                    
            let dom  = llave.split(".");
            if(dom.length==1){
                kv1[dom[0]]  = value;
            }
            if(dom.length==2){
                kv2[dom[1]] = value;
                kv1[dom[0]] = kv2;
            }
        }
        set[clase] = kv1;
        return JSON.stringify(set)
    }else{
        return JSON.stringify(0);
    }
}
async function getRecord(coll,key,view,clase,id) {
    let conn = await db.getConnection();
    const fields = await getFields(coll,view);
    const sql    = "SELECT "+fields+" FROM `"+coll+"` WHERE `"+key+"` = ?";
    const rowSet = await conn.query(sql,[id]);
    console.log(sql+"<>"+id)
    conn.end();
    if (rowSet && rowSet.length) {
        let set   = {};
        let kv1   = {};
        let kv2   = {};        
        let obj   = rowSet[0];
        for(let att in obj){
            let dom  = att.split(".");
            if(dom.length==1){
                kv1[dom[0]]  = obj[att];
            }
            if(dom.length==2){
                kv2 ={};
                kv2[dom[1]] = obj[att];
                kv1[dom[0]] = kv2;
            }
        }
        set[clase] = kv1;
        return JSON.stringify(set);
    }else{
        return JSON.stringify(0);
    }
}
async function getRecordAssociation(table,fields,filter,clase) {
    let conn = await db.getConnection();
    const sql    = "SELECT "+fields+" FROM `"+table+"` WHERE "+filter;
    console.log(sql);
    const rowSet = await conn.query(sql);
    conn.end();
    if (rowSet && rowSet.length) {
        let set   = {};
        let kv1   = {};
        let kv2   = {};        
        let obj   = rowSet[0];
        for(let att in obj){
            let dom  = att.split(".");
            if(dom.length==1){
                kv1[dom[0]]  = obj[att];
            }
            if(dom.length==2){
                kv2 ={};
                kv2[dom[1]] = obj[att];
                kv1[dom[0]] = kv2;
            }
        }
        set[clase] = kv1;
        return JSON.stringify(set);
    }else{
        return JSON.stringify(0);
    }
}
async function checkRecord(map,bod) {
    let id = bod[map['key']];
    let conn = await db.getConnection();
    let sql = "SELECT count(*) as count FROM `"+map['collection']+"` WHERE `"+map['key']+"` = ?";
    //console.log(sql+"<>"+id) 
    const rowSet = await conn.query(sql,[id]);
    conn.end();
    if (rowSet && rowSet.length) {
        return rowSet[0].count;
    }else{
        return 0;
    }
}
async function setRecord(map,id,idVal,key,keyVal){
    let conn = await db.getConnection();    
    let sql = "UPDATE `"+map['collection']+"` SET `"+key+"`='"+keyVal+"' WHERE `" +id+"` = '"+idVal+"'";
    console.log(sql);
    const rowSet = await conn.query(sql);
    conn.end();
    if(rowSet.affectedRows>0){
        return idVal;
    }else{
        return 0;
    }    
}
async function insertRecord(model,map,body){
    let [cols,vals] = await splitToInsert(model,body);
    let id = await insReg(map,cols,vals);
    return id;
}
async function updateRecord(model,map,body,id){
    let pairs = await pairToUpdate(model,body);
    let upsOk = await upsReg(map,pairs,body);
    return upsOk;
}
async function removeRecord(map,id) {
    let conn = await db.getConnection();
    const rowSet = await conn.query("DELETE FROM `"+map['collection']+"` where `"+map['key']+"` = ?",[id]);
    conn.end();
    return rowSet;
}
//-------------------------------------------------------//
// LEVEL 3
async function getFields(table,view) {
    let conn = await db.getConnection();
    let schema  = await getSchema();
    let sql = "SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '"+schema.name+"' AND  TABLE_NAME ='"+table+"'";  
    const rowSet = await conn.query(sql);
    conn.end();
     if (rowSet && rowSet.length) {
        let str = "";
        for(let item of rowSet) {
            let i = 0;
            let k = "";
            let v = "";
            for(let attributename in item){
                if(i==0){ k = item[attributename];}
                if(i==1){ v = item[attributename];}
                i++;
            }
            for (let l in view) {
                const { id, tag, type, readOnly, disabled  } = view[l];
                if(id==k){
                    if(v=="date"){
                        str += "DATE_FORMAT(`"+k+"`,'%Y-%m-%d') as "+k+",";
                    }else{
                        str += "`"+k+"`,";
                    }
                }
            }            
        }
        str = str.substr(0,str.length-1);
        return str;    
    }else{
        return "*";
    }
}
async function splitToInsert(model,body){
    let colStr = "";
    let valStr = "";
    for(let item in model['property']){
        let i = 0;
        let pro = "";
        let typ = "";
        for(let name in model['property'][item]){
            if(i==0){ pro = model['property'][item][name];}
            if(i==1){ typ = model['property'][item][name];}
            i++;
        }
        if (body[pro] != "" && typeof body[pro] !== 'undefined') {
            if (typ == "integer" || typ == "decimal" || typ == "float") {
                colStr += "`" + pro + "`,";
                valStr += body[pro] + ",";
            }
            if (typ == "string" || typ == "char" || typ == "varchar" || typ == "date" || typ == "time") {
                colStr += "`" + pro + "`,";
                valStr += "\"" + body[pro] + "\",";
            }
        }
    }
    colStr = colStr.substr(0,colStr.length-1);
    valStr = valStr.substr(0,valStr.length-1);
    return [colStr,valStr];
}
async function insReg(map,cols,vals) {
    let conn = await db.getConnection();
    let sql = "INSERT INTO `"+map['collection']+"` ("+cols+") VALUES ("+vals+")";
    console.log(sql);
    const rowSet = await conn.query(sql);
    conn.end();
    if(rowSet.affectedRows>0){
        return rowSet.insertId;
    }else{
        return 0;
    }
}
async function pairToUpdate(model,body){
    let pairStr = "";
    for(let item in model['property']){
        let i = 0;
        let pro = "";
        let typ = "";
        for(let name in model['property'][item]){
            if(i==0){ pro = model['property'][item][name];}
            if(i==1){ typ = model['property'][item][name];}
            i++;
        }
        if (typeof body[pro] !== 'undefined') {
            if (typ == "integer" || typ == "decimal" || typ == "float") {
                if(body[pro]!=""){
                    pairStr += "`" + pro + "`=" + body[pro] + ","
                }else{
                    pairStr += "`" + pro + "`=0,"
                }
            }
            if (typ == "string" || typ == "char" || typ == "varchar" || typ == "date" || typ == "time") {
                pairStr += "`" + pro + "`=" + "\"" + body[pro] + "\","
            }
        }
    }
    pairStr = pairStr.substr(0,pairStr.length-1);
    return pairStr;
}
async function upsReg(map,pairs,bod) {
    let id = bod[map['key']];    
    let conn = await db.getConnection();
    let sql = "UPDATE `"+map['collection']+"` SET "+pairs+" WHERE `" +map['key']+"` = '"+id+"'";
    //console.log(sql);
    const rowSet = await conn.query(sql);
    conn.end();
    if(rowSet.affectedRows>0){
        return id;
    }else{
        return 0;
    }
}
//--------------------------------------------------------//
// AUXILIAR