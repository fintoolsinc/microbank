//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: app.login.js
// Created: 2021-03-11
// Updates: 2021-03-11
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
// LEVEL 0
( async function() {
    processPage('bsb.generator');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(app){
    loadEventListener(app);
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventListener(app){
    loadEventClick(app);
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventClick(app){
    document.getElementById('btnLogin').addEventListener('click', async () => {
		let modalAlert = new bootstrap.Modal(document.getElementById('staticBackdrop'))
		let uid = document.getElementById('id').value;
		let password = document.getElementById('password').value;

		if(uid==""){modalAlert.show();return;}
		if(password==""){modalAlert.show();return}

		sid = await login({'appid':app,'login':uid,'password':password});

		if(sid==""){
			modalAlert.show();
		}else{
			route('app.desk');				
		}
	});
}
//-------------------------------------------------------//
// AUXILIAR
