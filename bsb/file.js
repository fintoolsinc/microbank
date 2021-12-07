//-------------------------------------------------------//
//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: /bsb/sesion.js
// Created: 2019-11-12
// Updates: 2019-11-12
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const fs = require('fs');
const glob = require('glob');
const  formidable = require('../node_modules/formidable');
//-------------------------------------------------------//
// LEVEL 1
this.upload = function(req, res){
    let pair =[];
    let fb = new formidable.IncomingForm();
    fb.uploadDir = './upload/';  
    fb.parse(req, function(err,fields,files){
        if(err){            
            res.writeHead(500, {'content-type':'text/plain'});
            res.write('Error al cargar el archivo:'+err);
            res.end();            
        }else{
            res.end();             
        }               
    });
    fb.on('fileBegin', (name,file)=>{
        let fileName = file.name.split(".");
        let newFileName =pair.clase.toUpperCase()+pair['clase.id']+pair.docType.toUpperCase()+pair.doc+'.'+fileName[fileName.length -1]
        file.path = fb.uploadDir+newFileName;
    });
    fb.on('file', (name,file)=>{
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('Recibido por Mi');
        res.status(200);
    });
    fb.on('field', function(name, field) {
        pair[name] = field;
    });
}
this.get = function(req,res){
    let ruta = process.cwd() + "/upload/" ;
    let nomEstatico = req.body.nombre;
    let respuesta = {};
    respuesta[0] = "error";
    (async function main(){
        try{
            res.sendFile(ruta + nomEstatico);
        }catch(err){
            console.log(err);
        }
    })();
}
this.remove = function(req, res){
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
this.search = function(req,res){
    let pattern = req.body.pattern;
    let extension = req.body.extension;
    let path = process.cwd() + "/upload/" ;
    glob(path+pattern+"."+extension, function (err, files) {
        let archivos = [];
        if (err) {
             console.log(err);
         } else {
            files.forEach(function (file) {
                let archivo = file.split("/").pop();
                archivos.push(archivo);
            });
        }        
        res.status(200).json(archivos);
    })
}
//-------------------------------------------------------//
// LEVEL 2

//-------------------------------------------------------//
// AUXILIAR
