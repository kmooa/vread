/**
 * Created by JohnBae on 10/9/17.
 */

import React from 'react';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import * as Actions from "../../../../actions/main";
import {Button, ButtonToolbar} from 'react-bootstrap';
import Games from '/imports/vrEngine/components/games/main';

class Objects extends React.Component{

  constructor(props){
    super(props);
  }

  changeMenu(menu){
    this.props.actions.changeGameMenu(menu);
  }

  render(){

    let self = this,
        SelectedGame;

    let GameList = Games.map(function(game){

      if(game.id === self.props.games.menu){
        SelectedGame = game.menu;
      }

      return <Button className="menu-item"
                     key={game.id}
                     onClick={()=>self.changeMenu(game.id)}>
        {game.name}
      </Button>
    });

    return(
        <div>
          <div className="menu-row" style={{display: "inline-block"}}>
            <Button bsStyle="primary" className="menu-item-square emptyButton">
              <img style={{
                verticalAlign: "middle",
                height: "2rem",
              }} src="/assets/icons/effects.svg"/>
            </Button>
          </div>
          <div className="menu-row" style={{display: "inline-block", overflow: "scroll", width: 'calc(100vw - 65px)', marginLeft: "0"}}>
            <ButtonToolbar style={{width: "5000px"}}>
              {SelectedGame ? <Button className="menu-item-square"
                                      onClick={()=> this.changeMenu("")}>
                <img style={{
                  verticalAlign: "middle",
                  height: "2rem",
                }}src="/assets/icons/arrow-left.svg"/>
              </Button> : ""}

              {SelectedGame ? <SelectedGame /> : GameList}

            </ButtonToolbar>
          </div>
        </div>
    )
  }
}


function selector(dispatch) {
  let result = {};
  const actions = bindActionCreators(Actions, dispatch);
  return (nextState, nextOwnProps) => {

    const nextResult = {
      actions: actions,
      games: nextState.games
    };
    if(nextResult!=result){
      result = nextResult;
    }
    return result
  }
}

export default connectAdvanced(selector)(Objects);
