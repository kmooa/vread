/**
 * Created by JohnBae on 12/26/16.
 */

import React from 'react';
import {Button, Grid, Row, Col, ButtonToolbar} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {vr: false};
    }

    componentDidMount(){

    }

    render () {

        return (
            <div className="default-container" style={{width: "100vw", height:"100vh", background: "#1cb1ff"}}>

               <div style={{position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%) "}}>
                   <img style={{
                       margin: "auto",
                       display: "block",
                       verticalAlign: "middle",
                       height: "10rem",
                   }}src="/assets/vread.svg" className="animatedImage"/>
                   <h1 style={{textAlign: "center", color: "white"}}>Welcome to Vread!</h1>
                   <ButtonToolbar>
                       <NavLink to="/editor">
                           <Button style={{margin: "auto", display: "block"}}>
                               Start Editor
                           </Button>
                       </NavLink>
                       <Button style={{margin: "auto", display: "block", marginLeft: '.5rem'}} disabled>
                           Browse Content
                       </Button>
                   </ButtonToolbar>
               </div>

            </div>

        );
    }
}
