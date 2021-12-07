//-------------------------------------------------------//
//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: appdb.js
// Created: 2021-03-18
// Updates: 2021-03-18
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const fs = require('fs');
const { transform } = require('camaro');
//-------------------------------------------------------//
// LEVEL 1
this.appdb = async () => {
    const xml = fs.readFileSync("./xml/app.data.xml", "utf8");
    const template  = {
            host:'/data/database/host',
            port:'/data/database/port',
            name:'/data/database/name',
            driver:'/data/database/driver',
            user:'/data/database/user',
            pass:'/data/database/pass',
            connectionLimit:'/data/database/connectionLimit',
        };    
    let data = await transform(xml,template );
    console.log(data)
    return(data);
}
//-------------------------------------------------------//
// LEVEL 2
