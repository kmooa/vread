import React from 'react';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/actions/main";
import {Button, ButtonToolbar} from 'react-bootstrap';

import imageTools from '/imports/tools/imageTools';
import game from './game';

let sprites = ["vread"];

class Menu extends React.Component{

  constructor(props){
    super(props);
  }

  initialize(){
    this.props.actions.setGame({
      settings: {customCamera: true},
      engine: 1,
      activeSprite: "",
      customSprites: []
    });
  }

  createSprites(spriteData, pushCustom){

    if(this.props.activeGame){
      console.log("GAME EXISTS");
    }
    else {
      this.initialize();
    }

    let sprites = {
      sprite: {src: spriteData, resize: ".75 .75 .75" }
    };

    this.props.actions.setInGame("activeSprite", sprites);
    if(pushCustom) this.props.actions.setInGame('customSprites', pushCustom);
  }

  resetSprites(){
    this.props.actions.unsetGame();
  }

  uploadUserImage(event){

    let self = this,
        input = event.target;

    imageTools.resize(input.files[0], {
      width: 100, // maximum width
      height: 100 // maximum height
    }, function(blob, didItResize) {

      let image = window.URL.createObjectURL(blob),
          data;

      if(self.props.game.customSprites){
        data = self.props.game.customSprites.slice();
        data.push(image);
      }
      else data = [image];

      self.createSprites(image, data);
    });
  }

  defaultSprites(){

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

  customSprites(){

    let self = this;

    return this.props.game.customSprites.map(function(elem, iter){

      return <Button key = {iter}
                     onClick={()=>self.createSprites(elem)}
                     className="menu-item">{iter}</Button>
    });
  }

  render(){

    let self = this,
        Sprites = this.defaultSprites(),
        CustomList = this.props.game.customSprites ? this.customSprites() : "";

    return(
        <ButtonToolbar>
          <Button className="menu-item-square"
                  onClick={()=> this.refs.uploader.click()}>
            <img style={{
              verticalAlign: "middle",
              height: "2rem",
            }}src="/assets/icons/add.svg"/>
          </Button>

          {Sprites} {CustomList}

          <Button className="menu-item"
                  onClick={()=>this.resetSprites()}>
            Reset
          </Button>

          <input style={{height: "0px", width: "0px"}} type="file" accept=".png, .jpg" onChange = {(event)=> this.uploadUserImage(event)} ref="uploader"/>
        </ButtonToolbar>
    )
  }
}

function selector(dispatch) {
  let result = {};
  const actions = bindActionCreators(Actions, dispatch);
  return (nextState, nextOwnProps) => {

    const nextResult = {
      actions: actions,
      game: nextState.games.game,
      activeGame: !!Object.keys(nextState.games.game).length,
      mode: nextState.settings.mode
    };
    if(nextResult!=result){
      result = nextResult;
    }
    return result
  }
}

export default connectAdvanced(selector)(Menu)