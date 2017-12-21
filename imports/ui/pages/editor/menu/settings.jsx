/**
 * Created by JohnBae on 10/9/17.
 */

import React from 'react';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import {Button, ButtonToolbar} from 'react-bootstrap';

import * as Actions from "../../../../actions/main";

class settings extends React.Component{

    constructor(props){
        super(props);
    }

    toggleStats(state){
        this.props.actions.editSettings("stats", state);
    }

    render(){

        var statsState = this.props.stats;

        return(
            <div>
                <Button onClick = {()=> this.toggleStats(!statsState)}
                        active = {statsState}>
                    Stats: {statsState ? "On" : "Off"}
                </Button>
            </div>
        )
    }
}

function selector(dispatch) {

    var result = {};
    const actions = bindActionCreators(Actions, dispatch);

    return (nextState) => {

        const nextResult = {
            actions: actions,
            stats: nextState.settings.get("stats")
        };
        if(nextResult!=result){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(settings);