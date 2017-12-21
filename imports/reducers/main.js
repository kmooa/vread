/**
 * Created by JohnBae on 7/1/17.
 */

import scenes from './stage';
import settings from './settings';
import objects from './objects';
import sprites from './sprites';
import { combineReducers } from 'redux'

export default combineReducers({
    stage: scenes,
    objects,
    sprites,
    settings
})
