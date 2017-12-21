/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import {fromJS} from 'immutable';

const DEFAULT_STATE = fromJS({
    activeObject: null
});

function selection(state = DEFAULT_STATE, action) {

    var newState;

    switch (action.type) {

        case types.OBJECT_SET:
            newState = state.set("activeObject", action.value);
            return fromJS(newState);

        case types.OBJECT_UNSET:
            newState = state.set("activeObject", null);
            return fromJS(newState);

        default:
            return state;
    }

}

export default selection;
