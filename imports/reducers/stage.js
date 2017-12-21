/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import {fromJS} from 'immutable';

const DEFAULT_STATE = fromJS({
    scene: {environment: "default", particles: "none"},
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
