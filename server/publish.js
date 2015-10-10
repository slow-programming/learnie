Meteor.publish('publicLists', function() {
  return Lists.find({userId: {$exists: false}});
});

Meteor.publish('privateLists', function() {
  if (this.userId) {
    return Lists.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);

  return Todos.find({listId: listId});
});

Meteor.publish('myLessons', function() {
  return Lessons.find({userId: this.userId}, {sort: {createdAt: -1}});
});

Meteor.publish('lessons', function() {
  return Lessons.find();
});

Meteor.publish('cards', function(lessonId) {
  check(lessonId, String);

  return Cards.find({lessonId: lessonId});
});
