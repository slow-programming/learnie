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

Template.myLessons.helpers({
    lessonsReady: function () {
        return Router.current().lessonsHandle.ready();
    },
    lessons: function () {
        return Lessons.find({userId: Meteor.userId()}, {sort: {createdAt: -1}});
    }
});

Template.myLessons.events({
    'click .js-lesson-add': function (event, template) {
        template.$('.js-lesson-new input').focus();
    },

    'submit .js-lesson-new': function (event) {
        event.preventDefault();

        var $input = $(event.target).find('[type=text]');
        if (!$input.val())
            return;

        var lesson = {
            name: $input.val(),
            userId: Meteor.userId(),
            createdAt: new Date()
        };
        lesson._id = Lessons.insert(lesson);

        $input.val('');
    }
});
