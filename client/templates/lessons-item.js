Template.lessonsItem.helpers({
    isOwn: function() {
        return Meteor.userId() == this.userId;
    }
});

Template.lessonsItem.events({
    'click .js-modify-lesson': function(event, template) {
        Router.go("myLessonsEdit", this);
    }
});