/**
 * Created by JohnBae on 4/29/17.
 */

Meteor.publish('userData', function () {

    const selector = {
        _id: this.userId
    };

    const options = {
        fields: { name: 1, profile: 1, profileImg: 1, about: 1, store: 1}
    };

    return Meteor.users.find(selector, options);
});