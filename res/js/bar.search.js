//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: bar.search.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('bar','Bars');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas,desc){
    let data = {'tab':clas,'clas':clas,'buttons':'edit,delete','recBut':'yes'};

    await search(data); 

    document.getElementById('nav-'+clas+'-tab').click();

    loadRemoveProcess(clas,desc)
        
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
function loadRemoveProcess(clas,desc){
    modalRemovePros[clas] = [
        {'func':'removeRecord','index':'1',args:{'clase':clas,'id':''}},
        {'func':'loadOption','index':'2',args:{'option':clas+'.search','desc':desc}},        
    ]
}
//-------------------------------------------------------//
// AUXILIAR