//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: interface.search.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('interface','Interfaces');
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
}
//-------------------------------------------------------//
// AUXILIAR