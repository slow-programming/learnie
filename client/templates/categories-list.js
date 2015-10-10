var EDITING_KEY = 'editingList';
Session.setDefault(EDITING_KEY, false);

// Track if this is the first time the list template is rendered
var firstRender = true;
var listRenderHold = LaunchScreen.hold();
listFadeInHold = null;

Template.categoriesList.onRendered(function () {
    if (firstRender) {
        // Released in app-body.js
        listFadeInHold = LaunchScreen.hold();

        // Handle for launch screen defined in app-body.js
        listRenderHold.release();

        firstRender = false;
    }

    this.find('.js-title-nav')._uihooks = {
        insertElement: function (node, next) {
            $(node)
                .hide()
                .insertBefore(next)
                .fadeIn();
        },
        removeElement: function (node) {
            $(node).fadeOut(function () {
                this.remove();
            });
        }
    };
});

Template.categoriesList.created = function() {
    this.articles = new ReactiveVar("articles");
    this.articles.set(Categories.find({}, {sort: {name: -1}}));
};

Template.categoriesList.helpers({
    articleReady: function () {
        return Router.current().categoriesHandle.ready();
    },

    articles: function () {
        return Template.instance().articles.get();
    }
});

Template.categoriesList.events({
    'click .js-search': function(event, template) {
        template.$('.js-search-bar input').focus();
    },

    'keypress .js-search-bar [type=text]': function(event) {
        //event.preventDefault();

        search();
    },

    'submit .js-search-bar': function(event) {
        event.preventDefault();

        search();
    }
});

var search = function () {
    var keyword = $('.js-search-bar [type=text]').val();
    if (keyword && keyword.trim() != '') {
        var regex = new RegExp(keyword, "i");
        Template.instance().articles.set(Categories.find({name: {$regex:regex}}, {sort: {name: -1}}));
    } else {
        Template.instance().articles.set(Categories.find({}, {sort: {name: -1}}));
    }
};