Meteor.publish('publicLists', function () {
    return Lists.find({userId: {$exists: false}});
});

Meteor.publish('privateLists', function () {
    if (this.userId) {
        return Lists.find({userId: this.userId});
    } else {
        this.ready();
    }
});

Meteor.publish('todos', function (listId) {
    check(listId, String);

    return Todos.find({listId: listId});
});

Meteor.publish('myLessons', function (lessonId) {
    if (lessonId) {
        return Lessons.find({_id: lessonId});
    } else {
        return Lessons.find({userId: this.userId}, {sort: {createdAt: -1}});
    }
});

Meteor.publish('lessons', function () {
    return Lessons.find();
Meteor.publish('lessons', function(categoryId) {
  var find = categoryId? {categoryId: categoryId} : '';
  return Lessons.find(find);
});

Meteor.publish('categories', function () {
    return Categories.find();
});
