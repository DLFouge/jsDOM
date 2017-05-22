//文档加载完后运行某个函数时需要
function addLoadEvent(func){
	var oldonload = window.onload;
	if(typeof window.onload != 'function'){
		window.onload = func;
	}else{
		window.onload = function(){
			oldonload();
			func();
		}
	}
}

//把一个新元素插入到一个现有元素的后面
function insertAfter(newElement,targetElement){
	var parent = targetElement.parentNode;
	if(parent.lastChild == targetElement){
		parent.appendChild(newElement);
	}else{
		parent.insertBefore(newElement,targetElement.nextSibling);
	}
}

//追加class
function addClass(element,value){
	if(!element.className){
		element.className = value;
	}else{
		newClassName = element.className;
		newClassName += " ";
		newClassName += value;
		element.className = newClassName;
	}
}

function highlightPage(href){
	if(!document.getElementsByTagName) {return false;}
	if(!document.getElementById) {return false;}
	var headers = document.getElementsByTagName('header');
	if(headers.length == 0) {return false;}
	var navs = document.getElementsByTagName('nav');
	if(navs.length == 0) {return false;}
	var links = navs[0].getElementsByTagName('a');
	for (var i = 0; i < links.length; i++) {
		var linkurl;
		for (var i = 0; i < links.length; i++) {
			linkurl = links[i].getAttribute("href");
			if(window.location.href.indexOf(linkurl) != -1){
				links[i].className = "here";
				var linktext = links[i].lastChild.nodeValue.toLowerCase();
				document.body.setAttribute("id",linktext)
			}
		}
	}
}
addLoadEvent(highlightPage);

//about内部链接
function showSection(id){
	var sections = document.getElementsByTagName("section");
	for (var i = 0; i < sections.length; i++) {
		if(sections[i].getAttribute("id") != id){
			sections[i].style.display = "none";
		}else{
			sections[i].style.display ="block";
		}
	}
}
function prepareInternalnav(){
	if(!document.getElementsByTagName) {return false;}
	if(!document.getElementById) {return false;}
	var articles = document.getElementsByTagName("article");
	if(articles.length == 0) {return false;}
	var navs = articles[0].getElementsByTagName("nav");
	if(navs.length == 0) {return false;}
	var nav = navs[0];
	var links = nav.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		var sectionId = links[i].getAttribute("href").split("#")[1];
		if(!document.getElementById(sectionId)) continue;
		document.getElementById(sectionId).style.display = "none";
		links[i].destination = sectionId;
		links[i].onclick = function(){
			showSection(this.destination);
			return false;
		}
	}
}
addLoadEvent(prepareInternalnav);

//photos
function preparePlaceholder(){
	if (!document.createElement) { return false;}
	if (!document.createTextNode) { return false;}
	if (!document.getElementById) { return false;}
	if (!document.getElementById("imagegallery")) {return false;}
	var placeholder = document.createElement("img");
	placeholder.setAttribute("id","placeholder");
	placeholder.setAttribute("src","images/placeholder.jpg");
	placeholder.setAttribute("alt","my image gallery");
	var description = document.createElement("p");
	description.setAttribute("id","description");
	var desctext = document.createTextNode("Choose an image");
	description.appendChild(desctext);
	var gallery = document.getElementById("imagegallery");
	insertAfter(description,gallery);
	insertAfter(placeholder,description);	
}
function prepareGallery(){
	if (!document.getElementsByTagName) {return false;}
	if (!document.getElementById) {return false;}
	if (!document.getElementById("imagegallery")) {return false;}
	var gallery = document.getElementById("imagegallery");
	var links = gallery.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		links[i].onclick = function(){
			return showPic(this) ? false : true;
		}
		links[i].onkeypress = links[i].onclick;
	}
}
function showPic(whichpic){
	if(!document.getElementById("placeholder")) {return false;}
	var source = whichpic.getAttribute("href");
	var placeholder = document.getElementById("placeholder");
	placeholder.setAttribute("src", source);
	if(!document.getElementById("description")) {return false;}
	if(whichpic.getAttribute("title")){
		var text = whichpic.getAttribute("title")
	}else{
		var text = "";
	}
	var description = document.getElementById("description");
	if(description.firstChild.nodeType == 3){
		description.firstChild.nodeValue = text;
	}
	return true;
}
addLoadEvent(preparePlaceholder);
addLoadEvent(prepareGallery);

