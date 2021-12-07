//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: app.record.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('app');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas){
    await loadEventListener(clas);

    await loadCombos(clas);

    if(component[clas].id!==""){
        await record(clas,component[clas].id);
    }

    if(document.getElementById(clas+'_modal')){
        var myModal = new bootstrap.Modal(document.getElementById(clas+'_modal'), {keyboard: false})
        myModal.show();
    }
}
async function generateApp(clas){
    event.preventDefault();
    
    let id = await appGenerate(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'Applications')
}
async function configureApp(clas){
    event.preventDefault();
    
    let status = await appConfiguration(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'Applications')
}
async function schemaApp(clas){
    event.preventDefault();
    
    let status = await appSchema(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'Applications')    
}
async function populateApp(clas){
    event.preventDefault();
    
    let status = await appPopulate(clas);
    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'Applications') 
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventListener(clas){
    loadEventClick(clas);
    loadEventChange(clas);
}
async function loadCombos(clas){

}
//------------------------------------------------------//
//Level 3
async function loadEventClick(clas){
    if(document.getElementById(clas+'.schema')){document.getElementById(clas+'.schema').addEventListener('click', async  event => { schemaApp(clas); })}
    if(document.getElementById(clas+'.configuration')){document.getElementById(clas+'.configuration').addEventListener('click', async  event => { configureApp(clas); })}
    if(document.getElementById(clas+'.populate')){document.getElementById(clas+'.populate').addEventListener('click', async  event => { populateApp(clas); })}
    if(document.getElementById(clas+'.save')){document.getElementById(clas+'.save').addEventListener('click', async  event => { generateApp(clas); })}
}
async function loadEventChange(clas){

}
//-------------------------------------------------------//
// AUXILIAR