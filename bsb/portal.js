//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: /bsb/option.js
// Created: 2019-11-12
// Updates: 2019-11-12,2021-01-12
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const db =  require('./db.js');
const path = require('path');
const fs = require('fs');
const { transform } = require('camaro');
//-------------------------------------------------------//
// LEVEL 1
this.option = async function(req , res){

  let xml = fs.readFileSync("./xml/app.data.xml", "utf8");

  let data = await transform(xml, {
    portal:{port:'//port',lang:'//lang',html:'//html'}
  })  
  let lang  = data['portal']['lang'];
  let home  = data['portal']['html'];
  let html  = req.query.id;

  try {
    let file = "";
	if(html!=""){file = "../"+ lang + "/" + lang + "." + html + ".html";}
    fs.access(path.join(__dirname, file), fs.F_OK, (err1) => {
      if (err1) {
        res.sendFile(path.join(__dirname, "../"+ lang + "/" + lang + "." + home + ".html")); 
        return;
      }
      res.sendFile(path.join(__dirname, file));
    });
  } catch (err) {
    console.log(err.message);
  }
}