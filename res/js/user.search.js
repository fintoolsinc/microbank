//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: user.search.js
// Created: 2021-01-25
// Updates: 2021-01-25
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('user','Users');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas,desc){
    let data = {'tab':clas,'clas':clas,'clasDesc':'Model','desMas':1,'recBut':'yes'};

    await search(data);

    document.getElementById('nav-'+clas+'-tab').click();

    loadEventListener(clas,desc);
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventListener(clas,desc){
    loadEventClick(clas,desc);
}
//-------------------------------------------------------//
//LEVEL 3
async function loadEventClick(clas,desc){
    if(document.getElementById('nav-'+clas+'-tab')){document.getElementById('nav-'+clas+'-tab').addEventListener('dblclick', async  event => { destroyTab(clas) })}
    
    if(document.getElementById(clas+'_add')){document.getElementById(clas+'_add').addEventListener('click', async  event => { loadRecordAlert(clas,'record','',desc,'') })}
}
//-------------------------------------------------------//
// AUXILIAR