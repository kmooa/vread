/**
 * Created by JohnBae on 4/6/17.
 */

import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser(function(options, user) {

    if (user.services) {

        var service = _.keys(user.services)[0];

        if (service == 'facebook') {
            var email = user.services[service].email;
            var existingUser = Meteor.users.findOne({'emails.address': email});
            if(existingUser) {
                throw new Meteor.Error("email-exists","Email is already associated");
            }
            return user;
        }
        else if(service == 'password') {
            var email = user.emails[0].address;
            var existingUser = Meteor.users.findOne({'services.facebook.email': email});
            if(existingUser) {
                throw new Meteor.Error("email-exists","Email is already associated");
            }
            return user;
        }
    }
});