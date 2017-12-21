/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import {fromJS} from 'immutable';

const DEFAULT_STATE = fromJS({
    stats: true,
});

function selection(state = DEFAULT_STATE, action) {

    var newState;

    switch (action.type) {

        case types.SETTINGS_EDIT:
            newState = state.set(action.id, action.value);
            return fromJS(newState);

        default:
            return state;
    }

}


export default selection;
