/**
 * Created by JohnBae on 7/1/17.
 */
import * as types from '../constants/actionTypes';


//***** Object Redux Actions *****//

export const setObject = (object) => {

    return {
        type: types.OBJECT_SET,
        value: object
    }
};

export const unsetObject = () => {

    return {
        type: types.OBJECT_UNSET
    }
};


//***** Sprite Redux Actions *****//

export const addUserSprite = (img) => {
    return {
        type: types.SPRITES_USER_ADD,
        value: img
    }
};

export const setSprites = (sprite) => {

    return {
        type: types.SPRITES_SET,
        value: sprite
    }
};

export const unsetSprites = () => {

    return {
        type: types.SPRITES_UNSET
    }
};

export const toggleSprites = (state) => {

    return {
        type: types.SPRITES_TOGGLE,
        value: state
    }
};


//***** Stage Redux Actions *****//

export const addUserStage = (img) => {
    return {
        type: types.STAGE_USER_ADD,
        value: img
    }
};

export const setUserStage = (img) => {
    return {
        type: types.STAGE_USER_SET,
        value: img
    }
};

export const setStageScene = (scene) => {
    return {
        type: types.STAGE_SCENE_SET,
        value: scene
    }
};

export const setStageParticles = (particle) => {
    return {
        type: types.STAGE_PARTICLES_SET,
        value: particle
    }
};


//***** Settings Redux Actions *****//

export const editSettings = (id, value) =>{
    return {
        type: types.SETTINGS_EDIT,
        id: id,
        value: value
    }
};
