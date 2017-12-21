/**
 * Created by JohnBae on 12/26/16.
 */

import 'aframe';
import Extras from 'aframe-extras';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'aframe-environment-component';
import 'aframe-sprite-component';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import {Button, Grid, Row, Col, ButtonToolbar} from 'react-bootstrap';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import * as Actions from "../../../actions/main";

import { withRouter } from 'react-router-dom'

import '../../components/viewRestrict';
import '../../components/customShader/main'
import Menu from './menu/main'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {vr: false};
    }

    renderObject(objectData){

        if(objectData===null) return "";

        console.log("BLAH");

        return <Entity {...objectData}/>

    }

    renderSprites(spriteData){

        if(spriteData===null) return "";

        return spriteData.map(function(elem){
            return <Entity {...elem}
                           className="entity"/>
        });
        /*if(this.canvas)
        return <a-curvedimage src={this.canvas.toDataURL()}
                              radius="20"
                              material="transparent: true"
                              theta-length="180" height="10" rotation="0 90 0"
                              scale="1.0 1.0 1.0" position="0 5 0" geometry="thetaLength:180"/>;*/
    }

    renderEnvironment(environment){

        return <Entity environment={{preset: (environment || "default"), shadow: true, fog: "0"}}/>
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

        return <a-curvedimage src={userBackground}
                              radius="20"
                              material="transparent: true"
                              theta-length="180" height="10" rotation="0 90 0"
                              scale="1.0 1.0 1.0" position="0 5 0" geometry="thetaLength:180"/>;
    }

    preview(){

        this.props.history.push({
            pathname: '/viewer/preview',
            state: {
                environment: this.props.environment,
                userBackground: this.props.userBackground,
                particles: this.props.particles == "none" ? "none" : this.props.particles.toJSON(),
                object: this.props.object,
                sprite: this.props.sprites
            }
        })
    }

    enterVR(){
        let scene = document.querySelector('a-scene'),
            self = this;
        scene.addEventListener('exit-vr', function(){
            self.setState({vr: false})
        });
        if (scene.hasLoaded) {
            self.setState({vr: true})
            scene.enterVR();
        } else {
            el.addEventListener('loaded', function () {
                self.setState({vr: true})
                scene.enterVR();
            });
        }
    }

    componentDidMount() {
        Extras.loaders.registerAll();
        //this.updateCanvas();
    }

    updateCanvas() {

        let img = new Image(),
            self = this;
        img.src = '/assets/testing.jpg'

        img.onload = function() {

            let height = 600,
                width = 800;

            let ctx = self.canvas.getContext('2d');
            self.canvas.width = 800;
            self.canvas.height = 600;
            ctx.drawImage(img, 0, 0, height, width);

            let image = ctx.getImageData(0, 0, height, width);
            let imageData = image.data,
                length = imageData.length;
            for(let i=3; i < length; i+=4){
                if(i < (height / 4 * width )* 4 ) {
                    imageData[i] = Math.floor(i / height * 4) * 255 / height / 4;
                }
                else imageData[i] = 255;
            }
            // noinspection JSAnnotator
            image.data = imageData;
            ctx.putImageData(image, 0, 0);

        }
    }

    render () {

        let Environment =  this.renderEnvironment(this.props.environment),
            Particles = this.renderParticles(this.props.particles),
            Image = this.renderUserBackground(this.props.userBackground),
            Object = this.renderObject(this.props.object),
            Sprites = this.renderSprites(this.props.sprites);
        
        let i = 1;

        return (
            <div className="default-container">

                <canvas ref={(input) => { this.canvas = input; }} style={{display: "none"}}/>

                <Grid className="menu-container" id="menu-top" style={{display: this.state.vr ? "none" : "block"}}>
                    <Row className="show-grid" style={{height: "50px"}}>
                        <Col xs={4}>
                        </Col>
                        <Col xs={4} style={{textAlign: "center"}}>
                        </Col>
                        <Col xs={4}>
                            <Button className="emptyButton"
                                    style={{float: "right", height: "50px"}}
                                    onClick={()=>this.preview()}>
                                <img style={{
                                    verticalAlign: "middle",
                                    height: "2rem",
                                }}src="/assets/icons/arrow-right.svg"/>
                            </Button>
                        </Col>
                    </Row>
                </Grid>

                <Scene vr-mode-ui="enabled: false"
                       fog="far: 0;"
                       stats={this.props.settings.get("stats")}>

                    <a-assets>
                        <a-asset-item id="3d-bear" src="/assets/t1/scene.gltf" />
                        <a-asset-item id="3d-griffin" src="/assets/t2/scene.gltf" />
                        <a-asset-item id="3d-fox" src="/assets/t3/scene.gltf" />
                    </a-assets>

                    {Environment} {Particles} {Object} {Sprites} {Image}

                    <Entity camera="fov: 50; userHeight: 1.6"
                            restricted-look-controls="maxPitch: 65; maxYaw: 65"
                            wasd-controls = "enabled: false">
                    </Entity>
                </Scene>

                <Menu hide={this.state.vr}/>

            </div>
        );
    }
}

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);

    return (nextState, nextOwnProps) => {

        const nextResult = {
            settings: nextState.settings,
            environment: nextState.stage.get("scene").get("environment"),
            particles: nextState.stage.get("scene").get("particles"),
            userBackground: nextState.stage.get("activeCustom"),
            object: nextState.objects.get("activeObject"),
            sprites: nextState.sprites.get("activeSprites"),
            actions: actions,
            ...nextOwnProps
        };

        if(nextResult!=result){
            result = nextResult;
        }
        return result
    }
}

export default withRouter(connectAdvanced(selector)(App));
