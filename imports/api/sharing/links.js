/**
 * Created by JohnBae on 10/24/17.
 */

import { Mongo } from 'meteor/mongo';
import GenerateLink from './generate';

export const Links = new Mongo.Collection('links');

Meteor.methods({

    generateLink(environment, particles, userBackground, object, sprite){
        var url = GenerateLink();

        while(Links.findOne({url: url})){
            url =  GenerateLink();
        }

        Links.insert({
            environment,
            particles,
            userBackground,
            object,
            sprite,
            url,
            createdAt: new Date()
        });

        console.log("NEW LINK:", url);

        return url;
    }

});

Meteor.methods({

    getLinkData(url){
        console.log(url);

        var item = Links.findOne({url: url});

        if(item){
            console.log("FOUND");
            return {
                environment: item.environment,
                particles: item.particles,
                userBackground: item.userBackground,
                object: item.object,
                sprite: item.sprite,
            };
        }
        else{
            return "Not Found";
        }
    }

});

Meteor.methods({

    deleteLink(address){
        var id = Links.find({url: address});
        Links.remove(id);
    }

});