(function(){
	/*
	 * globals
	 */
	var brand = "FLINK"
	, repo = ""
	, download = ""
	, brands = document.getElementsByClassName("brand")
	, downloadlinks = document.getElementsByClassName("download-link")
	, repolinks = document.getElementsByClassName("repo-link")
	, repotexts = document.getElementsByClassName("repo-text");

	/*
	 * main nav
	 */
	var nav = {
		home: {text: "Home", href: "index.html", type: "text/html"}
		, demo: {text: "Demo", href: "demo.html", type: "text/html"}
		, tutorial: {text: "Tutorial", href: "tutorial.html", type: "text/html"}
		, about: {text: "About", href: "about.html", type: "text/html"}
		, contact: {text: "Contact", href: "contact.html", type: "text/html"}
	}

	/*
	 * ajax requests
	 */
	function request(params)
	{
		var xmlhttp
		, key
		, args = {
			method: "GET"
			, url: "", async: true
			, user: null, pass: null
			, success: function() {}
		};
		for (key in args) {
			if (params[key]) {
				args[key] = params[key];
			}
		}
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				if (args.success) {
					args.success(this.response, this);
				}
			}
		};  
		xmlhttp.open(args.method, args.url, args.async, args.user, args.pass);
		xmlhttp.send();
	}

	/*
	* utility for render a object using a template.
	*/
	function render  (object, template, keys) {
		keys = keys || [];
		if (keys.length === 0) {
			for(var key in object) {
				keys.push(key);
			}	
		}
		for (var i=0; i<keys.length; i++) {
			var key = keys[i];
			var mark = new RegExp("%" + key + "%", "gi")
			var value = object[key];
			template = template.replace(mark, value);
		}
		return template;
	};

	/*
	 * render contents.
	 */
	function start()
	{
		// prevent show header and footer if required	
		if (location.search) { // asumes format ?q=<query>
			var query = location.search.substr(3);
			if (query==="content") { // hide header and footer.
				document.body.style.paddingTop="0px";
				document.getElementsByTagName("header")[0].style.display="none";
				document.getElementsByTagName("footer")[0].style.display="none";
			}
		}

		// head(); // works fine but should prevent load css before show content
		main();
		navigation();
		footer();
		addFlink();

		// click toggle menu
		document.getElementById("toggle-menu")
			.addEventListener("click",	function(evt) {
				var nav = document.getElementById("main-nav");			
				nav.classList.remove("no-transition");
				if (nav.classList.contains("slide-show")) {
					nav.classList.remove("slide-show");
					nav.classList.add("slide-hide");
				} else {
					nav.classList.remove("slide-hide");	
					nav.classList.add("slide-show");
				}
				setTimeout(function() {
					nav.classList.add("no-transition");
					}, 250);			
			});
	}

	/*
	 * head.
	 */
	function head()
	{
		var tags = [
			{key: "title"}
			//, {key: "meta", charset: "utf-8"}
			, {key: "meta", name: "viewport", content: "width=device-width, initial-scale=1"}
			, {key: "link", rel: "icon", href:"/img/sonimatec.ico", type:"image/x-icon"}
			, {key: "link", rel: "stylesheet", href:"style.css"}
			, {key: "link", rel: "stylesheet", href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"}
		];

		var i, tag, element, key;
		for(var i=0; i<tags.length; i++) {
			tag = tags[i];
			var element = document.createElement(tag.key);
			for(key in tag) {
				if (key==="key") continue;
				element.setAttribute(key, tag[key]);
			}
			document.head.appendChild(element);
		}
	}

	/*
	 * replace brand marks and others.
	 */
	function main()
	{
		// header h1
		document.getElementById("brand").innerHTML 
			= "<a href=\"./index.html\">"
			 + brand + " <span class=\"status\">beta</span> </a>";		

		// app name
		for (var i=0, l=brands.length; i<l; i++) {
			brands[i].innerHTML = brand;
		}

		// download url from github
		for (var i=0, l=downloadlinks.length; i<l; i++) {
			downloadlinks[i].href = download;
		}

		// CDN links 
		for (var i=0, l=repolinks.length; i<l; i++) {
			repolinks[i].href = repo;
		}

		// CDN texts
		for (var i=0, l=repotexts.length; i<l; i++) {
			repotexts[i].innerHTML = repo;
		}		
	}

	/*
	 * render site navigation.
	 */
	function navigation()
	{
		var page = location.href.split("/").pop();
		page = page || "index.html";
		if (page==="demo.html") createForms();
		var link, links = {};
		var navElm = document.getElementById("main-nav");
		for(var key in nav) {
			link = document.createElement("a");
			link.id = "nav-" + key;
			link.text = nav[key].text;
			link.href = nav[key].href;
			link.type = nav[key].type;
			if(nav[key].href===page) {
				link.className = "active";
				document.title = link.text;
			}
			navElm.appendChild(link);
		}
	}
	
	/*
	 * render footer.
	 */
	function footer()
	{
		// load footer content
		request({
			url: "./partials/_footer.html"
			, success: function (response) {
				var footer = document.getElementById("footer-container");
				footer.innerHTML = response;
			}
		});
	}

	/*
	 * create sample forms in demo page
	 */
	function createForms()
	{
		var demo, form, section,  inputs, input, type, subtype, demos=[]
		, oform, osection, ocontrol, olabel, oinput
		, now = new Date()
		, today = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()
		, otarget = document.getElementById('demo-forms')
		, NAME=0, TYPE=1, VALUE=2
		, TYPES = {
			text: 'input', email: 'input', date: 'input', url: 'input'
		}
		;
		demos[0] = {
			sections: [				
				{
					style: 'inline'
					, inputs: ['name:text:Name', 'surname:text:Surname']
				}					
				, {
					style: 'inline'
					, inputs: ['email:email:sample@example.com', 'reservation:date:' + today]
				}					
				
			] // /sections	
		} 
		for(var i=0; i< demos.length; i++) {
		
			demo = demos[i];				
			var h3 = document.createElement('h3');
			h3.innerHTML = 'Demo form [' + i + ']';
			
			otarget.appendChild(h3);
			oform = document.createElement('form');				
			oform.name = h3.innerText;
			
			for (var j=0; j<demo.sections.length; j++) {
				// section
				section = demo.sections[j];				
				osection = document.createElement('section');
				osection.className = section.style;
				// inputs
				for (var k=0; k< section.inputs.length; k++) {
					// input
					var dfn = section.inputs[k].split(':');
					name = dfn[NAME];
					type = dfn[TYPE];
					if (TYPES[type]) {
						subtype = type;
						type = TYPES[type];
					}
					input = type;
					value = dfn[VALUE];

					oinput = document.createElement(input);
					oinput.type = type;
					oinput.id = name; //'input-' + new Date().getMilliseconds()
					oinput.name = name;
					oinput.value = value;
					// label
					olabel = document.createElement('label');
					olabel.setAttribute("for",oinput.id);
					olabel.innerHTML = name.toUpperCase();						
					// control 	
					ocontrol = document.createElement('div');
					ocontrol.className = 'control';						
					ocontrol.appendChild(olabel);
					ocontrol.appendChild(oinput);
					osection.appendChild(ocontrol);
				}
				oform.appendChild(osection);
			}				
			otarget.appendChild(oform)
		}
	}

	/*
	 * start Flink + configure sample/demo modules.
	 */
	function addFlink()
	{
		var script = document.createElement("script");
		//script.src = "../../flink/beta/dist/Flink.js";
		script.src = "../beta/dist/Flink.js";
		script.addEventListener("load", function(event){


			/*
			 * start FLink
			 */

			// vars
			var paths, resources=[]
				, preferences=Flink.Preferences.read()
				, modules=["Summary", "Links", "Forms"];			

			// helper
			function computePaths(moduleKEY) {
				return {
					module: Flink.settings.path.modules
						+ "/module." + moduleKEY + ".js"
					, locale: Flink.settings.path.locale 	
						+ "/locale." + moduleKEY 
						+ "." + preferences.lang + ".js"
				};
			}			

			// compose resources list
			for (var i=0; i<modules.length; i++) {
				paths = computePaths(modules[i]);
				resources.push({type: "module", key: modules[i], path: paths.module });
				resources.push({type: "locale", key: modules[i], path: paths.locale });
			}

			// go
			Flink.start({
				start: 'Summary'
			});
			Flink.load(resources);

		});
		document.body.appendChild(script);
	}

	/*
	 * start
	 */
	start();

})();