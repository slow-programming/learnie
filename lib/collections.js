Lists = new Mongo.Collection('lists');

// Calculate a default name for a list in the form of 'List A'
Lists.defaultName = function() {
  var nextLetter = 'A', nextName = 'List ' + nextLetter;
  while (Lists.findOne({name: nextName})) {
    // not going to be too smart here, can go past Z
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
    nextName = 'List ' + nextLetter;
  }

  return nextName;
};

Categories = new Mongo.Collection('categories');

Todos = new Mongo.Collection('todos');

Lessons = new Mongo.Collection('lessons');

// Calculate a default name for a lesson in the form of 'List A'
Lessons.defaultName = function() {
  var nextLetter = 'A', nextName = 'Lesson ' + nextLetter;
  while (Lessons.findOne({name: nextName})) {
    // not going to be too smart here, can go past Z
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
    nextName = 'Lesson ' + nextLetter;
  }

  return nextName;
};

Cards = new Mongo.Collection('cards');
