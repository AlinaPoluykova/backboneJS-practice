$(function () {

	var AppState = Backbone.Model.extend({
		defaults: {
			username: "",
			state: "start"
		}
	});

	var appState = new AppState();

	var UserNameModel = Backbone.Model.extend({
		defaults: {
			"Name": ""
		}
	});

	var Family = Backbone.Collection.extend({

		model: UserNameModel,

		checkUser: function (username) {
			var findResult = this.find(function (user) { 
				return user.get("Name") == username 
			})
			return findResult != null;
		}

	});

	var MyFamily = new Family([
		{ Name: "Лена" },
		{ Name: "Петр" },
		{ Name: "Саша" },

	]);



	var Controller = Backbone.Router.extend({
		routes: {
			"": "start", 
			"!/": "start", 
			"!/success": "success", 
			"!/error": "error" 
		},

		start: function () {
			appState.set({ state: "start" });
		},

		success: function () {
			appState.set({ state: "success" });
		},

		error: function () {
			appState.set({ state: "error" });
		}
	});

	var controller = new Controller();


	var Block = Backbone.View.extend({
		el: $("#block"), 

		templates: { 
			"start": _.template($('#start').html()),
			"success": _.template($('#success').html()),
			"error": _.template($('#error').html())
		},

		events: {
			"click input:button": "check"
		},

		initialize: function () { 
			this.model.bind('change', this.render, this);
		},

		check: function () {
			var username = this.el.find("input:text").val();
			var find = MyFamily.checkUser(username);
			appState.set({
				"state": find ? "success" : "error",
				"username": username
			});
		},

		render: function () {
			var state = this.model.get("state");
			$(this.el).html(this.templates[state](this.model.toJSON()));
			return this;
		}
	});

	var block = new Block({ model: appState });

	appState.trigger("change"); 

	appState.bind("change:state", function () {
		var state = this.get("state");
		if (state == "start")
			controller.navigate("!/", false); 
		else
			controller.navigate("!/" + state, false);
	});

	Backbone.history.start();   


});














