//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: user.record.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('user');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas){
    await loadEventListener(clas);

    await loadCombos(clas);

    if(component[clas].id!==""){
        await record(clas,component[clas].id);
        document.getElementById(clas+".remove").disabled = false;
    }

    if(document.getElementById(clas+'_modal')){
        var myModal = new bootstrap.Modal(document.getElementById(clas+'_modal'), {keyboard: false})
        myModal.show();
    }
}
async function saveForm(clas){
    event.preventDefault();

	const pass = document.getElementById('password').value;
	const pass1 = document.getElementById('password1').value;

	if(pass!=pass1){alert("Los Passwords no coinciden");return}
    
    let data = {'pass':pass};
    const pswd = await (await fetch('/crypt', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();

    document.getElementById('user.password').value = pswd;
    document.getElementById('user.desc').value = document.getElementById('user.first').value +" "+document.getElementById('user.last').value;

    let valid = await validateRecord(clas);

    if (valid==false){return;}
    
    await saveRecord(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'Users')
}
async function removeForm(clas){
    event.preventDefault();

    modalRemovePros[clas] = [
        {'func':'removeRecord',args:{'clase':clas,'id':component[clas].id},'index':'1'},
        {'func':'loadDiv','index':'2',args:{'clas':clas,'comp':'search','desc':'Classes'}}
    ]

    alertModalProcess('Are you sure, you wish to remove this information ?',clas,component[clas].id)
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