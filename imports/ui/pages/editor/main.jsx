/**
 * Created by JohnBae on 12/26/16.
 */

import React from 'react';
import {Button, Grid, Row, Col} from 'react-bootstrap';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import * as Actions from "../../../actions/main";
import { withRouter } from 'react-router-dom'

import Menu from './menu/main'
import Engine from '/imports/vrEngine/main';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {vr: false};
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

  render () {

    return (
      <div className="default-container">

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

        <Engine {...this.props} mode="edit"/>

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
