/**
 * Created by JohnBae on 7/1/17.
 */

import stage from './stage';
import settings from './settings';
import objects from './objects';
import games from './games';
import { combineReducers } from 'redux'

export default combineReducers({
    stage,
    objects,
    games,
    settings
})
