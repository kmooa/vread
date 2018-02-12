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
import equal from 'fast-deep-equal';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {vr: false};
  }

  componentDidMount() {
    this.props.actions.editSettings("mode", "edit");
  }

  preview(){

    this.props.history.push({
      pathname: '/viewer/preview',
      state: {
        environment: this.props.environment,
        particles: this.props.particles,
        userBackground: this.props.userBackground,
        object: this.props.object,
        game: this.props.game
      }
    })
    this.props.actions.editSettings("mode", "view");
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

        <Engine {...this.props}/>

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
      mode: nextState.settings.mode,
      environment: nextState.stage.scene.environment,
      particles: nextState.stage.scene.particles,
      userBackground: nextState.stage.activeCustom,
      object: nextState.objects.activeObject,
      game: nextState.games.game,
      actions: actions,
      ...nextOwnProps
    };

    if(!equal(nextResult, result)){
      result = nextResult;
    }
    return result
  }
}

export default withRouter(connectAdvanced(selector)(App));
