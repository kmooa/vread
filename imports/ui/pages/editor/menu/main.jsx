/**
 * Created by JohnBae on 10/9/17.
 */

import React from 'react';
import {Button, ButtonToolbar, Grid, Row} from 'react-bootstrap';
import {connectAdvanced} from "react-redux";

import Objects from './objects';
import Games from './games';
import Stage from './stage';
import Controls from './controls';
import Share from './share';


export default class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {menu: "objects"};
    }

    changeMenu(menu) {
        this.setState({menu: menu});
    }

    render() {

        return (
            <Grid className="menu-container" style={{background: "transparent", display: this.props.hide ? "none" : "block"}} id="menu-bottom">
                <Row className="show-grid">
                    <Controls/>
                </Row>
                <Row className="show-grid"  style={{background: "rgba(0, 0, 0, 0.50)", paddingBottom: "5px"}}>
                    <Stage/>
                    <Objects/>
                    <Games/>
                </Row>
            </Grid>
        );
    }
}


