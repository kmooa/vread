/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';

const DEFAULT_STATE = {
  scene: {environment: {data: {"obj-model": "obj: #bg-obj; mtl: #bg-mtl", scale: "7 7 7", position: "0 0 25"}, type: 'custom'}, particles: "none"},
  activeCustom: null,
  customList: []
};

function selection(state = DEFAULT_STATE, action) {

  let newState;

  switch (action.type) {

    case types.STAGE_SCENE_SET:{
      let newState = JSON.parse(JSON.stringify(state));
      newState.scene.environment = action.value;
      return newState;
    }

    case types.STAGE_PARTICLES_SET:{
      let newState = JSON.parse(JSON.stringify(state));
      newState.scene.particles = action.value;
      return newState;
    }

    case types.STAGE_USER_SET:{
      let newState = JSON.parse(JSON.stringify(state));
      newState.activeCustom = action.value;
      return newState;
    }

    case types.STAGE_USER_ADD:{
      let newState = JSON.parse(JSON.stringify(state));
      newState.customList = action.value;
      return newState;
    }

    default:
      return state;
  }

}

export default selection;
