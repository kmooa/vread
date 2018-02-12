/**
 * Created by JohnBae on 10/9/17.
 */

import React from 'react';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import * as Actions from "../../../../actions/main";
import {Button, ButtonToolbar} from 'react-bootstrap';

let objects = ["griffin", 'bear', 'fox']

class Objects extends React.Component{

    constructor(props){
        super(props);
    }

    getCoordinate(levels){
        let x, y, z;

        x = Math.floor(Math.random() *8) - 4;
        y = Math.floor(Math.random() * 7) + 2;
        z = - Math.floor(Math.random() * 15) - 4;

        switch(levels){
            case 1: y = 0;
                break;
            case 2: y = 3;
                break;
            default: break;
        }

        return 0 + " " + y + " " +  (-5);
    }

    createObject(type){

        let object;

        switch(type){
            case "griffin" :
                object = {
                    "gltf-model": "#3d-griffin",
                    "animation-mixer": "clip: *;",
                    position: this.getCoordinate(1),
                    key: Math.random()
                };
                break;
            case "fox" :
                object = {
                    "gltf-model": "#3d-fox",
                    "scale": ".01 .01 .01",
                    "animation-mixer": "clip: *;",
                    position: this.getCoordinate(1),
                    key: Math.random()
                };
                break;
            case "bear" :
                object = {
                    "gltf-model": "#3d-bear",
                    "animation-mixer": "clip: *;",
                    position: this.getCoordinate(2),
                    key: Math.random()
                };
                break;

        }

        this.props.actions.setObject(object);
    }

    resetObjects(){
        this.props.actions.unsetObject();
    }

    render(){

        let self = this;

        let Objects = objects.map(function(elem){
            return (
                <Button key = {elem}
                        className="menu-item"
                        onClick={()=>self.createObject(elem)}>
                    {elem}
                </Button>
            )
        });

        return(
            <div>
                <div>
                    <div className="menu-row" style={{display: "inline-block"}}>
                        <Button bsStyle="primary" className="menu-item-square emptyButton">
                            <img style={{
                                verticalAlign: "middle",
                                height: "2rem",
                            }}src="/assets/icons/effects.svg"/>
                        </Button>
                    </div>
                    <div className="menu-row" style={{display: "inline-block", overflow: "scroll", width: 'calc(100vw - 65px)', marginLeft: "0"}}>
                        <ButtonToolbar style={{width: "5000px"}}>
                            {Objects}
                            <Button className="menu-item"
                                    onClick={()=>this.resetObjects()}>
                                Reset
                            </Button>
                        </ButtonToolbar>
                    </div>
                </div>
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
            objects: nextState.objects,
        };
        if(nextResult!=result){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(Objects);
