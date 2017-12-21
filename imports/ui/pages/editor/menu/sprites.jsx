/**
 * Created by JohnBae on 10/9/17.
 */

import React from 'react';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import * as Actions from "../../../../actions/main";
import {Button, ButtonToolbar} from 'react-bootstrap';

import imageTools from '/imports/tools/imageTools';

let sprites = ["vread"]

class Objects extends React.Component{

    constructor(props){
        super(props);
    }

    setCoordinates(levels){
        let x, y, z;

        x = Math.floor(Math.random() * 16) - 8;
        y = Math.floor(Math.random() * 7) + 2;
        z = - Math.floor(Math.random() * 15) - 4;

        return x + " " + y + " " + z;
    }

    createSprites(spriteData){

        let sprites = [];

        for(let i = 1; i <= 20; i++){

            let iter = {
                sprite: {src: spriteData, resize: ".75 .75 .75" },
                position: this.setCoordinates(),
                key: Math.random()
            };
            sprites.push(iter);
        }

        this.props.actions.setSprites(sprites);
    }

    resetSprites(){
        this.props.actions.unsetSprites();
    }

    uploadUserImage(event){

        let self = this,
            input = event.target;

        imageTools.resize(input.files[0], {
            width: 100, // maximum width
            height: 100 // maximum height
        }, function(blob, didItResize) {

            let image = window.URL.createObjectURL(blob);

            self.props.actions.addUserSprite(image);
            self.createSprites(image);
        });
    }

    renderSprites(){

        let self = this;

        return sprites.map(function(elem){
            return (
                <Button key = {elem}
                        className="menu-item"
                        onClick={()=>self.createSprites("/assets/" + elem +".png")}>
                    {elem}
                </Button>
            )
        });
    }

    renderCustomSprites(){

        let self = this;

        return this.props.sprites.map(function(elem, iter){

            return <Button key = {iter}
                           onClick={()=>self.createSprites(elem)}
                           className="menu-item">{iter}</Button>
        });
    }
    
    render(){

        let self = this;

        let Sprites = this.renderSprites();
        let Custom = this.renderCustomSprites();

        return(
            <div>
                <div>
                    <div className="menu-row" style={{display: "inline-block"}}>
                        <Button bsStyle="primary" className="menu-item-square emptyButton">
                            <img style={{
                                verticalAlign: "middle",
                                height: "2rem",
                            }} src="/assets/icons/effects.svg"/>
                        </Button>
                    </div>
                    <div className="menu-row" style={{display: "inline-block", overflow: "scroll", width: 'calc(100vw - 65px)', marginLeft: "0"}}>
                        <ButtonToolbar style={{width: "5000px"}}>
                            <Button className="menu-item-square"
                                    onClick={()=> this.refs.uploader.click()}>
                                <img style={{
                                    verticalAlign: "middle",
                                    height: "2rem",
                                }}src="/assets/icons/add.svg"/>
                            </Button>
                            {Sprites} {Custom}
                            <Button className="menu-item"
                                    onClick={()=>this.resetSprites()}>
                                Reset
                            </Button>
                        </ButtonToolbar>
                    </div>
                </div>
                <input style={{height: "0px", width: "0px"}} type="file" accept=".png, .jpg" onChange = {(event)=> this.uploadUserImage(event)} ref="uploader"/>
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
            sprites: nextState.sprites.get("list"),
        };
        if(nextResult!=result){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(Objects);
