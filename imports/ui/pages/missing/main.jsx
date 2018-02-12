import React, {Component} from 'react';
import {Button, Grid, Row, Col, ButtonToolbar} from 'react-bootstrap';

export default class Missing extends Component{
  render(){
    return(
        <div className="default-container" style={{width: "100vw", height:"100vh", background: "#1cb1ff"}}>

          <div style={{position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%) "}}>
            <img style={{
              margin: "auto",
              display: "block",
              verticalAlign: "middle",
              height: "10rem",
            }}src="/assets/vread.svg" className="animatedImage"/>
            <h1 style={{textAlign: "center", color: "white"}}>The page you're looking for does not exist :(</h1>
          </div>

        </div>
    )
  }
}