//live
function stripeTables(){
	if(!document.getElementsByTagName) {return false;}
	var tables = document.getElementsByTagName("table");
	for (var i = 0; i < tables.length; i++) {
		var odd = false;
		var rows = tables[i].getElementsByTagName("tr");
		for (var j = 0; j < rows.length; j++) {
			if(odd == true){
				addClass(rows[j], "odd");
				odd = false;
			}else{
				odd = true;
			}
		}
	}
}
function highlightRows(){
	if(!document.getElementsByTagName) {return false;}
	var rows = document.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		rows[i].oldClassName = rows[i].className;
		rows[i].onmouseover = function(){
			addClass(this , "highlight");
		}
		rows[i].onmouseout = function(){
			this.className = this.oldClassName;
		}
	}
}
addLoadEvent(stripeTables);
addLoadEvent(highlightRows);

//contact中label获得焦点函数
function focusLabels(){
	if(!document.getElementsByTagName) {return false;}
	var labels = document.getElementsByTagName("label");
	for (var i = 0; i < labels.length; i++) {
		if(!labels[i].getAttribute("for")) continue;
		labels[i].onclick = function(){
			var id = this.getAttribute("for");
			if(!document.getElementById(id)) {return false;}
			var element = document.getElementById(id);
			element.focus();
		}
	}
}
addLoadEvent(focusLabels);
function resetField(whichform){
	if(Modernizr.input.placeholder) return;
	for(var i = 0; i < whichform.elements.length; i++){
		var element = whichform.elements[i];
		if(element.type == "submit") continue;
		var check = element.placeholder || element.getAttribute('placeholder');
		if(!check) continue;
		element.onfocus = function(){
			var text = this.placeholder || this.getAttribute('placeholder');
			if(this.value == text){
				this.className = '';
				this.value = "";
			}
		}
		element.onblur = function(){
			if(this.value == ""){
				this.className == 'placeholder';
				this.value = this.placeholder || this.getAttribute('placeholder');
			}
		}
		element.onblur();
	}
}

//提交表单
function isFilled(field){
	if(field.value.replace(' ','').length == 0) {return false;}
	var placeholder = field.placeholder || field.getAttribute('placeholder');
	return(field.value != placeholder);
}
function isEmail(field){
	return(field.value.indexOf("@") != -1 && field.value.indexOf(".") != -1);
}

function validateForm(whichform){
	for (var i = 0; i < whichform.elements.length; i++) {
		var element = whichform.elements[i]
		if(element.required == 'required'){
			if(!isFilled(element)){
				alert("Please fill in the " +element.name+ " field.");
				return false;
			}
		}
		if(element.type == 'email'){
			if(!isEmail(element)){
				alert("The "+element.name+" field must be a valid email address.");
				return false;
			}
		}
	}
	return true;
}


function getHTTPObject(){
	if(typeof XMLHttpRequest == "undefined")
		XMLHttpRequest = function(){
			try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}
				catch(e){}
			try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}
				catch(e){}
			try{return new ActiveXObject("Msxml2.XMLHTTP");}
				catch(e){}
			return false;
		}
	return new XMLHttpRequest();
}
function displayAjaxLoading(element){
	while(element.hasChildNodes()){
		element.removeChild(element.lastChild);
	}
	var content = document.createElement("img");
	content.setAttribute("src","images/loading.gif");
	content.setAttribute("alt","Loading...");
	element.appendChild(content);
}
function submitFormWithAjax(whichform,thetarget){
	var request =getHTTPObject();
	if(!request) {return false;}
	displayAjaxLoading(thetarget);
	var dataParts = [];
	var element;
	for (var i = 0; i < whichform.elements.length; i++) {
		element = whichform.elements[i];
		dataParts[i] = element.name + '=' + encodeURIComponent(element.value);
	}
	var data = dataParts.join('&');
	request.open('POST', whichform.getAttribute("action"), true);
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function(){
		if(request.readyState == 4){
			if(request.status == 200 || request.status == 0){
				var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
				if(matches.length > 0){
					thetarget.innerHTML = matches[1];
				}else{
					thetarget.innerHTML = '<p>Oops, there was an error. Sorry.</p>';
				}
			}else{
				thetarget.innerHTML = '<p>' + request.statusText + '</p>';
			}
		}
	};
	request.send(data);
	return true;
};
function prepareForms(){
	for (var i = 0; i < document.forms.length; i++) {
		var thisform = document.forms[i];
		resetFields(thisform);
		thisform.onsubmit = function(){
			if(!validateForm(this)) {return false;}
			var article = document.getElementsByTagName('article')[0];
			if(submitFormWithAjax(this, article)) {return false;}
			return true;
		}
	}
}
addLoadEvent(prepareForms);

