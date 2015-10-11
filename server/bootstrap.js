// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Lists.find().count() === 0) {
    var data = [ /* XXX : We don't use List */ ];

    var timestamp = (new Date()).getTime();
    _.each(data, function(list) {
      var list_id = Lists.insert({name: list.name,
        incompleteCount: list.items.length});

      _.each(list.items, function(text) {
        Todos.insert({listId: list_id,
                      text: text,
                      createdAt: new Date(timestamp)});
        timestamp += 1; // ensure unique timestamp.
      });
    });
  }
  if(Categories.find().count() === 0) {
    var categories = [
      'Computer',
      'Cook',
      'Beatbox',
      'Music',
      'Graphic',
      'Math',
      'Language'
    ];

    _.each(categories, function(category) {
      var list_id = Categories.insert({name: category});
    });
  }
  if (Lessons.find().count() == 0) {
    Lessons.insert({
      name: 'Welcome',
      _id: 'lesson_welcome',
      image: '/upload/welcome_meteor.jpg'
    });
    Cards.insert({
      order: 0,
      lessonId: 'lesson_welcome',
      layers: [
        {
          type: 'text',
          framesBegin: 0,
          freamesEnd: 1,
          data: 'Welcome'
        },
        {
          type: 'image',
          framesBegin: 0,
          framesEnd: 9,
          data: '/upload/welcome_meteor.jpg'
        }
      ]
    });
  }
});
