/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';

const DEFAULT_STATE = {
  stats: false,
  mode: "uninitialized"
};

function selection(state = DEFAULT_STATE, action) {

  switch (action.type) {

    case types.SETTINGS_EDIT:{
      let newState = JSON.parse(JSON.stringify(state));
      newState[action.id] = action.value;
      return newState;
    }

    default:
      return state;
  }

}

export default selection;
