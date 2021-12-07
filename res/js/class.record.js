//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: class.record.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('class');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas){
    await loadEventListener(clas);

    await loadCombos(clas);

    if(component[clas].id!==""){
        await record(clas,component[clas].id);
        document.getElementById(clas+".remove").disabled = false;
        document.getElementById(clas+".basic").disabled = false;
    }

    if(document.getElementById(clas+'_modal')){
        var myModal = new bootstrap.Modal(document.getElementById(clas+'_modal'), {keyboard: false})
        myModal.show();
    }
}
async function saveForm(clas){
    event.preventDefault();
    
    validateRecord(clas);
    
    let id = await saveRecord(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'Classes');
}
async function removeForm(clas){
    event.preventDefault();

    modalRemovePros[clas] = [
        {'func':'removeRecord',args:{'clase':clas,'id':component[clas].id},'index':'1'},
        {'func':'loadDiv','index':'2',args:{'clas':clas,'comp':'search','desc':'Classes'}}
    ]

    alertModalProcess('Are you sure, you wish to remove this information ?',clas,component[clas].id)
}
async function basicClassProperties(clas){
    event.preventDefault();
    
    let id = await classProperties(clas);

    loadOption(clas+".search",'Classes');
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
    if(document.getElementById(clas+'.save')){document.getElementById(clas+'.save').addEventListener('click', async  event => { saveForm(clas); })}
    if(document.getElementById(clas+'.remove')){document.getElementById(clas+'.remove').addEventListener('click', async  event => { removeForm(clas); })}
    if(document.getElementById(clas+'.basic')){document.getElementById(clas+'.basic').addEventListener('click', async  event => { basicClassProperties(clas); })}
}
async function loadEventChange(clas){

}
// AUXILIAR
//-------------------------------------------------------//
async function validateRecord(clas){
    let count = 0;
    let valid = true;
    const forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach((form) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          if(count==0){
            valid = false;
            count++;
          }
        }
        form.classList.add('was-validated');
    });
    return valid;
}