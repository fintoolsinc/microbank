//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: view.search.search.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('view.search');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas){
    let data = {'tab':clas,'clas':clas,'sflds':'id','svals':component[clas].mid,'buttons':'edit,delete','foot':'no','hiddenCols':'0,6','keyCol':6,'clasDesc':'View Searches','keyMas':0,'desMas':1,'recBut':'yes'};

    await search(data); 

    loadRemoveProcess(clas);

    loadEventListener(clas);
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventListener(clas){
    loadEventClick(clas);
}
//-------------------------------------------------------//
//LEVEL 3
async function loadEventClick(clas){
    if(document.getElementById('nav-'+clas+'-tab')){document.getElementById('nav-'+clas+'-tab').addEventListener('dblclick', async  event => { destroyTab(clas) })}
    
    if(document.getElementById(clas+'_add')){document.getElementById(clas+'_add').addEventListener('click', async  event => { loadRecord(clas,'record','','View Search',component[clas].mid) })}
}
function loadRemoveProcess(clas){
    modalRemovePros[clas] = [
        {'func':'removeRecord',args:{'clase':clas,'id':''},'index':'1'},
        {'func':'loadSearchAccordion',args:{'clase':clas,'mId':component[clas].mid,'inx':2,'clasDesc':'View Search'},'index':'2'}
    ]
}
//-------------------------------------------------------//
// AUXILIAR