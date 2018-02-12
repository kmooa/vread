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

    let statsState = this.props.settings.stats;

    return(
        <div className="menu-row" style={{display: "inline-block"}}>
            <Button bsStyle="primary" className="menu-item-square emptyButton">
                <img style={{
                  verticalAlign: "middle",
                  height: "2rem",
                }}src="/assets/icons/undo.svg"/>demo
            </Button>
            <Button bsStyle="primary" className="menu-item-square emptyButton">
                <img style={{
                  verticalAlign: "middle",
                  height: "2rem",
                }}src="/assets/icons/redo.svg"/>
            </Button>
            <Button bsStyle="primary" className="menu-item-square emptyButton">
                <img style={{
                  verticalAlign: "middle",
                  height: "2rem",
                }}src="/assets/icons/shuffle.svg"/>
            </Button>
            <Button bsStyle="primary" className="menu-item-square emptyButton"
                    onClick = {()=> this.toggleStats(!statsState)}>
                <img style={{
                  verticalAlign: "middle",
                  height: "2rem",
                  color: "white",
                  opacity: statsState ? 1 : .5
                }}src="/assets/icons/toaster.svg"/>
            </Button>
        </div>
    )
  }
}

function selector(dispatch) {

  let result = {};
  const actions = bindActionCreators(Actions, dispatch);

  return (nextState) => {

    const nextResult = {
      actions: actions,
      settings: nextState.settings
    };
    if(nextResult!=result){
      result = nextResult;
    }
    return result
  }
}

export default connectAdvanced(selector)(settings);