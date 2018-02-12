/**
 * Created by JohnBae on 10/9/17.
 */

import React from 'react';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import {Button, ButtonToolbar} from 'react-bootstrap';

import * as Actions from "../../../../actions/main";
import featherize from '../../../../tools/imageEffect';

//Environemnt presets
/*let environments = [
  {label: "Sandbox", type: 'prebuilt', environment: {seed: 1, skyType: 'atmosphere', skyColor: '#88c', horizonColor: '#ddd', lighting: 'distant', lightPosition: { x: -0.11, y: 1, z: 0.33}, fog: 0, flatShading: false, playArea: 1, ground: 'hills', groundYScale: 3, groundTexture: 'checkerboard', groundColor: '#454545', groundColor2: '#5d5d5d', dressing: 'none', dressingAmount: 10, dressingColor: '#795449', dressingScale: 1, dressingVariance: { x: 0, y: 0, z: 0}, dressingUniformScale: true, dressingOnPlayArea: 0, grid: 'none', gridColor: '#ccc', shadow: false}, particles: "none"},
  {label: "Forest", type: 'prebuilt', environment: {seed: 8, skyType: 'gradient', skyColor: '#24b59f', horizonColor: '#eff9b7', lighting: 'distant', lightPosition: { x: -1.2, y: 0.88, z: -0.55}, fog: 0, flatShading: false, playArea: 1, ground: 'noise', groundYScale: 4.18, groundTexture: 'squares', groundColor: '#937a24', groundColor2: '#987d2e', dressing: 'trees', dressingAmount: 250, dressingColor: '#888b1d', dressingScale: 1, dressingVariance: { x: 10, y: 10, z: 10}, dressingUniformScale: true, dressingOnPlayArea: 0, grid: 'none', gridColor: '#c5a543', shadow: false}, particles: "none"},
  {label: "Desert", type: 'prebuilt', environment: {seed: 11, skyType: 'gradient', skyColor: '#239849', horizonColor: '#cfe0af', lighting: 'distant', lightPosition: { x: 0.5, y: 1, z: 0}, fog: 0, flatShading: true, playArea: 1, ground: 'canyon', groundYScale: 9.76, groundTexture: 'walkernoise', groundColor: '#C66344', groundColor2: '#c96b4b', dressing: 'stones', dressingAmount: 250, dressingColor: '#C66344', dressingScale: 0.06, dressingVariance: { x: 0.2, y: 0.1, z: 0.2}, dressingUniformScale: true, dressingOnPlayArea: 1, grid: 'none', gridColor: '#239893', shadow: false}, particles: {type: "snow", color: "white", amount: 1500}},
  {label: "Dystopia", type: 'prebuilt', environment: {seed: 14, skyType: 'gradient', skyColor: '#091b39', horizonColor: '#284a9e', lighting: 'distant', lightPosition: { x: -0.72, y: 0.62, z: 0.4}, fog: 0, flatShading: false, playArea: 1, ground: 'spikes', groundYScale: 4.91, groundTexture: 'none', groundColor: '#061123', groundColor2: '#694439', dressing: 'towers', dressingAmount: 7, dressingColor: '#fb000e', dressingScale: 15, dressingVariance: { x: 20, y: 20, z: 20}, dressingUniformScale: true, dressingOnPlayArea: 0, grid: '1x1', gridColor: '#fb000e', shadow: false}, particles: {type: "dust", color: "yellow", amount: 1500}},
  {label: "Custom", type: 'custom', environment: {"obj-model": "obj: #bg-obj; mtl: #bg-mtl", scale: "7 7 7", position: "0 0 25"}, particles: "none"}
];*/

let environments = [
    {label: "Custom", type: 'custom', environment: {"obj-model": "obj: #bg-obj; mtl: #bg-mtl", scale: "7 7 7", position: "0 0 25", material: "shader: flat;"}, particles: "none"}
];

let particles = [
  {type: "rain", label: "rain"},
  {type: "snow", label: "snow"},
  {type: "dust", label: "dust"},
  {type: "default", label: "stars"},
  {type: "none", label: "none"}];

class Scenes extends React.Component{

  constructor(props){
    super(props);
  }

  editScene(scene){
    this.props.actions.setStageScene({data: scene.environment, type: scene.type});
    this.props.actions.setStageParticles(scene.particles);
  }

  uploadUserImage(event){

    let self = this,
        input = event.target;
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        featherize(e.target.result, function(feathered){

          let data;
          if(self.props.customList){
            data = self.props.customList.slice();
            data.push(feathered);
          }
          else data = [feathered];
          
          self.props.actions.addUserStage(data);
          self.props.actions.setUserStage(feathered);
        });
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  render(){

    let self = this;

    let Environments = environments.map(function(elem){

      return (
          <Button key = {elem.label}
                  className="menu-item"
                  onClick={()=>self.editScene(elem)}>
            {elem.label}
          </Button>
      )
    });

    let i = 1;
    let User = this.props.customList.map(function(elem, iter){

      return <Button key = {i}
                     onClick={()=>self.props.actions.setUserStage(elem)}
                     className="menu-item">{i++}</Button>
    });

    return(
        <div>
          <div className="menu-row" style={{display: "inline-block"}}>
            <Button className="menu-item-square emptyButton">
              <img style={{
                verticalAlign: "middle",
                height: "2rem",
              }}src="/assets/icons/scene.svg"/>
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
              {Environments}
              {this.props.customList.size > 0 ?
                  <Button className="menu-item"
                          onClick={()=>this.props.actions.setUserStage(null)}>
                    Clear User Image
                  </Button> : ""}
              {User}
            </ButtonToolbar>
          </div>
          <input style={{height: "0px", width: "0px"}} type="file" id="input" accept=".png, .jpg" onChange = {(event)=> this.uploadUserImage(event)} ref="uploader"/>
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
      stage: nextState.stage.scene,
      customList: nextState.stage.customList
    };

    if(nextResult!=result){
      result = nextResult;
    }
    return result
  }
}

export default connectAdvanced(selector)(Scenes);
