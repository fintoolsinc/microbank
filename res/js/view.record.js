//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: view.record.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('view');
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

	if(document.getElementById('view.component.id').value.toLowerCase()=="form"){
		if(document.getElementById('view.class.id').value.split(".").length<=1){alertModal("Form only accept Related Classes, Please Choose One","");return;}
	}
    
    let valid = await validateRecord(clas);

    if (valid==false){return;}
    
    await saveRecord(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'Views')
}
async function removeForm(clas){
    event.preventDefault();

    modalRemovePros[clas] = [
        {'func':'removeRecord',args:{'clase':clas,'id':component[clas].id},'index':'1'},
        {'func':'loadDiv','index':'2',args:{'clas':clas,'comp':'search','desc':'Views'}}
    ]

    alertModalProcess('Are you sure, you wish to remove this information ?',clas,component[clas].id)
}
async function basicView(clas){
    event.preventDefault();
    if(component[clas].id.split(".").pop()=="record"){ await viewRecordElements(clas);  }
    if(component[clas].id.split(".").pop()=="search"){ await viewSearchColumns(clas);  }    
    if(component[clas].id.split(".").pop()=="form"){ await viewFormColumns(clas);  }    	

    loadOption(clas+".search",'Classes');
}
async function setId(clas){
    document.getElementById(clas+'.id').value = document.getElementById(clas+'.class.id').value +"."+ document.getElementById(clas+'.component.id').value; 
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventListener(clas){
    loadEventClick(clas);
    loadEventChange(clas);
}
async function loadCombos(clas){
    let cla = await getCollectionPair('class','id','desc');
              await fillSelect(cla,'view.class.id');
    let com = await getCollectionPair('component','id','desc');
              await fillSelect(com,'view.component.id');
}
//------------------------------------------------------//
//Level 3
async function loadEventClick(clas){
    if(document.getElementById(clas+'.remove')){document.getElementById(clas+'.remove').addEventListener('click', async  event => { removeForm(clas); })}
    if(document.getElementById(clas+'.basic')){document.getElementById(clas+'.basic').addEventListener('click', async  event => { basicView(clas); })}
    if(document.getElementById(clas+'.save')){document.getElementById(clas+'.save').addEventListener('click', async  event => { saveForm(clas); })}
    if(document.getElementById(clas+'.class.id')){document.getElementById(clas+'.class.id').addEventListener('click', async  event => { setId(clas); })}
    if(document.getElementById(clas+'.component.id')){document.getElementById(clas+'.component.id').addEventListener('click', async  event => { setId(clas); })}
}
async function loadEventChange(clas){
    if(document.getElementById('view.component.id')){document.getElementById('view.component.id').addEventListener('change', async  event => {
		if(document.getElementById('view.component.id').value.toLowerCase()=="form"){
			if(document.getElementById('view.class.id').value.split(".").length<=1){
				alertModal("Form only accept Related Classes, Please Choose One","");
				document.getElementById('view.component.id').options[0].selected = true;
			}
		}
	})}
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