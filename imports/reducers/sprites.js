/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import {fromJS} from 'immutable';

const DEFAULT_STATE = fromJS({
    active: false,
    activeSprites: [],
    list: []
});

function selection(state = DEFAULT_STATE, action) {

    let newState;

    switch (action.type) {

        case types.SPRITES_USER_ADD:
            let newSprites = state.get("list").push(action.value);
            newState = state.set("list", newSprites);
            return fromJS(newState);

        case types.SPRITES_SET:
            newState = state.set("activeSprites", action.value);
            return fromJS(newState);

        case types.SPRITES_UNSET:
            newState = state.set("activeSprites", []);
            return fromJS(newState);

        case types.SPRITES_TOGGLE:
            newState = state.set("active", action.value);
            return fromJS(newState);

        default:
            return state;
    }


}

export default selection;
