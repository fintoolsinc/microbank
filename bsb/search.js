//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: /bsb/search.js
// Created: 2019-11-12
// Updates: 2019-11-12,2021-02-15
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const db = require('./db.js');
const fs = require('fs');
const { transform } = require('camaro');
//-------------------------------------------------------//
// LEVEL 1
this.header = function(req , res){
    let domain  = req.query.clase;
    (async function main(){
        try {
            const returnedData = await getHeader(domain);
            res.status(200).json(returnedData);
        } catch (err) {
            console.log(err.message);
        }        
    })();
}
this.data = function(req , res){
    let domain  = req.query.clase;
    let sfields = req.query.sfields;
    let svalues = req.query.svalues;
    let draw    = req.query.draw;
	let value   = req.query.search.value;    
    let order   = req.query.order[0].column;
    let dir     = req.query.order[0].dir;    
    let start   = req.query.start;
    let length  = req.query.length;
    (async function main(){
        try {
            let clase       = await getClase(domain);
            let table       = await getTable(clase);
            let totalRows   = await getTotalRows(table, sfields, svalues);
            let [classCols, searchCols] = await getClassSearchColumns(domain)
            let filter      = await getSearchFilter(classCols, value, sfields, svalues);
            let filteredRows= await getFilteredRows(table, filter, value);
            let classData   = await getClassData(table, classCols, filter, value, start, length,order,dir);
            let assIds      = await getAssociationsIds(classData);
            let assCols     = await getAssociationsCols(searchCols);
            let assData     = await getAssociationsData(assIds, assCols);
            let gridData    = await combineClasAssData(searchCols, classData, assData)
            strJSON = {};
            strJSON['draw'] = draw;
            strJSON['recordsTotal'] = totalRows;
            strJSON['recordsFiltered'] = filteredRows;
            strJSON['data'] = gridData;
            res.status(200).json(strJSON);
        } catch (err) {
            console.log(err.message);
        }
    })();
}
//-------------------------------------------------------//
// LEVEL 2
async function getSchema() {
    const xml = fs.readFileSync("./xml/app.data.xml", "utf8");
    const template  = {name:'/data/database/name'};    
    let data = await transform(xml,template );
    return(data);     
}
async function getHeader(dom) {
    const xml = fs.readFileSync("./xml/view/"+dom+".search.xml", "utf8");
    let template  = {
        column: ['/view/row/column', 
            {
                id: '@id',
                attributes: ['attributes',
                    {
                        index: 'index',
                        type: 'type',
                        header: 'header',
                        width: 'width',
                        visible: 'visible'
                    }]
            }
        ]
    };
    let data   = await transform(xml, template);
    let result = [];
    for (let i=0;i<data.column.length;i++){
        let id  = data.column[i].id;
        let inx = data.column[i].attributes[0].index;
        let typ = data.column[i].attributes[0].type;
        let hea = data.column[i].attributes[0].header;
        let wid = data.column[i].attributes[0].width;
        let vis = data.column[i].attributes[0].visible;
        if (vis.toUpperCase() != "NO") {
            result.push({'id' : id , 'index': inx ,'type' : typ, 'header' : hea , 'width' : wid, 'visible' : vis});
        }
    }
    let sorted = result.sort(function(a,b){ return  a.index-b.index; });
    return JSON.stringify(sorted);
}
async function getClase(dom) {
    const xml = fs.readFileSync("./xml/view/"+dom+".search.xml", "utf8");
    let cla   = dom;
    let template  = {model:'/view/model'};
    let data   = await transform(xml, template);
    return(data.model);
}
async function getTable(clase) {
    let xml = fs.readFileSync("./xml/model/"+clase+".xml", "utf8");
    let data = await transform(xml, {collection:'/model/mapper/class/@collection'});    

    return(data['collection']);    
}
async function getTotalRows(table,sfields,svalues) {
    let conn = await db.getConnection();
    let filter = "";
    if (svalues != "") {
        let fields = sfields.split(',');
        let values = svalues.split(',');
        if(values.length>1){
            for(let i=0;i<values.length;i++){
                let val = values[i].split('|');
                let val2 = values[i].split('<>');
                if(val.length>1){
                    let inc = "";
                    for(let j=0;j<val.length;j++){
                        inc += "'"+val[j]+"',";
                    }
                    inc  = inc.substr(0,inc.length-1);                        
                    filter +=  "`" + fields[i] + "` IN (" + inc + ") AND ";  
                }else if(val2.length>1){
                    filter +=  "`" + fields[i] + "` BETWEEN '" + val2[0] + "' AND '"+ val2[1] +"' AND ";  
                }else{
                    filter +=  "`" + fields[i] + "`='" + values[i] + "' AND ";
                }
            }
            filter = filter.substr(0,filter.length-5);
        }else{
            filter += "`" + sfields + "`='" + svalues + "'"
        }
    }
    if(filter!=""){
        filter = " WHERE "+filter;
    }
    const rowSet = await conn.query("SELECT COUNT(*) AS `rows` FROM `" + table+"` " + filter);
    conn.end();
    return rowSet[0].rows;
}
async function getClassSearchColumns(dom) {
    let c = "";
    let s = "";    
    const header = await getHeader(dom);
    var d = JSON.parse(header);
    for (let k in d) {
		const { id, index, type, header, width, visible } = d[k];
        if (visible.toUpperCase() != "NO") {
            s += "`" + id + "`,";
        }
        let dom = id.split(".");
        if (dom.length == 1 || dom[1] == "id") {
            c += "`" + id + "`,"
        }         
    }
    c = c.substr(0,c.length-1);
    s = s.substr(0,s.length-1);    
    return [c,s];
}
async function getSearchFilter(cls,value,sfields, svalues) {
	let cols = cls.split(",");
    let searchStr = "";
    let filter = "";
    if (svalues != "") {
        let fields = sfields.split(',');
        let values = svalues.split(',');
        if(values.length>1){
            for(let i=0;i<values.length;i++){
                let val = values[i].split('|');
                let val2 = values[i].split('<>');
                if(val.length>1){
                    let inc = "";
                    for(let j=0;j<val.length;j++){
                        inc += "'"+val[j]+"',";
                    }
                    inc  = inc.substr(0,inc.length-1);                        
                    filter +=  "`" + fields[i] + "` IN (" + inc + ") AND ";       
                }else if(val2.length>1){
                    filter +=  "`" + fields[i] + "` BETWEEN '" + val2[0] + "' AND '"+ val2[1] +"' AND ";   
                }else{
                    filter +=  "`" + fields[i] + "`='" + values[i] + "' AND ";
                }
            }
            filter = filter.substr(0,filter.length-5);
        }else{ 
            let valor = svalues.split("|");
            if(valor.length > 1){
                let inc = "";
                for(let j=0;j<valor.length;j++){
                    inc += "'"+valor[j]+"',";
                }
                inc  = inc.substr(0,inc.length-1);                        
                filter +=  "`" + sfields + "` IN (" + inc + ")";     
            }else{
                filter = "`" + sfields + "`='" + svalues + "'"
            }
        }
    }
    if(value!=""){
        for (let i = 0; i < cols.length; i++) {
            if (i == 0) {
                searchStr += cols[i] + " LIKE '" + value + "%' "
            } else {
                searchStr += "OR " + cols[i] + " LIKE '" + value + "%' "
            }
        }
    }
    if(searchStr != ""){
        if(filter!=""){
            searchStr = filter+" AND (" + searchStr + ")";
        }else{
            searchStr = " AND (" + searchStr + ")";
        }
    }else{
        if(filter != ""){
            searchStr = " AND "+filter;
        }
    }
    return searchStr;
}
async function getFilteredRows(table, filter, value){
    let conn = await db.getConnection();
    let sql = "SELECT COUNT(*) AS `rows` FROM `" + table +"`";
    if(filter!=""){
        if(filter.substr(1,3)=="AND"){
            sql += " WHERE 1=1 "+filter;
        }else{
            sql += " WHERE "+filter;
        }
    }
    const rowSet = await conn.query(sql);
    conn.end();
    return rowSet[0].rows;
}
async function getClassData(table, classCols, filter, value, start, length,order,dir){
    let conn = await db.getConnection();
    let cols = await getFieldType(table,classCols);
    let sql = "SELECT " + cols + " FROM `" + table +"`";
    if(filter!=""){
        if(filter.substr(1,3)=="AND"){
            sql += " WHERE 1=1 "+filter;
        }else{
            sql += " WHERE "+filter;
        }
    }
    let oby = order*1+1;
    sql += " ORDER BY "+oby+" "+dir+" LIMIT " + start + " ," + length + " ";
	//console.log(sql);
    const rowSet = await conn.query(sql);
    //console.log(rowSet);
    conn.end();
    return rowSet;
}
async function getAssociationsIds(classData){
    let assIds = [];
    for(let item of classData) {
        let assID = {};
        for(let attributename in item){
            let dom = attributename.split(".");
            if(dom.length>1){
                assID[dom[0]]= item[attributename];
            }
        }
        assIds.push(assID);
    }
    return assIds;
}
async function getAssociationsCols(searchCols){
    let clases = {};
    let cols = searchCols.replace(/\`/g, "");
    cols = cols.split(",");
    for (let i=0;i<cols.length;i++){
        let dom = cols[i].split(".");
        if(dom.length>1){
            clases[dom[0]]= dom[0];
        }
    }
    let clasCols = {};
    for(let inx in clases){
        let colStr = "";
        for (let i=0;i<cols.length;i++){
            let dom = cols[i].split(".");
            if(dom.length>1){
                if (dom[0] == inx) {
                    if (dom[1].toUpperCase() != "ID") {
                        colStr += "`"+ dom[1] + "`,";
                    }
                }
            }
        }
        let str = colStr.substr(0,colStr.length-1);
        clasCols[inx] = str;
    }
    return clasCols;
}
async function getAssociationsData(assIds, assCols){
    let resData = [];
    for(let item of assIds) {
        let clase = {};
        for(let attributename in item){
            let table   = await getAssociationTable(attributename);
            if(assCols[attributename]){
                let assData = await getAssociationData(table, item[attributename], assCols[attributename]);
                clase[attributename] = assData;
            }
        }
        resData.push(clase);
    }
    return resData;
}
async function combineClasAssData(searchCols, classData, assData){
    let resData = [];
    let cols = searchCols.replace(/\`/g, "");
        cols = cols.split(",");
    let count = 0;
    for(let item of classData) {
		let rowData = [];
        for (let i=0;i<cols.length;i++){
            for(let attributename in item){
                let dom = cols[i].split(".");
                if (dom.length > 1 && dom[1].toUpperCase() != "ID") {               
                    let dom1 = attributename.split(".");
					if (dom[0] == dom1[0]) {
						let val = assData[count][dom[0]][dom[1]]
						rowData.push(val);
					}
                }else{
					if (cols[i] == attributename) {
						rowData.push(item[attributename]);
					}
                }
            }
        }
        resData.push(rowData);
        count++;
    }
    return resData;
}
//-------------------------------------------------------//
// LEVEL 3
async function getAssociationTable(ass){
    let xml = fs.readFileSync("./xml/model/"+ass+".xml", "utf8");
    let data = await transform(xml, {collection:'/model/mapper/class/@collection'});    
    return(data['collection']);     
}
async function getAssociationData(table, id, cols){
    let conn = await db.getConnection();
    const rowSet = await conn.query("SELECT " + cols + " FROM `" +table + "` WHERE id='" + id + "'");
    conn.end();
    return rowSet[0];
}
//------------------------------------------------------//
// AUXILIAR
async function getFieldType(table,cols){
    let cls = cols.replace(/`/g,'').split(',');
    let campos = cls.map(i => `'${i}'`).join(',');
    let conn = await db.getConnection();
    let schema  = await getSchema();  
    let sql = "SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '"+schema.name+"' AND  TABLE_NAME = '"+table+"' AND COLUMN_NAME IN ("+campos+")";
    const rowSet = await conn.query(sql);
    conn.end();
    if (rowSet && rowSet.length) {
        let str = "";
        let fDt = {};
        for(let item of rowSet) {
            let i = 0;
            let k = "";
            let v = "";
            for(let attributename in item){
                if(i==0){ k = item[attributename];}
                if(i==1){ v = item[attributename];}
                i++;
            }
            if(v=="date"){
                fDt[k]= "DATE_FORMAT(`"+k+"`,'%Y-%m-%d') as `"+k+"`";
            }else if( v=="datetime" || v=="timestamp"){
                fDt[k]= "DATE_FORMAT(`"+k+"`,'%Y-%m-%d %H:%i:%s') as `"+k+"`";
            }
        }
        cols.split(',').forEach(col=>{
            let cls = col.replace(/`/g,'');
            if(fDt[cls]) {
                str += fDt[cls]+",";
            }else{
                str += col+",";
            }
        });
        str = str.substr(0,str.length-1);
        return str;    
    }else{
        return "*";
    }
}