var EDITING_KEY = 'editingList';
Session.setDefault(EDITING_KEY, false);

// Track if this is the first time the list template is rendered
var firstRender = true;
var listRenderHold = LaunchScreen.hold();
listFadeInHold = null;

Template.listsShow.onRendered(function() {
  if (firstRender) {
    // Released in app-body.js
    listFadeInHold = LaunchScreen.hold();

    // Handle for launch screen defined in app-body.js
    listRenderHold.release();

    firstRender = false;
  }

  this.find('.js-title-nav')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        this.remove();
      });
    }
  };
});

Template.uploadAvatar.helpers({

  onUploadFinished: function() {
    return {
      finished: function(index, fileInfo, context) {
        console.log(fileInfo);
        console.log(Meteor.user());
        Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.avatar": '/upload/' + fileInfo.path}});
      }
    }
  }
});


Template.uploadAvatar.events({
});
