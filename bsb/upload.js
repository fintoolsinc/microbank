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
//const db        = require('./db.js');
var  formidable = require('../node_modules/formidable');
//-------------------------------------------------------//
// LEVEL 1

this.file = function(req, res){    
    var fb = new formidable.IncomingForm();
    var fields=[];
    var files=[];
    var indicador = 0;
    var valores =[];
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
        //Empieza la carga del archivo
        //console.log('Inicia la carga del archivo');        
        let extencion = file.name.split(".");
        if(indicador == 1){
            file.path = fb.uploadDir+valores["precioVentaInscripcion"]+"."+valores["precioVentaCarne"]+"."+valores["precioVentaNombreArchivo"]+"."+extencion[extencion.length -1];
        }else if(indicador == 2){
            file.path = fb.uploadDir+valores["solicitudInscripcion"]+"."+valores["solicitudCarne"]+"."+valores["solicitudNombreArchivo"]+"."+extencion[extencion.length -1];
        }else{
            file.path = fb.uploadDir+valores["contratoInscripcion"]+"."+valores["contratoCarne"]+"."+valores["contratoNombreArchivo"]+"."+extencion[extencion.length -1];
        }        
    });
    fb.on('file', (name,file)=>{
        //Finaliza la carga del archivo
        //console.log('Finaliza la carga del archivo');
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received and upload');
        res.status(200);
    });
    fb.on('field', function(name, field) {
        valores[name] = field;
        if(name == "precioVentaInscripcion" || name == "precioVentaCarne" || name == "precioVentaNombreArchivo"){
            indicador = 1; //para indicar que se subira el archivo de precioVenta
        }else if(name == "solicitudInscripcion" || name == "solicitudCarne" || name == "solicitudNombreArchivo"){
            indicador = 2; //para indicar que se subira el archivo de solicitud
        }
    });
}

this.fileCarne = function(req, res){    
    var fb = new formidable.IncomingForm();
    var fields=[];
    var files=[];
    var indicador = 0;
    var valores =[];
    var ente = req.query.ente;
    var usuario = req.query.usuario;
    var nombre = req.query.nombre;
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
        //Empieza la carga del archivo       
        let extencion = file.name.split(".");
        file.path = fb.uploadDir+ente+"."+usuario+"."+nombre+"."+extencion[extencion.length -1];       
    });
    fb.on('file', (name,file)=>{
        //Finaliza la carga del archivo
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received and upload');
        res.status(200);
    });
    fb.on('field', function(name, field) {
        //valores[name] = field;
    });
}
//-------------------------------------------------------//
// LEVEL 2

//-------------------------------------------------------//
// AUXILIAR