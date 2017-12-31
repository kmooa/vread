/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import {fromJS} from 'immutable';

const DEFAULT_STATE = fromJS({
    scene: {environment: {seed: 1, skyType: 'atmosphere', skyColor: '#88c', horizonColor: '#ddd', lighting: 'distant', lightPosition: { x: -0.11, y: 1, z: 0.33}, fog: 0, flatShading: false, playArea: 1, ground: 'hills', groundYScale: 3, groundTexture: 'checkerboard', groundColor: '#454545', groundColor2: '#5d5d5d', dressing: 'none', dressingAmount: 10, dressingColor: '#795449', dressingScale: 1, dressingVariance: { x: 0, y: 0, z: 0}, dressingUniformScale: true, dressingOnPlayArea: 0, grid: 'none', gridColor: '#ccc', shadow: false}, particles: "none"},
    activeCustom: null,
    user: []
});

function selection(state = DEFAULT_STATE, action) {

    let newState;

    switch (action.type) {

        case types.STAGE_SCENE_SET:
            newState = state.setIn(["scene","environment"], fromJS(action.value));
            return fromJS(newState);

        case types.STAGE_PARTICLES_SET:
            newState = state.setIn(["scene","particles"], fromJS(action.value));
            return fromJS(newState);

        case types.STAGE_USER_SET:
            newState = state.set("activeCustom", action.value);
            return fromJS(newState);

        case types.STAGE_USER_ADD:
            newState = state.get("user").push(action.value);
            newState = state.set("user", newState);
            return fromJS(newState);

        default:
            return state;
    }

}

export default selection;
