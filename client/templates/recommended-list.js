var EDITING_KEY = 'editingList';
Session.setDefault(EDITING_KEY, false);

// Track if this is the first time the list template is rendered
var firstRender = true;
var listRenderHold = LaunchScreen.hold();
listFadeInHold = null;
var keyword;

Template.recommendedList.onRendered(function () {
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

Template.recommendedList.created = function() {
    this.articles = new ReactiveVar(null);
    this.articles.set(Lessons.find({}, {sort: {createdAt: -1}}));
};

Template.recommendedList.helpers({
    articleReady: function () {
        return Router.current().recommendedHandle.ready();
    },

    articles: function () {
        return Template.instance().articles.get();
    }
});

Template.recommendedList.events({
    'click .js-search': function(event, template) {
        template.$('.js-search-bar input').focus();
    },

    'keypup .js-search-bar [type=text]': function(event) {
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
        Template.instance().lessons.set(Lessons.find({$or: [, {name: {$regex:regex}}, {tags: {$regex:regex}}]}, {sort: {createdAt: -1}}));
    } else {
        Template.instance().articles.set(Lessons.find({}, {sort: {createdAt: -1}}));
    }
};