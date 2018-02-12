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
import '../../../vrEngine/components/viewRestrict';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Engine from '/imports/vrEngine/main';
import ErrorPage from '/imports/ui/pages/error/main';

import { withRouter } from 'react-router-dom'

class Viewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      vr: false ,
      showModal: false
    };
  }

  componentDidMount(){
    Extras.loaders.registerAll();
  }

  share(){
    let self = this;

    console.log("Requesting link with data:", this.props.environment,
        this.props.particles, this.props.userBackground,
        this.props.object, this.props.game);

    Meteor.call('generateLink', this.props.environment,
      this.props.particles, this.props.userBackground,
      this.props.object, this.props.game, function(err, result){
        if(!err){
          self.setState({link: result, showModal: true});
        }
      })
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

    let param = window.location.href + "/",
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
                <img style={{verticalAlign: "middle", height: "2rem"}} src="/assets/icons/arrow-left.svg"/>
              </Button>
            </Col>
            <Col xs={4} />
            <Col xs={4} />
          </Row>
        </Grid>

        <Engine {...this.props} mode="view"/>

        {!this.state.preview ? <Grid className="menu-container" id="menu-bottom" style={{display: this.state.vr ? "none" : "block"}}>
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

    this.state = {
      error: "",
      preview: false,
      ready: false
    };
  }

  componentDidMount(){

    let self = this;

    if(this.props.match.params.url !== "preview"){
      Meteor.call('getLinkData', this.props.match.params.url, function(err, result){
        if(!err){
          if(result == "Not Found") self.setState({error: "Link not found!"});
          else {
            console.log("FOUND LINK DATA:", {...result})

            self.setState({
              environment: result.environment,
              particles: result.particles,
              userBackground: result.userBackground,
              object: result.object,
              game: result.game,
              ready: true,
              preview: false
            })
          }
        }
      })
    }
    else {
      if(this.props.location.state){

        console.log("FOUND PREVIEW DATA:", {...self.props})

        self.setState({
          environment: this.props.location.state.environment,
          particles: this.props.location.state.particles,
          userBackground: this.props.location.state.userBackground,
          object: this.props.location.state.object,
          game: this.props.location.state.game,
          ready: true,
          preview: true
        });
      }
      else{
        self.setState({error: "Failed to transmit data from editor!"});
      }
    }
  }

  render(){

    let environment = this.state.environment,
      particles = this.state.particles,
      userBackground = this.state.userBackground,
      object = this.state.object,
      game = this.state.game,
      ready = this.state.ready,
      Content;

    let checkData = [];

    if(typeof environment === 'undefined' || environment === null) checkData.push("No Environment Data");
    if(typeof particles === 'undefined' || particles === null) checkData.push("No particles Data");
    if(typeof userBackground === 'undefined' || userBackground === null) checkData.push("No userBackground Data");
    if(typeof object === 'undefined' || object === null) checkData.push("No object Data");
    if(typeof game === 'undefined' || game === null) checkData.push("No game Data");

    if(this.state.error){
      Content = <ErrorPage message={this.state.error} />
    }
    else if(ready){

      console.log("VIEWING:", {...this.state});

      Content = <ConnectedViewer environment = {environment}
                                 particles = {particles}
                                 userBackground = {userBackground}
                                 object = {object}
                                 game = {game}
                                 preview={this.state.preview}/>
    }
    else {
      Content = <Wait/>
    }

    return Content
  }
}
