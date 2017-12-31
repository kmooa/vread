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

    return <Entity {...objectData}/>

  }

  renderSprites(spriteData){

    if(spriteData===null) return "";

    return spriteData.map(function(elem){
      return <Entity {...elem} className="entity"/>
    });
  }

  renderEnvironment(environment){

    console.log(environment.toJSON());
    return <Entity environment={ environment.toJSON() }/>
  }

  renderParticles(particles){

    if(particles===null) return "";

    return particles != "none" ?
      <Entity position="0 10 0"
              particle-system={{
                preset: particles.get("type"),
                particleCount: particles.get("amount"),
                color: particles.get("color")
              }} /> : "";
  }

  renderUserBackground(userBackground){

    if(userBackground===null) return "";

    return <Entity primitive="a-curvedimage" src={userBackground}
                   radius="20"
                   material="transparent: true" height="10" rotation="0 90 0"
                   scale="1.0 1.0 1.0" position="0 5 0" geometry="thetaLength:270; thetaStart:-45;"/>;
  }

  render () {

    let Environment =  this.renderEnvironment(this.props.environment),
      Particles = this.renderParticles(this.props.particles),
      Image = this.renderUserBackground(this.props.userBackground),
      Object = this.renderObject(this.props.object),
      Sprites = this.renderSprites(this.props.sprites);

    let Camera;

    switch(this.props.mode){
      case 'edit':
        Camera = <EditorCamera />
        break;
      case 'view':
        Camera = <ViewCamera />
    }

    return (
      <Scene vr-mode-ui="enabled: false"
             fog="far: 0;"
             stats={this.props.settings && this.props.settings.get("stats")}>

        <a-assets>
          <a-asset-item id="3d-bear" src="/assets/t1/scene.gltf" />
          <a-asset-item id="3d-griffin" src="/assets/t2/scene.gltf" />
          <a-asset-item id="3d-fox" src="/assets/t3/scene.gltf" />
        </a-assets>

        <a-entity light="type: point; color: white; intensity: .60; angle: 20" position="0 5 0" />

        {Environment} {Particles} {Object} {Sprites} {Image}

        {Camera}

      </Scene>
    );
  }
}

class EditorCamera extends React.Component{
  render(){
    return(
      <Entity camera="fov: 50; userHeight: 1.6"
              restricted-look-controls="maxPitch: 35; maxYaw: 75"
              wasd-controls = "enabled: false">
      </Entity>
    )
  }
}

class ViewCamera extends React.Component{
  render(){
    return(
      <Entity>
        <Entity camera="fov: 50; userHeight: 1.6"
                restricted-look-controls="maxPitch: 65; maxYaw: 65"
                wasd-controls = "enabled: false">
          <Entity text={"value: " + (this.props.start ? "Score: " + this.props.score : "") + "; align: center;"} position="0 .35 -1"/>
          <Entity cursor="fuse: true; fuse-timeout: 300"
                  raycaster="far: 20; interval: 1000; objects: .entity"
                  position="0 0 -1"
                  geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.025;"
                  material="color: white; shader: flat" >
            <a-animation begin="fusing" attribute="scale"
                         fill="backwards" from="1 1 1" to="0.2 0.2 0.2" dur="100" />
          </Entity>
        </Entity>
      </Entity>
    )
  }
}
