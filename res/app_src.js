//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: app.js
// Created: 2021-03-11
// Updates: 2021-03-11
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
// LEVEL 0
( async function() {
    processPage('app');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas){
    loadEventListener(clas);
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventListener(clas){
    loadEventClick(clas);
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventClick(clas){
    document.getElementById('btnSignIn').addEventListener('click', () => {route(clas+'.login')});
}
//-------------------------------------------------------//
// AUXILIAR
