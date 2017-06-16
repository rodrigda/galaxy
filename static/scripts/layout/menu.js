define(["layout/generic-nav-view","mvc/webhooks","utils/localization"],function(a,b,c){var d=Backbone.Collection.extend({model:Backbone.Model.extend({defaults:{visible:!0,target:"_parent"}}),fetch:function(d){d=d||{},this.reset();var e=new a.GenericNavView;this.add(e.render()),this.add({id:"analysis",title:c("Analyze Data"),url:"",tooltip:c("Analysis home view")}),this.add({id:"workflow",title:c("Workflow"),tooltip:c("Chain tools into workflows"),disabled:!Galaxy.user.id,url:"workflow",target:"galaxy_main",onclick:function(){window.location=Galaxy.root+"workflow"}}),this.add({id:"shared",title:c("Shared Data"),url:"library/index",tooltip:c("Access published resources"),menu:[{title:c("Data Libraries"),url:"library/list"},{title:c("Histories"),url:"history/list_published"},{title:c("Workflows"),url:"workflows/list_published"},{title:c("Visualizations"),url:"visualizations/list_published"},{title:c("Pages"),url:"pages/list_published"}]}),d.user_requests&&this.add({id:"lab",title:"Lab",menu:[{title:"Sequencing Requests",url:"requests/index"},{title:"Find Samples",url:"requests/find_samples_index"},{title:"Help",url:d.lims_doc_url}]}),this.add({id:"visualization",title:c("Visualization"),url:"visualization/list",tooltip:c("Visualize datasets"),disabled:!Galaxy.user.id,menu:[{title:c("New Track Browser"),url:"visualization/trackster",target:"_frame"},{title:c("Saved Visualizations"),url:"visualization/list",target:"_frame"},{title:c("Interactive Environments"),url:"visualization/gie_list",target:"galaxy_main"}]}),b.add({url:"api/webhooks/masthead/all",callback:function(a){$(document).ready(function(){$.each(a.models,function(a,b){var c=b.toJSON();if(c.activate){var d={id:c.name,icon:c.config.icon,url:c.config.url,tooltip:c.config.tooltip,onclick:c.config.function&&new Function(c.config.function)};Galaxy.page?Galaxy.page.masthead.collection.add(d):Galaxy.masthead&&Galaxy.masthead.collection.add(d)}})})}}),Galaxy.user.get("is_admin")&&this.add({id:"admin",title:c("Admin"),url:"admin",tooltip:c("Administer this Galaxy"),cls:"admin-only"});var f={id:"help",title:c("Help"),tooltip:c("Support, contact, and community"),menu:[{title:c("Support"),url:d.support_url,target:"_blank"},{title:c("Search"),url:d.search_url,target:"_blank"},{title:c("Mailing Lists"),url:d.mailing_lists,target:"_blank"},{title:c("Videos"),url:d.screencasts_url,target:"_blank"},{title:c("Wiki"),url:d.wiki_url,target:"_blank"},{title:c("How to Cite Galaxy"),url:d.citation_url,target:"_blank"},{title:c("Interactive Tours"),url:"tours",onclick:function(){Galaxy.router?Galaxy.router.navigate("tours",{trigger:!0}):window.location=Galaxy.root+"tours"}}]};if(d.terms_url&&f.menu.push({title:c("Terms and Conditions"),url:d.terms_url,target:"_blank"}),d.biostar_url&&f.menu.unshift({title:c("Ask a question"),url:"biostar/biostar_question_redirect",target:"_blank"}),d.biostar_url&&f.menu.unshift({title:c("Galaxy Biostar"),url:d.biostar_url_redirect,target:"_blank"}),this.add(f),Galaxy.user.id){var g={id:"user",title:c("User"),cls:"loggedin-only",tooltip:c("Account and saved data"),menu:[{title:c("Logged in as")+" "+Galaxy.user.get("email")},{title:c("Preferences"),url:"user",target:"galaxy_main",onclick:function(){Galaxy.router?Galaxy.router.push("user"):window.location=Galaxy.root+"user"}},{title:c("Custom Builds"),url:"custom_builds",target:"galaxy_main",onclick:function(){Galaxy.router?Galaxy.router.push("custom_builds"):window.location=Galaxy.root+"custom_builds"}},{title:c("Logout"),url:"user/logout",target:"_top",divider:!0},{title:c("Saved Histories"),url:"history/list",target:"galaxy_main"},{title:c("Saved Datasets"),url:"datasets/list",target:"_top"},{title:c("Saved Pages"),url:"pages/list",target:"_top"}]};this.add(g)}else{var g={id:"user",title:c("Login or Register"),cls:"loggedout-only",tooltip:c("Account registration or login"),menu:[{title:c("Login"),url:"user/login",target:"galaxy_main",noscratchbook:!0}]};d.allow_user_creation&&g.menu.push({title:c("Register"),url:"user/create",target:"galaxy_main",noscratchbook:!0}),this.add(g)}var h=this.get(d.active_view);return h&&h.set("active",!0),(new jQuery.Deferred).resolve().promise()}}),e=Backbone.View.extend({initialize:function(a){this.model=a.model,this.setElement(this._template()),this.$dropdown=this.$(".dropdown"),this.$toggle=this.$(".dropdown-toggle"),this.$menu=this.$(".dropdown-menu"),this.$note=this.$(".dropdown-note"),this.listenTo(this.model,"change",this.render,this)},events:{"click .dropdown-toggle":"_toggleClick"},render:function(){var a=this;return $(".tooltip").remove(),this.$el.attr("id",this.model.id).css({visibility:this.model.get("visible")&&"visible"||"hidden"}),this.model.set("url",this._formatUrl(this.model.get("url"))),this.$note.html(this.model.get("note")||"").removeClass().addClass("dropdown-note").addClass(this.model.get("note_cls")).css({display:this.model.get("show_note")&&"block"||"none"}),this.$toggle.html(this.model.get("title")||"").removeClass().addClass("dropdown-toggle").addClass(this.model.get("cls")).addClass(this.model.get("icon")&&"dropdown-icon fa "+this.model.get("icon")).addClass(this.model.get("toggle")&&"toggle").attr("target",this.model.get("target")).attr("href",this.model.get("url")).attr("title",this.model.get("tooltip")).tooltip("destroy"),this.model.get("tooltip")&&this.$toggle.tooltip({placement:"bottom"}),this.$dropdown.removeClass().addClass("dropdown").addClass(this.model.get("disabled")&&"disabled").addClass(this.model.get("active")&&"active"),this.model.get("menu")&&this.model.get("show_menu")?(this.$menu.show(),$("#dd-helper").show().off().on("click",function(){$("#dd-helper").hide(),a.model.set("show_menu",!1)})):(a.$menu.hide(),$("#dd-helper").hide()),this.$menu.empty().removeClass("dropdown-menu"),this.model.get("menu")&&(_.each(this.model.get("menu"),function(b){a.$menu.append(a._buildMenuItem(b)),b.divider&&a.$menu.append($("<li/>").addClass("divider"))}),a.$menu.addClass("dropdown-menu"),a.$toggle.append($("<b/>").addClass("caret"))),this},_buildMenuItem:function(a){var b=this;return a=_.defaults(a||{},{title:"",url:"",target:"_parent",noscratchbook:!1}),a.url=b._formatUrl(a.url),$("<li/>").append($("<a/>").attr("href",a.url).attr("target",a.target).html(a.title).on("click",function(c){c.preventDefault(),b.model.set("show_menu",!1),a.onclick?a.onclick():Galaxy.frame.add(a)}))},_toggleClick:function(a){function b(a,b){return $("<div/>").append($("<a/>").attr("href",Galaxy.root+b).html(a)).html()}var c=this,d=this.model;a.preventDefault(),$(".tooltip").hide(),d.trigger("dispatch",function(a){d.id!==a.id&&a.get("menu")&&a.set("show_menu",!1)}),d.get("disabled")?(this.$toggle.popover&&this.$toggle.popover("destroy"),this.$toggle.popover({html:!0,placement:"bottom",content:"Please "+b("login","user/login?use_panels=True")+" or "+b("register","user/create?use_panels=True")+" to use this feature."}).popover("show"),setTimeout(function(){c.$toggle.popover("destroy")},5e3)):d.get("menu")?d.set("show_menu",!0):d.get("onclick")?d.get("onclick")():Galaxy.frame.add(d.attributes)},_formatUrl:function(a){return"string"==typeof a&&-1===a.indexOf("//")&&"/"!=a.charAt(0)?Galaxy.root+a:a},_template:function(){return'<ul class="nav navbar-nav"><li class="dropdown"><a class="dropdown-toggle"/><ul class="dropdown-menu"/><div class="dropdown-note"/></li></ul>'}});return{Collection:d,Tab:e}});
//# sourceMappingURL=../../maps/layout/menu.js.map