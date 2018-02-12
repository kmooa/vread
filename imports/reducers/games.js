/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';

const DEFAULT_STATE = {menu: "", game: ""};

function selection(state = DEFAULT_STATE, action) {

  switch (action.type) {

    case types.GAMES_MENU_CHANGE: {
      let newState = JSON.parse(JSON.stringify(state));
      newState.menu = action.menu;
      return newState;
    }

    case types.GAMES_ADD: {
      let newState = JSON.parse(JSON.stringify(state));
      newState.game[action.key] = action.obj;
      return newState;
    }

    case types.GAMES_SET_IN: {
      let newState = JSON.parse(JSON.stringify(state));
      newState.game[action.path] = action.data;
      console.log("ACTION CHECK", action, newState);
      return newState;
    }

    case types.GAMES_SET: {
      let newState = JSON.parse(JSON.stringify(state));
      newState.game = action.data;
      return newState;
    }

    case types.GAMES_UNSET: {
      let newState = JSON.parse(JSON.stringify(state));
      newState.game = "";
      return newState;
    }

    case types.GAMES_TOGGLE: {
      let newState = JSON.parse(JSON.stringify(state));
      newState.settings = action.state;
      return newState;
    }

    default:
      return state;
  }
}

export default selection;
