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
import {Button, Grid, Row, Col, Modal} from 'react-bootstrap';
import '../../components/viewRestrict';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { withRouter } from 'react-router-dom'

import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import * as Actions from "../../../actions/main";

class Viewer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vr: false ,
            showModal: false,
            start: false,
            score: 0,
            sprites: []};
    }

    componentDidMount(){
        Extras.loaders.registerAll();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderObject(objectData){

        if(!objectData) return "";

        return <Entity {...objectData}/>

    }

    renderSprites(spriteData){

        let self = this;

        if(!spriteData && !Array.isArray(spriteData)) return "";

        return spriteData.map(function(elem){

            if(self.state.start){
                elem.events={click: self.shootSprite.bind(self, elem.key)};
                elem.className = "entity";
                elem.animation__scale = {property: 'scale', dir: 'alternate', dur: 300, loop: true, to: '1.1 1.1 1.1'};
            }

            return <Entity {...elem} />
        });
    }

    renderEnvironment(environment){

        return <Entity environment={{preset: (environment || "default"), shadow: true, fog: "0"}}/>
    }

    renderParticles(particles){

        if(!particles) return "";

        return particles != "none" ?
            <Entity position="0 10 0"
                    particle-system={{
                        preset: particles.type,
                        particleCount: particles.amount,
                        color: particles.color
                    }} /> : "";
    }

    renderUserBackground(userBackground){

        if(!userBackground) return "";

        return <a-curvedimage src={userBackground}
                              radius="20"
                              material="transparent: true"
                              theta-length="180" height="10" rotation="0 90 0"
                              scale="1.0 1.0 1.0" position="0 5 0" geometry="thetaLength:180"/>;
    }

    share(){
        var self = this;

        Meteor.call('generateLink', this.props.environment,
            this.props.particles, this.props.userBackground,
            this.props.object, this.props.sprites, function(err, result){
            if(!err){
                self.setState({link: result, showModal: true});
            }
        })
    }

    shootSprite(key){
        let sprites = this.state.sprites.slice(),
            shotSprite = sprites.findIndex(function(elem){
                return elem.key == key
            });
        sprites.splice(shotSprite, 1);
        let newScore = this.state.score + 1;
        this.setState({sprites: sprites, score: newScore});
    }

    setCoordinates(levels){
        let x, y, z;

        x = Math.floor(Math.random() * 16) - 8;
        y = Math.floor(Math.random() * 7) + 2;
        z = - Math.floor(Math.random() * 15) - 4;

        return x + " " + y + " " + z;
    }

    createSprites(spriteData){
        if(this.state.sprites.length == 4) {
            console.log("Overflow");
        }
        else{

            let sprites = [];

            for(let i = 1; i <= 3; i++){

                let iter = {
                    sprite: {src: spriteData, resize: ".75 .75 .75" },
                    position: this.setCoordinates(),
                    key: Math.random()
                };
                sprites.push(iter);
            }

            this.setState({sprites: sprites});
        }

    }

    endGame(){
        this.setState({start: false, sprites: []});
        clearInterval(this.interval);
    }

    startGame(){
        this.setState({start: true});
        this.interval = setInterval(()=>this.createSprites(this.props.sprites[0].sprite.src), 3000);
    }

    edit(){
        this.props.history.push("/editor");
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

    render () {

        let Environment =  this.renderEnvironment(this.props.environment),
            Particles = this.renderParticles(this.props.particles),
            Image = this.renderUserBackground(this.props.userBackground),
            Object = this.renderObject(this.props.object),
            Sprites = this.renderSprites(!this.state.start ? this.props.sprites : this.state.sprites),
            param = window.location.href + "/",
            link = param.replace("preview", this.state.link);

        const modalInstance = (
            <Modal show={this.state.showModal} onHide={()=>this.setState({ showModal: false })}>
                <Modal.Body style={{textAlign: "center"}}>
                    <h4>Your own link for your scene</h4>
                    <p>{link}</p>
                    <hr />
                    <CopyToClipboard text={link}
                                     onCopy={() => this.setState({copied: true})}>
                        <Button >{"Copy Your Link!"}</Button>
                    </CopyToClipboard>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>this.setState({ showModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );

        return (

            <div className="default-container">
                <Grid className="menu-container" id="menu-top" style={{display: this.state.vr ? "none" : "block"}}>
                    <Row className="show-grid" style={{height: "50px"}}>
                        <Col xs={4}>
                            <Button className="emptyButton"
                                    style={{float: "left", height: "50px"}}
                                    onClick={()=>this.edit()}>
                                <img style={{
                                    verticalAlign: "middle",
                                    height: "2rem",
                                }}src="/assets/icons/arrow-left.svg"/>
                            </Button>
                        </Col>
                        <Col xs={4} style={{textAlign: "center"}}>
                        </Col>
                        <Col xs={4} style={{textAlign: "center"}}>
                        </Col>
                    </Row>
                </Grid>

                <Scene vr-mode-ui="enabled: false"
                       fog="type: linear; color: #AAA; far: 0;">

                    <a-assets>
                        <a-asset-item id="3d-bear" src="/assets/t1/scene.gltf" />
                        <a-asset-item id="3d-griffin" src="/assets/t2/scene.gltf" />
                        <a-asset-item id="3d-fox" src="/assets/t3/scene.gltf" />
                    </a-assets>

                    {Environment} {Particles} {Object} {Sprites} {Image}

                    <Entity camera="fov: 50; userHeight: 1.6"
                            restricted-look-controls="maxPitch: 65; maxYaw: 65"
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

                    {Array.isArray(this.props.sprites) ?
                        <Entity geometry="primitive: plane; width: 1.5; height: .5;"
                                className="entity"
                                events={{click: this.state.start ? this.endGame.bind(this) : this.startGame.bind(this)}}
                                material="color: blue"
                                rotation="-60 0 0"
                                text={"value: " + (this.state.start ? "End Game" : "Start Game") + "; align: center;"}
                                position="0 .386 -1.5"/>
                        : ""}

                </Scene>

                {!this.state.shared ? <Grid className="menu-container" id="menu-bottom" style={{display: this.state.vr ? "none" : "block"}}>
                    <Row className="show-grid" style={{height: "50px"}}>
                        <Col xs={4} style={{textAlign: "center"}}>
                        </Col>
                        <Col xs={4} style={{textAlign: "center"}}>
                            <Button className="emptyButton"
                                    style={{height: "50px"}}
                                    onClick={()=>this.enterVR()}>
                                <img style={{
                                    verticalAlign: "middle",
                                    height: "2rem",
                                }}src="/assets/icons/vr.svg"/>
                            </Button>
                        </Col>
                        <Col xs={4} style={{textAlign: "center"}}>
                            <Button className="emptyButton"
                                    style={{height: "50px"}}
                                    onClick={()=>this.share()}>
                                <img style={{
                                    verticalAlign: "middle",
                                    height: "2rem",
                                }}src="/assets/icons/sharing.svg"/>
                            </Button>
                        </Col>
                    </Row>
                </Grid> : ""}
                {this.state.showModal ? modalInstance : ""}
            </div>

        );
    }
}

class Wait extends React.Component{

    render(){
        return(
            <div className="default-container" style={{width: "100vw", height:"100vh", background: "#1cb1ff"}}>

                <div style={{position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%) "}}>
                    <img style={{
                        margin: "auto",
                        display: "block",
                        verticalAlign: "middle",
                        height: "10rem",
                    }}src="/assets/vread.svg"/>
                    <h1 style={{textAlign: "center", color: "white"}}>Setting Up Your Scene...</h1>
                </div>

            </div>
        )
    }
}

let ConnectedViewer = withRouter(Viewer);

export default class Container extends React.Component{

    constructor(props){
        super(props);

        this.state = {error: "", shared: false, ready: false};
    }

    componentDidMount(){

        let self = this;

        if(this.props.match.params.url != "preview"){
            Meteor.call('getLinkData', this.props.match.params.url, function(err, result){
                if(!err){
                    console.log("GOT DATA!:", result);
                    if(result == "Not Found") self.setState({error: "Not Found"});
                    else self.setState({
                        environment: result.environment,
                        particles: result.particles,
                        userBackground: result.userBackground,
                        object: result.object,
                        sprite: result.sprite,
                        shared: true,
                        ready: true
                    })
                }
            })
        }
        else {
            if(this.props.location.state){
                self.setState({
                    environment: this.props.location.state.environment,
                    userBackground: this.props.location.state.userBackground,
                    particles: this.props.location.state.particles,
                    object: this.props.location.state.object,
                    sprite: this.props.location.state.sprite,
                    ready: true,
                    shared: false
                });
            }
            else{
                self.setState({
                    environment: null,
                    userBackground: null,
                    particles: null,
                    object: null,
                    sprite: null,
                    ready: true,
                    shared: false
                });
            }
        }
    }

    render(){

        let environment = this.state.environment,
            particles = this.state.particles,
            userBackground = this.state.userBackground,
            object = this.state.object,
            sprites = this.state.sprite,
            ready = this.state.ready,
            Content;

        if(ready){
            Content = <ConnectedViewer environment = {environment}
                                       particles = {particles}
                                       userBackground = {userBackground}
                                       object = {object}
                                       sprites = {sprites}
                                       shared={this.state.shared}/>
        }
        else if(this.state.error){
            Content = <div>{this.state.error}</div>
        }
        else {
            Content = <Wait/>
        }

        return Content
    }
}
