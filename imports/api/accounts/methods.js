/**
 * Created by JohnBae on 4/29/17.
 */

import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    createAccount(email, username, pwd){
        var created = Accounts.createUser({email: email, password:pwd}) ? true : false;
        var id =  Accounts.findUserByEmail(email)._id;
        Meteor.users.update(id, {
            $set: {
                name: username
            }
        });
        return created;
    }
});

Meteor.methods({
    checkIfValidAccount (email, username, pwd, cPwd) {

        var email = checkEmail(email);
        var username = checkUsername(username);
        var pwd = checkPwd(pwd, cPwd);

        return {
            username: username,
            email: email,
            password: pwd
        };
    }
});

Meteor.methods({
    addEmail(userId, email){
        var exists = Meteor.users.findOne({'emails.address': email});
        if(!exists) return Accounts.addEmail(userId, email);
        else throw new Meteor.Error("Email Addition Error");
    }
});

Meteor.methods({
    setUsername(userId, username){
        Meteor.users.update(userId, {
            $set: {
                name: username
            }
        });
    }
});

Meteor.methods({
    setPassword(userId, password, cPwd, maintain){
        var valid = !(password != cPwd || password < 6);
        if(valid) return Accounts.setPassword(userId, password, {logout: maintain});
        else throw new Meteor.Error("Invalid Password!");
    }
});

Meteor.methods({
    setStore(text){
        var id = Meteor.userId();
        Meteor.users.update(id, {
            $set: {
                store: text
            }
        });
    }
});

Meteor.methods({
    setAboutText(text){
        var id = Meteor.userId();
        Meteor.users.update(id, {
            $set: {
                about: text
            }
        });
    }
});

Meteor.methods({
    setProfileImg(url){
        var id = Meteor.userId();
        Meteor.users.update(id, {
            $set: {
                profileImg: url
            }
        });
    }
});

Meteor.methods({
    sendEmail(to, from, subject, text) {
        console.log("SENDING EMAIL TO:", to, " WITH STUFF LIKE:", text)
        Email.send({ to, from, subject, text });
    }
});

Meteor.methods({
    sendVerificationLink() {
        let userId = Meteor.userId();
        console.log("CHECKING USER:", userId);
        if ( userId ) {
            console.log("SENDING VERIFICATION EMAIL");
            return Accounts.sendVerificataionEmail( userId );
        }
    }
});

function checkPwd(pwd, cPwd){
    return !(pwd != cPwd || pwd < 6);
}

function checkUsername(username){
    return Meteor.users.findOne({username: username}) || username.length == 0 ? false : true;
}

function checkEmail(email){
    return Meteor.users.findOne({'emails.address': email}) || email.length == 0 ? false : true;
}