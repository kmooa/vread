/**
 * Created by JohnBae on 12/26/16.
 */

import 'aframe';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'aframe-environment-component';
import 'aframe-sprite-component';
import Extras from 'aframe-extras';
import {Entity, Scene} from 'aframe-react';

import React from 'react';

import './components/viewRestrict';

import SimpleGame from './components/games/simpleGame/game'

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {vr: false};
  }

  componentDidMount() {
    Extras.loaders.registerAll();
  }

  renderObject(objectData){

    if(objectData===null) return "";

    console.log("RENDERING OBJECT:", objectData);

    return <Entity {...objectData}/>

  }

  renderSprites(spriteData){

    if(spriteData===null) return "";

    return spriteData.map(function(elem){
      return <Entity {...elem} className="entity"/>
    });
  }

  renderEnvironment(environment){
    if(environment.type === "prebuilt") return <Entity environment={ environment.data }/>
    else return <Entity {...environment.data } />
  }

  renderParticles(particles){

    if(particles===null) return "";

    return particles != "none" ?
      <Entity position="0 10 0"
              particle-system={{
                preset: particles.type,
                particleCount: particles.amount,
                color: particles.color
              }} /> : "";
  }

  renderUserBackground(userBackground){

    if(userBackground===null) return "";

    /*return <Entity src={userBackground}
                   primitive="a-curvedimage"
                   material="transparent: true" radius="20" geometry="thetaStart:-45"
                   height="4" rotation="0 90 0" scale="3.5 3.5 3.5" position="0 7 23" />*/

    return <Entity primitive="a-curvedimage" src={userBackground}
                   radius="20"
                   material="transparent: true" height="15" rotation="0 90 0"
                   scale="1.0 1.0 1.0" position="0 7 0" geometry="thetaLength:270; thetaStart:-45;"/>;

  }

  render () {

    let Environment =  this.renderEnvironment(this.props.environment),
      Particles = this.renderParticles(this.props.particles),
      Image = this.renderUserBackground(this.props.userBackground),
      Object = this.renderObject(this.props.object);

    console.log("Running engine as:", this.props.mode, this.props.mode === "edit");

    console.log("Game information:", this.props.game);

    let Camera;

    if(this.props.mode === "edit"){
      console.log("Using Editor Camera: Mode");
      Camera = <EditorCamera />
    }
    else if(!this.props.game || (this.props.game && !this.props.game.settings.customCamera)){
      console.log("Using Editor Camera: Game");
      Camera = <EditorCamera />
    }
    else{
      console.log("Using Custom Camera")
    }

    let Game = this.props.game ? <SimpleGame activeSprite={this.props.game.activeSprite} mode={this.props.mode}/> : "";

    return (
      <Scene vr-mode-ui="enabled: false"
             fog="far: 0;"
             stats={this.props.settings && this.props.settings.stats}>

        <a-assets>
          <a-asset-item id="3d-bear" src="/assets/t1/scene.gltf" />
          <a-asset-item id="3d-griffin" src="/assets/t2/scene.gltf" />
          <a-asset-item id="3d-fox" src="/assets/t3/scene.gltf" />
          <a-asset-item id="bg-obj" src="/assets/bg/BG_01_test.obj" />
          <a-asset-item id="bg-mtl" src="/assets/bg/BG_01_merge_test.mtl" />
        </a-assets>

        <a-sky material="color:#b0fffa" />

        <Entity position="0 50 0" light="color:#aafff3;groundColor:#63de87;intensity:1;type:hemisphere" />

        <Entity light="color:white;angle:20" position="0 7.731 0" />

        {Environment} {Particles} {Object} {Image}

        {Game}

        {Camera}

      </Scene>
    );
  }
}

class EditorCamera extends React.Component{
  render(){
    return(
      <Entity camera="fov: 50; userHeight: 1.6"
              restricted-look-controls="maxPitch: 32; maxYaw: 75"
              wasd-controls = "enabled: false">
      </Entity>
    )
  }
}
