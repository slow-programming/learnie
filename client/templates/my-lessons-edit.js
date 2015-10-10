var firstRender = true;
var listRenderHold = LaunchScreen.hold();
listFadeInHold = null;

Template.myLessonsEdit.onRendered(function () {
    if (firstRender) {
        // Released in app-body.js
        listFadeInHold = LaunchScreen.hold();

        // Handle for launch screen defined in app-body.js
        listRenderHold.release();

        firstRender = false;
    }
});

Template.myLessonsEdit.helpers({
    lessonsReady: function () {
        return Router.current().lessonsHandle.ready();
    },
    categoriesReady: function () {
        return Router.current().categoriesHandle.ready();
    },
    categories: function () {
        return Categories.find({}, {sort: {name: -1}});
    },
    selectedCategory: function (val) {
        return val == this._id;
    }
});

Template.myLessonsEdit.events({
    'click .js-save-lesson': function (event) {
        event.preventDefault();

        var $name = $('[name=name]').val();
        var $desc = $('[name=desc]').val();
        var $tags = $('[name=tags]').val();
        var $categoryId = $('[name=categoryId]').val();

        if (!$name || !$desc || !$tags || !$categoryId)
            return;

        if (!this._id || this._id == 'NEW') {
            var lesson = {
                name: $name,
                desc: $desc,
                tags: $tags.split(","),
                userId: Meteor.userId(),
                categoryId: $categoryId,
                likes: 0,
                username: Meteor.user().username,
                createdAt: new Date()
            };
            lesson._id = Lessons.insert(lesson);
        } else {
            Lessons.update(this._id, {$set: {
                name: $name,
                desc: $desc,
                tags: $tags.split(","),
                categoryId: $categoryId
            }});
        }

        Router.go('myLessons');
    }
});
