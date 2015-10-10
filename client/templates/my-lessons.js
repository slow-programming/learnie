// Track if this is the first time the list template is rendered
var firstRender = true;
var listRenderHold = LaunchScreen.hold();
listFadeInHold = null;

Template.myLessons.onRendered(function () {
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

Template.myLessons.created = function() {
    this.lessons = new ReactiveVar("myLessons");
    this.lessons.set(Lessons.find({userId: Meteor.userId()}, {sort: {createdAt: -1}}));
};

Template.myLessons.helpers({
    lessonsReady: function () {
        return Router.current().lessonsHandle.ready();
    },
    lessons: function () {
        return Template.instance().lessons.get();
    }
});

Template.myLessons.events({
    'click .js-add-lesson': function(event, template) {
        Router.go("myLessonsEdit", {_id: "NEW"});
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
        Template.instance().lessons.set(Lessons.find({userId: Meteor.userId(), $or: [, {name: {$regex:regex}}, {tags: {$regex:regex}}]}, {sort: {createdAt: -1}}));
    } else {
        Template.instance().lessons.set(Lessons.find({userId: Meteor.userId()}, {sort: {createdAt: -1}}));
    }
};
