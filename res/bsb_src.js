//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: bsb.js
// Created: 2021-03-12
// Updates: 2021-03-12
// Copyright - All Rights Reserved
//-------------------------------------------------------//
var sid = "";
var component = {};
var dataTable = {};
var modalRemovePros = {};
//-------------------------------------------------------//
// PORTAL
const route = (option) => fetch('/option?id='+option).then(function(response) {return response.text();}).then(function(body) {document.querySelector('body').innerHTML = body;loadScript(option)});
const login = (data) => {
    return new Promise((resolve, reject) => {
		fetch('/login', {method: 'POST', headers: {'Content-Type': 'application/json'},body: JSON.stringify(data)}).then(response => response.json()).then(data => {
			resolve(data.sid)
		}).catch(error => 
			console.log(error)
		);
    })
}
//-------------------------------------------------------//
//-------------------------------------------------------//
// DESK
const nav = (dat) => {
    return new Promise((resolve, reject) => {
		fetch('/desk.nav', {method: 'POST', headers: {'Content-Type': 'application/json'},body: JSON.stringify(dat)}).then(response => response.json()).then(data => {
			constructNav(data,dat);
			resolve(true)
		}).catch(error => 
			console.log(error)
		);
    })
}
const session = (data) => {
    return new Promise((resolve, reject) => {
		fetch('/session', {method: 'POST', headers: {'Content-Type': 'application/json'},body: JSON.stringify(data)}).then(response => response.json()).then(data => {
			resolve(data);
		}).catch(error =>
			console.log(error)
		);
    })
}
function showSideBar() {
	let sideBar = document.querySelector(".sidebar");
	sideBar.classList.toggle("active");
	toggleClasses('#sideBar', 'collapse');
	toggleClasses('#content', 'col-lg-12 col-md-12');
}
function loadRecordAlert(clas,comp,rId,desc,mId){
	if(document.getElementById(clas)){
		alertModal(desc+" Data Might Be Lost, Are You Sure To Continue ?","destroyLoadRecord('"+clas+"','"+comp+"','"+rId+"','"+desc+"','"+mId+"')");
	}else{
		loadRecord(clas,comp,rId,desc,mId);
	}
}
async function loadAccordion(clas,comp,rId,desc,mId,dmas){
	component[clas] = {'id':rId,'mid':mId,'inx':'','desc':desc,'dmas':dmas};
	//console.log(clas);
	//console.log(component[clas]);
	destroyForm(clas);
    await fetch('/option?id='+clas+'.accordion').then(function(response) {return response.text();}).then(function(body) {document.getElementById('col-accordion-'+clas).insertAdjacentHTML('beforeend', body);});	
	loadScript(clas+"."+comp);
	document.getElementById("col-table-"+clas).className = "col-lg-6 col-sm-12";
	document.getElementById("col-accordion-"+clas).className = "col-lg-6 col-sm-12";
	document.getElementById(clas+'.id.accordion').innerHTML = rId;
    document.getElementById(clas+'.desc.accordion').innerHTML = dmas;	
}
async function loadForm(clas,comp,rId,desc,mId,dmas){
	//console.log(clas);
	component[clas] = {'id':rId,'mid':mId,'inx':'','desc':desc,'dmas':dmas};
	//console.log(component[clas]);
	destroyForm(clas);
    await fetch('/option?id='+clas+'.form').then(function(response) {return response.text();}).then(function(body) {document.getElementById('col-accordion-'+clas).insertAdjacentHTML('beforeend', body);});	
	loadScript(clas+"."+comp);
	document.getElementById("col-table-"+clas).className = "col-lg-6 col-sm-12";
	document.getElementById("col-accordion-"+clas).className = "col-lg-6 col-sm-12";
	document.getElementById(clas+'.id.form').innerHTML = rId;
    document.getElementById(clas+'.desc.form').innerHTML = dmas;	
}
async function loadRecordAccordion(clas,rId,inx,desc){
	component[clas] = {'id':rId,'mid':'','inx':inx,'desc':desc};
    document.getElementById(`accordion-header-${inx}`).innerHTML = desc;
    await fetch('/option?id='+clas+'.record').then(function(response) {return response.text();}).then(function(body) {document.getElementById(`accordion-body-${inx}`).innerHTML = body;});
    loadScript(clas+".record");		
}
async function loadSearchAccordion(clas,mId,inx,desc){
	component[clas] = {'id':'','mid':mId,'inx':inx,'desc':desc};
    document.getElementById(`accordion-header-${inx}`).innerHTML = desc;
	//console.log(clas+'.search');
    await fetch('/option?id='+clas+'.search').then(function(response) {return response.text();}).then(function(body) {document.getElementById(`accordion-body-${inx}`).innerHTML = body;});
    loadScript(clas+".search");	
}
async function loadRecord(clas,comp,rId,desc,mId){
	component[clas] = {'id':rId,'mid':mId,'com':comp,'desc':desc};
	if(!document.getElementById(clas+'_modal')){
		let record = `<div class="modal fade" id="${clas}_modal" tabindex="-1" aria-labelledby="${clas}ModalCenterTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered modal-lg">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="${clas}ModalCenterTitle">${desc}</h5>
									<button type="button" class="btn-close" id="`+clas+`-close-modal" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body" id="${clas}_record">

								</div>
							</div>
						</div>
					</div>`;
		document.getElementById('deskOption').innerHTML =  record;
	}
	document.getElementById(clas+'-close-modal').addEventListener('click', async  event => {  destroyRecord(clas) })
	await fetch('/option?id='+clas+'.record').then(function(response) {return response.text();}).then(function(body) {document.getElementById(clas+'_record').innerHTML=body});
	loadScript(clas+".record");	
}
async function loadFormModal(clas,comp,rId,desc,mId){
	component[clas] = {'id':rId,'mid':mId,'com':comp,'desc':desc};
	if(!document.getElementById(clas+'_modal')){
		let record = `<div class="modal fade" id="${clas}_modal" tabindex="-1" aria-labelledby="${clas}ModalCenterTitle" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered modal-lg">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="${clas}ModalCenterTitle">${desc}</h5>
									<button type="button" class="btn-close" id="`+clas+`-close-modal" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body" id="${clas}_record">

								</div>
							</div>
						</div>
					</div>`;
		document.getElementById('deskOption').innerHTML =  record;
	}
	document.getElementById(clas+'-close-modal').addEventListener('click', async  event => {  destroyRecord(clas) })
	await fetch('/option?id='+clas+'.form').then(function(response) {return response.text();}).then(function(body) {document.getElementById(clas+'_record').innerHTML=body});
	loadScript(clas+".form");	
}
async function loadOption(option,desc){
	let opti = option.split(".");
	let clas = opti[0];
	let comp = opti[1];
	if(option.split(".").pop().toLowerCase()=="form"){
		clas = opti[0]+"-"+opti[1];
	}	
	if(document.getElementById('nav-'+clas+'-tab')){ destroyTab(clas); }

	constructNavTab();

	addNavClasTab(clas,desc);

	await fetch('/option?id='+option).then(function(response) {return response.text();}).then(function(body) {document.getElementById('col-table-'+clas).insertAdjacentHTML('beforeend', body);});

	loadScript(option);	
}
function constructNav(d,dat) {
    let barra  = `<ul class='nav flex-column'>{barra}</ul>`;
    var menus  = `<li>
                    <button class="btn d-inline-flex align-items-center collapsed " data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#bar{bar_id}" aria-controls="bar{bar_id}">{bar_icon}{bar_des}</button>
                    <ul class='list-unstyled ps-3 collapse' id="bar{bar_id}">{barOptions}{menus}</ul>
                  </li>`;
  	let subMenu  = `<li><button class="btn d-inline-flex align-items-center collapsed " data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#menu{menu_id}" aria-controls="menu{menu_id}">{menu_des}</button>{menu}</li>`;
  	let opciones = `<ul class='list-unstyled ps-3 collapse' id="menu{menu_id}">{opciones}</ul>`;

    let divider = `<li class='divider'></li>`;
    let opcionTemplate = {};
        opcionTemplate["div"] = `<li><a class="d-inline-flex align-items-center rounded" href='#' id='{entidad}.{componente}' title='{opcion_desc}'>{opcion_desc}</a></li>`;
        opcionTemplate["win"] = `<li><a class="d-inline-flex align-items-center rounded" href='#' id='{entidad}.{componente}' title='{opcion_desc}'>{opcion_desc}</a></li>`;
        opcionTemplate["tab"] = `<li><a class="d-inline-flex align-items-center rounded" href='#' id='{entidad}.{componente}' title='{opcion_desc}'>{opcion_desc}</a></li>`;
    let menuDesc = {};
    let barDesc = {};
    let barIcon = {};
	let optionEvent = {};
    let menuOptions = {};
    let barOptions = {};
    for (let k in d) {
		const { bar_id, bar_des, bar_icon, menu_id, menu_des, opcion_id, opcion_des, entidad, componente, opciontipo_id, contenedor_id, url, bindex, mindex, rindex } = d[k];
        let opcion = opcionTemplate[contenedor_id];
        let str = url;
        let param = window[str];
        opcion = opcion.replace(/{entidad}/g, entidad);
        opcion = opcion.replace(/{componente}/g, componente);
        opcion = opcion.replace(/{opcion_desc}/g, opcion_des);
        opcion = opcion.replace(/{param}/g, param);
        if(menu_id=="0"){
            barOptions[bar_id] = opcion + divider + barOptions[bar_id];
        }else{
            menuOptions[bar_id + "_" + menu_id] = opcion+ divider + menuOptions[bar_id + "_" + menu_id];
        }
        menuDesc[bar_id + "_" + menu_id] = menu_des;
        barDesc[bar_id] = bar_des;
        barIcon[bar_id] = bar_icon;
        optionEvent[entidad+"."+componente] = 1;
    }
    let subMenus = {};
    Object.entries(menuOptions).forEach(([key, value]) => {
		value = value.replace(/undefined/g, "");
        let keyP = key.split("_");
		let subMenu = opciones;
		subMenu = subMenu.replace(/{opciones}/g, value);
		subMenu = subMenu.replace(/{menu_id}/g, key);
		subMenus[key] = subMenu + subMenus[key];
	});
    let barMenus = {};
    Object.entries(subMenus).forEach(([key, value]) => {
		value = value.replace(/undefined/g, "");
        let keyP = key.split("_");
		let menu = subMenu;
	    menu = menu.replace(/{menu}/g, value);
		menu = menu.replace(/{menu_id}/g, key);
		menu = menu.replace(/{menu_des}/g, menuDesc[key]);
		barMenus[key] = menu + barMenus[key];
	});
	let bars = {};
    Object.entries(barMenus).forEach(([key, value]) => {
		value = value.replace(/undefined/g, "");
		let smenus = menus;
        let keyP = key.split("_");
		smenus = smenus.replace(/{menus}/g, value);
		smenus = smenus.replace(/{bar_id}/g, keyP[0]);
		smenus = smenus.replace(/{bar_des}/g, barDesc[keyP[0]]);
		smenus = smenus.replace(/{bar_icon}/g, barIcon[keyP[0]]);
		bars[keyP[0]] = smenus + bars[keyP[0]];
	});
    Object.entries(barOptions).forEach(([key, value]) => {
        if(!bars[key]){
		    let smenus = menus;
            smenus = smenus.replace(/{menus}/g, "");
    		smenus = smenus.replace(/{bar_id}/g, key);
    		smenus = smenus.replace(/{bar_des}/g, barDesc[key]);
    		smenus = smenus.replace(/{bar_icon}/g, barIcon[key]);
    		bars[key] = smenus ;
        }
    });
    let tbars = "";
    Object.entries(bars).forEach(([key, value]) => {
        value = value.replace(/{barOptions}/g, barOptions[key]);
        let bar = barra;
        bar = bar.replace(/{barra}/g, value);
        tbars += bar;
	});
	tbars = tbars.replace(/undefined/g, "");
	let sysop="System Options";
	if(dat.lang=="es"){sysop="Optiones Sistema"}
	let sideBar = "<h2 class='h6 pt-2 pb-3 mb-4 border-bottom mx-2'>"+sysop+"</h2>"+tbars;
    document.getElementById('navMenu').innerHTML = sideBar;
	Object.keys(optionEvent).forEach(key => {
		document.getElementById(key).addEventListener('click', async  event => {
			loadOption(key,event.target.title);
		})
	});
}
function constructNavTab(){
	let navTab  = `<nav><div class="nav nav-tabs" id="nav-tab" role="tablist"></div></nav><div class="tab-content" id="nav-tab-content"></div>`;
	if(!document.getElementById('nav-tab')){document.querySelector('main').innerHTML = navTab;}
}
function addNavClasTab(clas,desc){
	if(document.getElementById('nav-'+clas+'-tab')){return;}
	let clasTab = `<a class='nav-link' id='nav-{clas}-tab' data-bs-toggle='tab' href='#nav-{clas}' role='tab' aria-controls='nav-{clas}' aria-selected='false'><h6 class='text-primary'>{desc}</h6></a>`;
		clasTab = clasTab.replace(/{clas}/g, clas);
		clasTab = clasTab.replace(/{desc}/g, desc);		
	if(!document.getElementById('nav-tab').hasChildNodes()){
		document.getElementById('nav-tab').innerHTML = clasTab;
	}else{
		document.getElementById('nav-tab').insertAdjacentHTML('beforeend', clasTab);
	}
	let tabPane = `<div class="tab-pane fade" id="nav-{clas}"" role="tabpanel" aria-labelledby="nav-{clas}-tab">
						<div class="row px-1">
							<div class="col-12" id="col-table-{clas}"></div>
							<div class="" id="col-accordion-{clas}"></div>
						</div>
					</div>
				 `;					
		tabPane = tabPane.replace(/{clas}/g, clas);
	if(!document.getElementById('nav-tab-content').hasChildNodes()){
		document.getElementById('nav-tab-content').innerHTML = tabPane;
	}else{
		document.getElementById('nav-tab-content').insertAdjacentHTML('beforeend', tabPane);
	}
}
async function alertModal(desc,func){
	let alertModal = `<div class="modal fade" id="alertModalDiv" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header">
									<h4 class="modal-title" id="staticBackdropLabel">Alert !!</h4>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body"><h6>${desc}</h6></div>
								<div class="modal-footer">
									<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
									<button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal" onclick="${func}">Yes</button>
								</div>
							</div>
						</div>
					</div> `;
	document.getElementById('deskModal').innerHTML = alertModal;
	var myModal = new bootstrap.Modal(document.getElementById('alertModalDiv'), {keyboard: false})
	myModal.show();
}
async function alertModalProcess(desc,clas,id){
	let alertModal = `<div class="modal fade" id="alertModalDiv" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header">
									<h4 class="modal-title" id="staticBackdropLabel">Alert !!</h4>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body"><h6>${desc}</h6></div>
								<div class="modal-footer">
									<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
									<button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal" onclick="processModal('${clas}','${id}');">Yes</button>
								</div>
							</div>
						</div>
					</div> `;
	document.getElementById('deskModal').innerHTML = alertModal;
	var myModal = new bootstrap.Modal(document.getElementById('alertModalDiv'), {keyboard: false})
	myModal.show();
}
function destroyLoadRecord(clas,comp,rId,desc,mId){
	destroyForm(clas);
	loadRecord(clas,comp,rId,desc,mId);
}
function destroyTab(clas){
	document.querySelector('#nav-'+clas+'-tab').remove();
	document.querySelector('#nav-'+clas).remove();
}
function destroyRecord(clas){
	document.getElementById('deskOption').innerHTML = "";
}
function destroyForm(clas){
	document.getElementById('col-accordion-'+clas).innerHTML = "";
	document.getElementById("col-table-"+clas).className = "col-12";
	document.getElementById("col-accordion-"+clas).className = "";	
}
function destroyModal(clas){
	document.querySelector('#'+clas+'_modal').remove();
}
async function processModal(clas,id){
	//console.log(modalRemovePros[clas]);
	let pross =  modalRemovePros[clas];
    let pros  = pross.sort(function(a,b){ return  a.index-b.index; });
	pros.forEach(pro => {
		let args = [];
		let sargs = {}
		Object.keys(pro).forEach(k => {
			if(typeof pro[k] === 'object'){
				Object.keys(pro[k]).forEach(kk => {
					if(kk=="id"){
						args.push(id);
					}else{
						args.push(pro[k][kk])
					}
					sargs[kk] = pro[k][kk];
				})
			}
		});
		//console.log(pro['func']);
		//console.log(sargs);
		if(pro['func']=="removeRecord"){this[pro['func']](...args);}
		if(pro['func']=="search"){this[pro['func']](sargs);}
		if(pro['func']=="loadOption"){this[pro['func']](...args);}		
	})	
}
function toggleMaxMin(clas){
	toggleClasses('#col-table-'+clas, 'collapse');
	toggleClasses('#col-accordion-'+clas, 'col-lg-12 col-md-12');	
}
function toggleClasses(cssSelector, listOfClasses) {
	let element;
	let classes;
		  
	if (arguments.length !== toggleClasses.length)
	  throw new Error('Lack of required parameter.');
  
	if (typeof listOfClasses !== 'string' || listOfClasses.length === 0) 
	  throw new Error('List of CSS-classes is not valid.');
  
	classes = listOfClasses.split(/\s/); 
   
	if (typeof cssSelector !== 'string' || cssSelector.length === 0) 
	  throw new Error('Given CSS-selector is not valid.');
  
	element = document.querySelector(cssSelector);
  
	if (element === null) 
	  throw new Error('No HTML-element with selector ' + cssSelector + ' found.');
  
	classes.forEach(function(classItem, i) {
	  element.className.indexOf(classItem) === -1 
		? element.classList.add(classItem)
		: element.classList.remove(classItem);
	});
  
	return true
}
//-------------------------------------------------------//
//-------------------------------------------------------//
// SEARCH
async function search(data) {
    //let d = fillKeys(data,'tab,clas,sflds,svals,buttons,states,upld,foot,hiddenCols,iniSearch,keyCol,clasDesc,keyMas,desMas,recBut,icoSize');
    let d = fillKeys(data,'tab,clas,sflds,svals,buttons,states,upld,foot,hiddenCols,iniSearch,keyCol,clasDesc,keyMas,desMas,recBut,icoSize,displayLength');
    let head  = await searchHeader(d.clas);
    let coHead= await constructHeader(head);
	if(d.buttons!=""){
		document.getElementById(d.tab+'_tab').innerHTML = "<thead><tr>"+coHead+"<th>ACTIONS</th></tr></thead>";		
	}else{
		document.getElementById(d.tab+'_tab').innerHTML = "<thead><tr>"+coHead+"</tr></thead>";
	}

	dataTable[d.tab] = await searchData(d);    

    if(!d.hasOwnProperty("recBut")){return;}

    if(d.recBut=="yes"){
        return await addRecordButton(d.tab,d.clas,'');        
    }else{
        return false;
    }
}
const fillKeys = (d,keys) => {
    let k = keys.split(',');
    let nk = {};
    [...k].forEach(key =>{
        if(d.hasOwnProperty(key)){
			nk[key] = d[key];
        }else{
			nk[key] = "";            
        } 
    });
    return nk;
}
function searchHeader(clas) { 
    return new Promise(resolve => {
        $.get('/search.header?clase='+clas, function(data){
            var d = JSON.parse(data);
            resolve(d);
        });
    });
}
function constructHeader(head){
    return new Promise(resolve => {
        var row = "";
        $.each(head, function (k,v){
            if(typeof v === 'object'){
                $.each(v, function (kk, vv){
                    if(kk=="header"){
                        row += "<th>"+vv+"</th>";
                    }
                });
            }
        });
        resolve(row);
    });
}
function searchData (d){
    let lang ="es";
	d.icoSize = 1.5;
    let button = {};
        button['edit']   = ` <a href="#" id="btnEdit"><i class="bi bi-pencil-square" style="font-size:${d.icoSize}rem"></i></a> `;
        button['delete'] = ` <a href="#" id="btnDelete"><i class="bi bi-trash" style="color:red;font-size:${d.icoSize}rem"></i></a> `;
        button['detail'] = ` <a href="#" id="btnDetail"><i class="bi bi-truck" style="font-size:${d.icoSize}rem"></i></a> `;
        button['formModal'] = ` <a href="#" id="btnFormModal"><i class="bi bi-clipboard-check" style="font-size:${d.icoSize}rem"></i></a> `;
        button['view'] = ` <a href="#" id="btnView"><i class="bi bi-eye" style="color:#f0ad4e;font-size:${d.icoSize}rem"></i></a> `;
        button['ok'] = ` <a href="#" id="btnOk"><i class="bi bi-check2-square" style="font-size:${d.icoSize}rem"></i></i></a> `;
        button['noOk'] = ` <a href="#" id="btnNoOk"><i class="bi bi-square" style="color:red;font-size:${d.icoSize}rem"></i></i></a> `;
		button['check'] = ` <a href="#" id="{bId}"><i class="bi bi-clipboard-check" style="color:{color};font-size:${d.icoSize}rem"></i></i></a> `;
        button['check-out'] = ` <a href="#" id="{bId}"><i class="bi bi-box-arrow-right" style="color:{color};font-size:${d.icoSize}rem"></i></i></a>  `;
    let fileForm =  `<form id="file.{clase}.{doctype}"  method="post" enctype="multipart/form-data">
                    <input type="hidden" id="file.{clase}.{doctype}.clase" value='{clase}'>
                    <input type="hidden" id="file.{clase}.{doctype}.clase.id" value='{clase.id}' required>
                    <input type="hidden" id="file.{clase}.{doctype}.docType" value='{doctype}'>
                    <input type="hidden" id="file.{clase}.{doctype}.code">
                    <input type="hidden" id="file.{clase}.{doctype}.doc" value='{doc}'>                        
                    <div class="input-group">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="file.{clase}.{doctype}.name" accept="image/jpeg,application/pdf" title="{title}" placeholder="Subir Archivo">
                            <label id="file.{clase}.{doctype}.label" class="custom-file-label" for="file.{clase}.{doctype}.name">Seleccionar Archivo</label>
                        </div>
                        <div class="input-group-append">
                        <span class="input-group-text btn-success" id="file.{clase}.{doctype}.upload">Subir</span>
                        </div>
                    </div>
                </form>`;
    let fileAction =`<div class="row">
                        <div class="col-md-6"><a href="#" id="file.{clase}.{doctype}.view" style="visibility:hidden;"><i class="bi bi-eye" style="color:#f0ad4e;font-size:${d.icoSize}rem"></i></a></div>
                        <div class="col-md-6"><a href="#" id="file.{clase}.{doctype}.remove" style="visibility:hidden;"><i class="bi bi-trash" style="color:red;font-size:${d.icoSize}rem"></i></a></div>
                     </div>`;
    let claDom = d.clas.replaceAll(".","-");
    let dom = `<'row'
                    <'col-sm-12 col-md-6 col-lg-4'f>
                    <'col-sm-12 col-md-6 col-lg-8 ${claDom}_plus'l>
                >
                <'row'
                    <'col-sm-12'tr>
                >
                <'row'
                    <'col-sm-12 col-md-5'i>
                    <'col-sm-12 col-md-7'p>
                >`;
    if(d.foot=="no"){
        dom = `<'row'
                    <'col-sm-12 col-md-6 col-lg-4'f>
                    <'col-sm-12 col-md-6 col-lg-8 `+claDom+`_plus'l>
                >
                <'row'
                    <'col-sm-12'tr>
                >
              `;        
    }
    if(d.displayLength==""){d.displayLength=15}
    let params = {};
        params['ajax'] = {url :"/search.data",type:"get",data:{"clase":d.clas,"sfields":d.sflds,"svalues":d.svals},dataType:"JSON"};
        params['processing'] = true;
        params['serverSide'] = true;
        params['iDisplayLength'] = d.displayLength;
        params['lengthChange'] = false;
        params['language'] = {url: `/res/modules/datatables4/lang/${lang}.json`};
        params['searching'] = true;
        params['dom'] = dom;
    if(d.iniSearch!=""){
        params['oSearch'] = {"sSearch": d.iniSearch};
    }
    if(d.hiddenCols!=""){
        let cols = [];
        let hCols= d.hiddenCols.split(',');
        hCols.forEach(col => {
            let cl = {"targets": col*1,"visible": false,"searchable": false};
            cols.push(cl);
        });
        params['columnDefs'] = cols;
    }
    let boton = {};
    if(d.buttons !=""){
        let butts = "";
        let arr = d.buttons.split(",");
        for (let i=0;i<arr.length;i++ ){
            butts += button[arr[i]];
            boton[arr[i]] = 1;
        }
        if(params['columnDefs']){
            let colBu = {targets: -1, data: null, defaultContent:butts};
            params['columnDefs'].push(colBu);
        }else{
            params['columnDefs'] = [{"targets": -1, data: null, defaultContent:butts}];
        }
    }/*
    if(!isEmpty(d.state)){
        let condition = "";
        let inx = d.state.inx;
        let stts = d.state.states;
        for (let item in stts){
            let html = "";
            if(stts[item]!=""){html=button[stts[item]]}
            condition += "if(rowData["+inx+"] === '"+item+"'){$(td).html('"+html+"')}";
        }
        if(params['columnDefs']){
            let colSt = {"targets": -1,"createdCell": Function("td, cellData, rowData, row, col",condition)};
            params['columnDefs'].push(colSt);
        }else{
            params['columnDefs'] =[ {"targets": -1,"createdCell": Function("td, cellData, rowData, row, col",condition)}];
        }
    }
	 * */
    if(!isEmpty(d.states)){
		let colSt = "";
        let condition = "";
        let inx = d.states.inx;
        let view = d.states.view;		
        let stts = d.states.states;
        for (let item in stts){
			let estado = item;
			let icon = "";
			let bId  = "";
			let color  = "red";			
			for (let subItem in stts[item]){
				if(subItem=="icon"){icon = stts[item][subItem]}
				if(subItem=="id"){bId = stts[item][subItem]}
				if(subItem=="color"){color = stts[item][subItem]}				
			}
            let html = "";
            if(icon!=""){html=button[icon];html = html.replaceAll("{bId}",bId);html = html.replaceAll("{color}",color)}
            condition += "if(rowData["+inx+"] === '"+item+"'){$(td).html('{defaultContent}"+html+"')}";
        }
		let defaultContent = "";
		if(params['columnDefs']){
			for (let i=0;i<params['columnDefs'].length;i++ ){
				if(params['columnDefs'][i]['defaultContent']){defaultContent=params['columnDefs'][i]['defaultContent']}
			}			
		}
		if(view=="inline"){
			condition = condition.replaceAll("{defaultContent}",defaultContent);
			colSt = {"targets": -1,"createdCell": Function("td, cellData, rowData, row, col",condition)};				
		}else{
			condition = condition.replaceAll("{defaultContent}","");				
			colSt = {"targets": -1,"createdCell": Function("td, cellData, rowData, row, col",condition)};				
		}
        if(params['columnDefs']){
            params['columnDefs'].push(colSt);
        }else{
            params['columnDefs'] =[ {"targets": -1,"createdCell": Function("td, cellData, rowData, row, col",condition)}];
        }
    }	 
    if(!isEmpty(d.gridUpload)){
        params["rowCallback"] = function( row, data ) {
            d.gridUpload.forEach(upl =>{
                let form = fileForm;
                let claId = "";
                let docType = "";
                let typeDoc = "";
                if(upl['clase.id']){claId=upl['clase.id']}else{claId=data[upl['inxId']]}
                if(upl['doctype']){
                    let dct = upl['doctype'];
                    let dci = data[upl['inxDt']];
                    docType = (dct+dci).toLowerCase();
                    typeDoc = docType;
                }else{
                    docType=data[upl['inxDt']].toLowerCase()
                }
                form =  form.replace(/{clase}/g,upl['clase']);
                form =  form.replace(/{clase.id}/g,claId);
                form =  form.replace(/{doctype}/g,docType);
                form =  form.replace(/{doc}/g,data[upl['inxId']]);
                let action = fileAction;
                action =  action.replace(/{clase}/g,upl['clase']);
                action =  action.replace(/{doctype}/g,docType);
                $('td:eq('+upl['fileInputTarget']+')', row).html(form);
                $('td:eq('+upl['fileControlTarget']+')', row).html(action);
                setTimeout(function () {
                    fileOnClickEventListener('file.'+upl['clase']+"."+docType);
                    fileOnChangeEventListener('file.'+upl['clase']+"."+docType);
                    getFiles(upl['clase'],claId,typeDoc);
                }, 1000);
            });
        }
    }
    return new Promise(resolve => {
        var tab1 = d.tab.replace(/\./g,"\\.");
        if ($.fn.DataTable.isDataTable('#'+tab1+'_tab')) {
            $('#'+tab1+'_tab').DataTable().destroy();
        }
        var t = $('#'+tab1+'_tab').DataTable(params);
        if(d.buttons !=""){
            if(boton['edit']==1){
                $('#'+tab1+'_tab tbody').on("click", "[id*=btnEdit]", function () {
                    let data = dataTable[d.clas].row($(this).parents('tr')).data();
                    let masId = "";
                    if(d.keyMas!=""){masId = data[d.keyMas*1]}else{ masId = ""};
                    loadRecord(d.clas,'record',data[d.keyCol*1],d.clasDesc,masId);
                });
            }            
            if(boton['delete']==1){
                $('#'+tab1+'_tab tbody').on('click', '[id*=btnDelete]', async function () {
                    let data = dataTable[d.clas].row($(this).parents('tr')).data();
                    alertModalProcess("Are you sure, you wish to remove this information ?",d.clas,data[d.keyCol*1]);
                });
            }
			if(boton['formModal']==1){
                $('#'+tab1+'_tab tbody').on("click", "[id*=btnFormModal]", function () {
                    let data = dataTable[d.clas].row($(this).parents('tr')).data();
					if(d.keyCol==""){d.keyCol=0}
					loadFormModal(d.clas,'record',data[d.keyCol*1],d.clasDesc,data[d.keyMas*1]) 
				});
			}
			if(boton['form']==1){
                $('#'+tab1+'_tab tbody').on("click", "[id*=btnForm]", function () {
					var data = dataTable[d.clas].row(this).data();
					if(d.keyCol==""){d.keyCol=0}
					let masDes = "";
					if(d.desMas!=""){masDes = data[d.desMas*1]}else{ masDes = ""};
					loadForm(d.clas,'form',data[d.keyCol*1],d.clasDesc,data[d.keyMas*1],masDes);
                });
			}			
        }else{
            $('#'+tab1+'_tab tbody').on('click', 'tr', function () {
                var data = dataTable[d.clas].row(this).data();
                if(d.keyCol==""){d.keyCol=0}
                let masDes = "";
                if(d.desMas!=""){masDes = data[d.desMas*1]}else{ masDes = ""};
                loadAccordion(d.clas,'accordion',data[d.keyCol*1],d.clasDesc,data[d.keyMas*1],masDes);  
            });
        }
        resolve(t);
    });    
}
function addRecordButton(tab,clas,icon){
    return new Promise(resolve => {
        dataTable[tab].on('draw', function (data) {
            let valid = false;
            let claDom = clas.replaceAll(".","-");
            if(!document.getElementById(clas+'_add')){
                //let boton = `<a href="#" id='`+clas+`_add' style='margin-right:10px;height:2rem'><i class='far fa-plus-square fa-2x'></i></a>`;
                let boton = `<a href="#" id='`+clas+`_add' style='margin-right:10px;height:2rem;position:relative;top:-5px'><i class="bi bi-plus-square" style="font-size:1.5rem;"></i></a>`;
                document.querySelector("."+claDom+"_plus").insertAdjacentHTML('beforeend', boton);
            	valid = true;
            }
           resolve(valid);
        });   
    }); 
}
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
//-------------------------------------------------------//
//-------------------------------------------------------//
// RECORD
async function record(clas,id){
	let data = {'clase':clas,'id':id};
	let record  = await getRecord(data);
				  await fillRecord(record);
}
async function getRecord(data){
	return await (await fetch('/record.get', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function getRecordPair(data){
	return await (await fetch('/record.pair', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function recordAssociation(clas,mid,id){
	let data = {'clase':clas,'mid':mid,'id':id};
	let record = await (await fetch('/record.association', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
				 await fillRecord(record);
}
async function fillRecord(data){
	let d = JSON.parse(data);
	//console.log(d);
	Object.keys(d).forEach(k => {
		if(document.getElementById(k)){document.getElementById(k).value	= d[k];}
		//console.log(k+">"+d[k]);
		if(typeof d[k] === 'object' && d[k] != null){
			Object.keys(d[k]).forEach(kk => {
				if(document.getElementById(k+"."+kk)){document.getElementById(k+"."+kk).value	= d[k][kk];}
				//console.log(kk+">>"+d[k][kk]);
				if(typeof d[k][kk] === 'object' && d[k][kk] != null){
					Object.keys(d[k][kk]).forEach(kkk => {
						if(document.getElementById(k+"."+kk+"."+kkk)){document.getElementById(k+"."+kk+"."+kkk).value	= d[k][kk][kkk];}
						//console.log(kkk+">>>"+d[k][kk][kkk]);
					})
				}
			})
		}            //d[key];
    })
}
async function saveRecordAlert(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}
	try {
		const alert =  await Swal.fire({
			title: "¡Atención!",
			text: "¿Está Seguro/a de Guardar esta Información?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: "Si, Guardar",
		});
		if(alert.value === true){
			return await save(data);
		}else{
			return false;
		}
	} catch (e) {
		console.log('error:', e);
	 return false;
	}
}
async function saveRecord(cla){
	let data = await getRecordElements(cla);
	//console.log(data)
	if(data==false){return false}
	return await save(data);
}
async function saveClassAlert(cla,sec){
	let data = await getClassElements(cla,sec);
	if(data==false){return false}
	try {
		const alert =  await Swal.fire({
			title: "¡Atención!",
			text: "¿Está Seguro/a de Guardar esta Información?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: "Si, Guardar",
		});
		if(alert.value === true){
			return await save(data);
		}else{
			return false;
		}
	} catch (e) {
		console.log('error:', e);
	 return false;
	}
}
async function saveClass(cla,sec){
	let data = await getClassElements(cla,sec);
	if(data==false){return false}
	return await save(data);
}
async function save(data){
	return await (await fetch('/record.save', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function set(data){
	return await (await fetch('/record.set', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function removeRecord(clas,id){
	var data = {};
	data['clase'] = clas;
	data['id'] = id;
	return await remove(data);	
}
async function remove(data){
	return await (await fetch('/record.remove', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function getRecordElements(cla){
	let valid = true;
	let datos = {};
	datos['clase'] = cla;
	[...document.getElementById(cla).elements].forEach(key =>{
        if(key.tagName==="INPUT" || key.tagName==="SELECT" || key.tagName==="TEXTAREA" ){
			if(!document.getElementById(key["id"].replaceAll(cla+".", ''))){
				let val = "";
				if (key.type == "checkbox") {
					val = document.getElementById(key["id"]).checked;
				}else if(key.type == "radio"){
					if(document.getElementById(key["id"]).checked){
						let id = document.getElementById(key["id"]).name;
						val = document.getElementById(key["id"]).value;
						if(id.split(".").length>1){ datos[id.replace(cla+".", "")] = val; }
					}
				}else{
					if (!document.getElementById(key["id"]).checkValidity()) {
						title = document.getElementById(key["id"]).title;
						alertModal("Favor Completar "+title,"");
						valid = false;
					}
					val = document.getElementById(key["id"]).value;
				}
				if(key["id"].split(".").length>1){ datos[key["id"].replace(cla+".", "")] = val; }
			}
		}
	});
	if(!valid==false){return datos;}else{return false}
}
async function getClassElements(cla,sec){
	let valid = true;
	let datos = {};
	datos['clase'] = cla;
	[...document.getElementsByClassName(sec)].forEach(key =>{
        if(key.tagName==="INPUT" || key.tagName==="SELECT" || key.tagName==="TEXTAREA" ){
			if(!document.getElementById(key["id"].replaceAll(cla+".", ''))){			
				let val = "";
				if (key.type == "checkbox") {
					val = document.getElementById(key["id"]).checked;
				}else if(key.type == "radio"){
					if(document.getElementById(key["id"]).checked){
						let id = document.getElementById(key["id"]).name;
						val = document.getElementById(key["id"]).value;
						if(id.split(".").length>1){ datos[id.replace(cla+".", "")] = val; }
					}
				}else{
					if (!document.getElementById(key["id"]).checkValidity()) {
						title = document.getElementById(key["id"]).title;
						alertModal("Favor Completar "+title,"");
						valid = false;
					}
					val = document.getElementById(key["id"]).value;
				}
				if(key["id"].split(".").length>1){
					datos[key["id"].replace(cla+".", "")] = document.getElementById(key["id"]).value;
				}
			}
		}
	});
	if(!valid==false){return datos;}else{return false}
}
//-------------------------------------------------------//
//-------------------------------------------------------//
// COLLECTION
async function getCollection(clas,key,rid,fds,ord,dir){
    let data = {'clase':clas,'key':key,'id':rid,'fds':fds,'order':ord,'dir':dir};
    return await (await fetch('/collection.get', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();;
}
async function getCollectionPair(clas,key,val){
    let data = {'clase':clas,'key':key,'val':val};
    return await (await fetch('/collection.pair', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();;
}
async function fillSelect(str,ele){
    let d = JSON.parse(str);
    let selec = document.getElementById(ele);
    selec.length = 1;
    Object.keys(d).forEach(key => {
        var newOption = document.createElement("option");
        newOption.value		= key;
        if (typeof newOption.textContent === 'undefined'){
            newOption.innerText = d[key];
        }else{
            newOption.textContent = d[key];
        }
        selec.appendChild(newOption);
    });
}
async function getCollectionFiltered(clas,key,val,keys,values){
    let data = {'clase':clas,'key':key,'val':val,'keys':keys,'values':values};
    return await (await fetch('/collection.pairFiltered', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();;
}
async function getCollectionCount(clas,keys,vals){
    let data = {'clase':clas,'keys':keys,'vals':vals};
    return await (await fetch('/collection.count', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();;
}
async function getQueryCollection(query){
    let data = {'sql':query};
    return await (await fetch('/collection.getQuery', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();;
}
//-------------------------------------------------------//
//-------------------------------------------------------//
// FORM
function formCheckElements(cla,icon){
	let valid = true;
	[...document.querySelector('#'+cla).elements].forEach(key =>{
		if(key.tagName==="INPUT" || key.tagName==="SELECT" || key.tagName==="TEXTAREA" ){
            //console.log(key["id"]);
			if (!document.getElementById(key["id"]).checkValidity()) {
				valid = false;
			}
		}
	});
	if (valid === true) {			
        document.getElementById(icon).className = "fas fa-check-circle";
	}  
    return valid;	
}
function formCheckGrid(cla,icon){
    return new Promise(resolve => {
        dataTable[cla].on('draw', function (data) {
            let valid = false;
            if(dataTable[cla].page.info().recordsDisplay>0){		
                document.getElementById(icon).className = "fas fa-check-circle";
                valid=true;
           }else{
                valid=false;
           }
           resolve(valid);
        });   
    }); 
}
function fileFormCheckGrid(cla,gridUpload,icon){
    dataTable[cla].on('draw', function (data) {
        if(dataTable[cla].page.info().recordsDisplay>0){		
            setTimeout(function () {
                let valid = true;
                dataTable[cla].rows().every(function(){
                    let d = this.data()
                    gridUpload.forEach(upl =>{
                        if(valid==false){return;}
                        if(upl['doctype']){
                            let dct = upl['doctype'];
                            let dci = d[upl['inxDt']];
                            docType = (dct+dci).toLowerCase();
                            typeDoc = docType;
                        }else{
                            docType=d[upl['inxDt']].toLowerCase()
                        }
                        if(!document.getElementById("file."+upl['clase']+"."+docType+".code")){
                            valid=false;
                        }else {
                            //console.log("file."+upl['clase']+"."+docType+".code"+"<>"+document.getElementById("file."+upl['clase']+"."+docType+".code").value);
                            if(document.getElementById("file."+upl['clase']+"."+docType+".code").value==""){
                                valid=false;
                            }
                        }                   
                    });
                });
                if(valid==true){document.getElementById(icon).className = "fas fa-check-circle";}   
                return valid; 
            }, 2000);
        }                    
    });
}
function formCheckElement(element,icon){
    let valid = false;    
    if(document.getElementById(element).value != null){
        document.getElementById(icon).className = "fas fa-check-circle";
		valid = true;
    }
    return valid;
}
function classCheckElements(cla,icon){
	let valid = true;
	[...document.getElementsByClassName(cla)].forEach(key =>{
		if(key.tagName==="INPUT" || key.tagName==="SELECT" || key.tagName==="TEXTAREA" ){
            //console.log(key["id"]);
			if (!document.getElementById(key["id"]).checkValidity()) {
				valid = false;
			}
		}
	});
	if (valid === true) {			
        document.getElementById(icon).className = "fas fa-check-circle";
	}  
    return valid;	
}
//-------------------------------------------------------//
//-------------------------------------------------------//
// FILE
async function fileUploadAlert(cla){
	let data = await getFormFileElements(cla);
	//console.log(data);
	//return;
	if(data==false){return false}
	try {
		const alert =  await Swal.fire({
			title: "¡Atención!",
			text: "¿Está Seguro/a de Subir este Archivo?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: "Si, Guardar",
		});
		if(alert.value === true){
			return await upload(data);
		}else{
			return false;
		}
	} catch (e) {
		console.log('error:', e);
	 return false;
	}
}
async function fileUpload(cla){
	let d = await getFormFileElements(cla);
	let formData = getFormFileData(cla,d);
	let response = await upload(formData);
	return response.status;
}
async function upload(data){
	return await (await fetch('/file.upload', {method: 'POST',body: data}));
}
async function fileRemoveAlert(cla,id){
	var data = {};
	data['clase'] = cla;
	data['id'] = id;
	try {
		const alert =  await Swal.fire({
			title: "¡Atención!",
			text: "¿Está Seguro/a de Eliminar esta Información?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: "Si, Guardar",
		});
		if(alert.value === true){
			return await remove(data);
		}else{
			return false;
		}
	} catch (e) {
		console.log('error:', e);
	 return false;
	}
}
async function fileRemove(fileName){
	let data = {'fileName':fileName}
	return await (await fetch('/file.remove', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function fileSearch(pattern,extension){
    let data = {'pattern':pattern,'extension':extension}
    return await (await fetch('/file.search', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function getFormFileElements(cla){
	let valid = true;
	let datos = {};
	datos['clase'] = cla;
	[...document.getElementById(cla).elements].forEach(key =>{
		if(key.tagName==="INPUT" || key.tagName==="SELECT" || key.tagName==="TEXTAREA" ){
			if (!document.getElementById(key["id"]).checkValidity()) {
				title = document.getElementById(key["id"]).title;
				alertModal("Favor Completar "+title,"");				
				valid = false;
			}
			if(key["id"].split(".").length>1){ datos[key["id"].replace(cla+".", "")] = document.getElementById(key["id"]).value; }
		}
	});
	if(!valid==false){return datos;}else{return false}	
}
function getFormFileData(cla,object) {
    const formData = new FormData();
	Object.keys(object).forEach(key => formData.append(key, object[key]));
	let fileField = document.getElementById(cla+".name");
	formData.append('file', fileField.files[0])
	return formData;	
}
//-------------------------------------------------------//
//-------------------------------------------------------//
// PRINT
function printFile(file){
	let peticion = "file.get?nombre="+file;
	let ext = file.split(".");
	if(ext[1].toUpperCase() == "PDF"){
        let win = window.open(peticion, '_blank');
        win.focus();
	}else if(ext[1].toUpperCase() == "JPEG" || tipoDoc == "JPG"){	
		printJS({
			printable: peticion,
			documentTitle: file,
			type: 'image'
		});
	}else{
		alertModal("¡Lo sentimos!","Ocurrio un error al intentar imprimir el documento, por favor, intentalo nuevamente","");
	}
}
//-------------------------------------------------------//
//-------------------------------------------------------//
// GENERATE
async function appGenerate(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}	
	return await (await fetch('/generate.app', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function appConfiguration(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}	
	return await (await fetch('/generate.configuration', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function appSchema(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}	
	return await (await fetch('/generate.schema', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function appPopulate(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}	
	return await (await fetch('/generate.appPopulate', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();	
}
async function objectGenerate(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}	
	return await (await fetch('/generate.object', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function objectCollection(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}
	return await (await fetch('/generate.collection', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function objectClass(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}
	//console.log(data);
	return await (await fetch('/generate.class', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function interfaceGenerate(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}	
	return await (await fetch('/generate.interface', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function interfaceXml(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}
	return await (await fetch('/generate.xml', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function interfaceHtml(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}
	return await (await fetch('/generate.html', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function interfaceJs(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}
	return await (await fetch('/generate.js', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
async function classProperties(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}
	return await (await fetch('/generate.classProperties', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();	
}
async function viewRecordElements(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}
	return await (await fetch('/generate.viewRecordElements', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();	
}
async function viewSearchColumns(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}
	return await (await fetch('/generate.viewSearchColumns', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();	
}
async function viewFormColumns(cla){
	let data = await getRecordElements(cla);
	if(data==false){return false}
	return await (await fetch('/generate.viewFormColumns', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();	
}
//-------------------------------------------------------//
//-------------------------------------------------------//
// RECOBRO
async function pagoDias(cla,rid){
	let datos = {};
	datos['clase'] = cla;
    datos['id'] = rid;
    return await (await fetch('/recobro.pagoDias', {method: 'post',headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})).json();
}
//-------------------------------------------------------//
//-------------------------------------------------------//
// AUXILIAR
function loadScript(option) {
	let src = "/res/js/"+option+".js";
	let script = document.createElement('script');
	let id = src.split('\\').pop().split('/').pop();
	script.id = id;
	script.src = src;
	script.async = false;
	//script.type = "module";	
	if(document.getElementById(id)){
		const scriptElem = document.getElementById(id); 
		scriptElem.remove();
	}
	document.body.append(script);
}
function loadStyle(src){
	let fileName = src.split('\\').pop().split('/').pop().split('.');	
	let fileRef=document.createElement("link")
	//fileRef.id = fileName[0];
	//fileRef.async = false;	
	fileRef.setAttribute("rel", "stylesheet")
	fileRef.setAttribute("type", "text/css")
	fileRef.setAttribute("href", src)
}