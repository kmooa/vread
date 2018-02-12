/**
 * Created by JohnBae on 10/24/17.
 */

import { Mongo } from 'meteor/mongo';
import GenerateLink from './generate';

export const Links = new Mongo.Collection('links');

Meteor.methods({

  generateLink(environment, particles, userBackground, object, game){
    let url = GenerateLink();

    while(Links.findOne({url: url})){
      url =  GenerateLink();
    }

    Links.insert({
      environment,
      particles,
      userBackground,
      object,
      game,
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

    let item = Links.findOne({url: url});

    if(item){
      console.log("FOUND");
      return {
        environment: item.environment,
        particles: item.particles,
        userBackground: item.userBackground,
        object: item.object,
        game: item.game,
      };
    }
    else{
      return "Not Found";
    }
  }

});

Meteor.methods({

  deleteLink(address){
    let id = Links.find({url: address});
    Links.remove(id);
  }

});