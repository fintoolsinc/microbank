//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: object.search.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('object','Object');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas,desc){
    let data = {'tab':clas,'clas':clas,'clasDesc':desc,'desMas':1,'buttons':'formModal','keyCol':1,'keyMas':0};

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
    
    //if(document.getElementById(clas+'_add')){document.getElementById(clas+'_add').addEventListener('click', async  event => { loadRecordAlert(clas,'record','',desc,'') })}
}
//-------------------------------------------------------//
// AUXILIAR