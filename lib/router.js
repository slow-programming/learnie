Router.configure({
    // we use the  appBody template to define the layout for the entire app
    layoutTemplate: 'appBody',

    // the appNotFound template is used for unknown routes and missing lists
    notFoundTemplate: 'appNotFound',

    // show the appLoading template whilst the subscriptions below load their data
    loadingTemplate: 'appLoading',

    // wait on the following subscriptions before rendering the page to ensure
    // the data it's expecting is present
    waitOn: function () {
        return [
            Meteor.subscribe('publicLists'),
            Meteor.subscribe('privateLists')
        ];
    }
});

dataReadyHold = null;

if (Meteor.isClient) {
    // Keep showing the launch screen on mobile devices until we have loaded
    // the app's data
    dataReadyHold = LaunchScreen.hold();

    // Show the loading screen on desktop
    Router.onBeforeAction('loading', {except: ['join', 'signin']});
    Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}

Router.route('join');
Router.route('signin');

Router.route('listsShow', {
    path: '/lists/:_id',
    // subscribe to todos before the page is rendered but don't wait on the
    // subscription, we'll just render the items as they arrive
    onBeforeAction: function () {
        this.todosHandle = Meteor.subscribe('todos', this.params._id);

        if (this.ready()) {
            // Handle for launch screen defined in app-body.js
            dataReadyHold.release();
        }
    },
    data: function () {
        return Lists.findOne(this.params._id);
    },
    action: function () {
        this.render();
    }
});

MainMenus = [
    {
        id: "recommendedList",
        name: "Recommended"
    },
    {
        id: "categoriesList",
        name: "Categories",
    },
    {
        id: "myLessons",
        name: "My Lessons"
    }
];

Router.route('recommendedList', {
  path: '/recommended/:_id?',
  // subscribe to todos before the page is rendered but don't wait on the
  // subscription, we'll just render the items as they arrive
  onBeforeAction: function () {
    this.recommendedHandle = Meteor.subscribe('lessons', this.params._id);

    if( this.ready()) {
      dataReadyHold.release();
    }
  },
  data: function () {
    //return Lists.findOne(this.params._id);
    return MainMenus[0];
  },
  action: function () {
    this.render();
  }
});

Router.route('categoriesList', {
    path: '/categories',
    // subscribe to todos before the page is rendered but don't wait on the
    // subscription, we'll just render the items as they arrive
    onBeforeAction: function () {
        this.categoriesHandle = Meteor.subscribe('categories');

        if (this.ready()) {
            dataReadyHold.release();
        }
    },
    data: function () {
        //return Lists.findOne(this.params._id);
        return MainMenus[1];
    },
    action: function () {
        this.render();
    }
});

Router.route('myLessons', {
    path: '/myLessons',
    onBeforeAction: function () {
        this.lessonsHandle = Meteor.subscribe('myLessons');

        if (this.ready()) {
            // Handle for launch screen defined in app-body.js
            dataReadyHold.release();
        }
    },
    data: function () {
        //return Lists.findOne(this.params._id);
        return MainMenus[2];
    },
    action: function () {
        this.render();
    }
});


Router.route('myLessonsEdit', {
    path: '/myLessons/:_id',
    onBeforeAction: function () {
        this.lessonsHandle = Meteor.subscribe('myLessons', this.params._id);
        this.categoriesHandle = Meteor.subscribe('categories');

        if (this.ready()) {
            // Handle for launch screen defined in app-body.js
            dataReadyHold.release();
        }
    },
    data: function () {
        if (this.params._id == 'NEW') {
            return {};
        } else {
            return Lessons.findOne(this.params._id);
        }
    },
    action: function () {
        this.render();
    }
});

Router.route('home', {
    path: '/',
    action: function () {
        Router.go('recommendedList');
    }
});
