var ERRORS_KEY = 'joinErrors';

Template.join.onCreated(function () {
    Session.set(ERRORS_KEY, {});
});

Template.join.helpers({
    errorMessages: function () {
        return _.values(Session.get(ERRORS_KEY));
    },
    errorClass: function (key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});

Template.join.events({
    'submit': function (event, template) {
        event.preventDefault();

        var errors = {};

        var email = template.$('[name=email]').val();
        var name = template.$('[name=name]').val();
        var password = template.$('[name=password]').val();
        var confirm = template.$('[name=confirm]').val();

        if (!email) {
            errors.email = 'Email required';
        }

        if (!name) {
            errors.name = 'Name required';
        }


        Session.set(ERRORS_KEY, errors);
        if (_.keys(errors).length) {
            return;
        }

        if (Meteor.user()) {

            Meteor.users.update({_id:Meteor.userId()}, {$set:{
                "profile.name": name,
                "profile.email": email
            }});

        } else {

            if (!password) {
                errors.password = 'Password required';
            }
            if (confirm !== password) {
                errors.confirm = 'Please confirm your password';
            }

            Session.set(ERRORS_KEY, errors);
            if (_.keys(errors).length) {
                return;
            }
            Accounts.createUser({
                email: email,
                password: password,
                username: name,
                profile: {
                    name: name,
                    email: email
                }
            }, function (error) {
                if (error) {
                    return Session.set(ERRORS_KEY, {'none': error.reason});
                }

                Router.go('uploadAvatar');
                //Router.go('home');
            });
        }



    }
});
