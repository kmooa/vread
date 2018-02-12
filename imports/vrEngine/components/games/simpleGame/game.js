import React from 'react';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/actions/main";
import {Button, ButtonToolbar} from 'react-bootstrap';
import {Entity} from 'aframe-react';
import equal from 'fast-deep-equal';

import imageTools from '/imports/tools/imageTools';

class Game extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      start: false,
      score: 0,
      sprites: []
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setCoordinates(levels){
    let x, y, z;

    x = Math.floor(Math.random() * 16) - 8;
    y = Math.floor(Math.random() * 4) + 5;
    z = - Math.floor(Math.random() * 15) - 4;

    return x + " " + y + " " + z;
  }

  renderSprites(){

    if(!this.props.activeSprite){
      return ""
    }

    let sprites = [],
        self = this;

    for(let i = 1; i <= 20; i++){

      let iter = <Entity position={this.setCoordinates()} key={Math.random()} {...self.props.activeSprite}/>
      sprites.push(iter);
    }

    return sprites;

  }

  animateSprites(position){

    console.log("START:", position)

    position = position.split(" ");

    let posX = parseInt(position[0]),
        posY = parseInt(position[1]),
        posZ = parseInt(position[2]);

    posY = -1;

    if(posY < 0) posY = 0;

    position = posX + " " + posY + " " + posZ;

    console.log("FINISH:", position)

    return position;
  }

  endSprites(id){

    let sprites = this.state.sprites.slice();

    let deadSprite = sprites.findIndex(function(elem){
      console.log(id, elem.props.name);
      return elem.props.name === id;
    });

    console.log(deadSprite);

    if(deadSprite !== -1){
      sprites.splice(deadSprite, 1);
      this.setState({sprites: sprites})
    }
    else console.log("ALREADY SHOT:", id);
  }

  spawnSprites(){

    if(this.state.sprites.length <= 10) {

      let sprites = this.state.sprites.slice(),
          self = this;

      const key = Math.random(),
          pos = this.setCoordinates(),
          toPos = this.animateSprites(pos),
          speed = (Math.random() * 5000) + 2000;

      let iter = <Entity position={this.setCoordinates()}
                         className = "entity"
                         events={{click: self.shootSprite.bind(self, key)}}
                         name={key}
                         key={key} {...self.props.activeSprite}>
        <a-animation attribute="position"
                     dur={speed}
                     fill="none"
                     easing="linear"
                     from={pos} to={toPos}
                     repeat="indefinite" />
      </Entity>

      sprites.push(iter);

      let id = key;

      setTimeout(()=> this.endSprites(id), speed);

      return this.setState({sprites: sprites});
    }
  }

  shootSprite(key){
    let sprites = this.state.sprites.slice(),
        shotSprite = sprites.findIndex(function(elem){
          console.log(elem.key);
          return elem.key == key
        });
    sprites.splice(shotSprite, 1);
    let newScore = this.state.score + 1;
    this.setState({sprites: sprites, score: newScore});
  }

  endGame(){
    this.setState({start: false, sprites: []});
    clearInterval(this.interval);
  }

  startGame(){
    this.setState({start: true});
    this.spawnSprites();
    this.interval = setInterval(()=>this.spawnSprites(), 1500);
  }

  renderUI(){
    if(this.props.mode==="view"){
      return <Entity geometry="primitive: plane; width: 1.5; height: .5;"
                     className="entity"
                     events={{click: this.state.start ? this.endGame.bind(this) : this.startGame.bind(this)}}
                     material="color: blue"
                     rotation="-60 0 0"
                     text={"value: " + (this.state.start ? "End Game" : "Start Game") + "; align: center;"}
                     position="0 .386 -2.5"/>
    }
    else return ""
  }

  createCamera(){
    if(this.props.mode==="view"){

      console.log("Using SimpleGame Camera");

      return <Entity camera="fov: 50; userHeight: 1.6"
                     restricted-look-controls="maxPitch: 32; maxYaw: 75"
                     wasd-controls = "enabled: false">
        <Entity text={"value: " + (this.state.start ? "Score: " + this.state.score : "") + "; align: center;"} position="0 .35 -1"/>
        <Entity cursor="fuse: true; fuse-timeout: 300"
                raycaster="far: 20; interval: 1000; objects: .entity"
                position="0 0 -1"
                geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.025;"
                material="color: white; shader: flat" >
          <a-animation begin="fusing" attribute="scale"
                       fill="backwards" from="1 1 1" to="0.2 0.2 0.2" dur="100" />
        </Entity>
      </Entity>
    }
  }

  render(){

    let self = this,
        Sprites = this.state.start ? this.state.sprites : this.renderSprites(),
        Ui = this.renderUI(),
        Camera = this.createCamera();

    return(
        <Entity>
          {Sprites} {Ui} {Camera}
        </Entity>
    )
  }
}

function selector(dispatch) {
  let result = {};
  const actions = bindActionCreators(Actions, dispatch);
  return (nextState, nextOwnProps) => {

    const nextResult = {
      actions: actions,
      activeSprite: nextOwnProps.activeSprite ? nextOwnProps.activeSprite : nextState.games.game.activeSprite,
      mode: nextOwnProps.mode ? nextOwnProps.mode : nextState.settings.mode
    };

    if(!equal(nextResult, result)){
      result = nextResult;
    }
    return result
  }
}

export default connectAdvanced(selector)(Game)
