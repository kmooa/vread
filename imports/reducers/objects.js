/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';

const DEFAULT_STATE = {
  activeObject: null
};

function selection(state = DEFAULT_STATE, action) {

  switch (action.type) {

    case types.OBJECT_SET:{
      let newState = JSON.parse(JSON.stringify(state));
      newState.activeObject = action.value;
      return newState;
    }

    case types.OBJECT_UNSET:{
      let newState = JSON.parse(JSON.stringify(state));
      newState.activeObject = null;
      return newState;
    }

    default:
      return state;
  }

}

export default selection;
