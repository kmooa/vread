/**
 * Created by JohnBae on 10/9/17.
 */

import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import { Meteor } from 'meteor/meteor';
import * as Actions from "../../../../actions/main";
import {Button, ButtonToolbar, Label} from 'react-bootstrap';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class Share extends React.Component{

    constructor(props){
        super(props);
        this.state = {error: "", link: "", copied: false}
    }

    loginWithFacebook(){
        var self = this;
        Meteor.loginWithFacebook({ requestPermissions: ['email', 'public_profile']}, function(err){
            if (err) {
                self.setState({error: "EMAIL ALREADY TAKEN"});
                throw new Meteor.Error("Facebook login failed");
            }
            else if(self.state.error == "EMAIL ALREADY TAKEN"){
                self.setState({error: ""});
            }
        })

    }

    generateLink(){
        var self = this;
        Meteor.call('generateLink', this.props.scene.toJSON(), this.props.objects.toJSON(), function(err, result){
            if(!err){
                self.setState({link: result});
            }
        })
    }

    render(){

        var Content = "",
            param = window.location.href + "viewer/",
            link = param + this.state.link,
            self = this;

        /*if(this.props.currentUser){
            Content = <Button>Hi {this.props.currentUser}</Button>
        }
        else {
            Content = <Button onClick={()=>this.loginWithFacebook()}> Login </Button>
        }*/

        Content = <ButtonToolbar>
            <Button onClick={()=>this.generateLink()}> Generate Link </Button>
            {this.state.link ? <CopyToClipboard text={link}
                             onCopy={() => this.setState({copied: true})}>
                <Button >{"Copy Link: " + link}</Button>
            </CopyToClipboard> : ""}
        </ButtonToolbar>

        return(
            <div>
                {this.state.error}
                {Content}
            </div>
        )
    }
}

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {

        const nextResult = {
            actions: actions,
            scene: nextState.scene.delete("menu"),
            objects: nextState.objects.delete("menu"),
            ...nextOwnProps
        };
        if(nextResult!=result){
            result = nextResult;
        }
        return result
    }
}

var ConnectedShare = connectAdvanced(selector)(Share);

export default withTracker(() => {
    Meteor.subscribe('userData');
    Meteor.subscribe('Links');
    return {
        currentUser: Meteor.user(),
    };
}, ConnectedShare);
