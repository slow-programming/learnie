Template.lessonsItem.helpers({
    isOwn: function() {
        return Meteor.userId() == this.userId;
    }
});

Template.lessonsItem.events({});