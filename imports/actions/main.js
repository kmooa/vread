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

//***** Games Redux Actions *****//

export const removeGame = (path) => {
  return {
    type: types.GAMES_ADD,
    path: path
  }
};

export const changeGameMenu = (menu) => {
  return {
    type: types.GAMES_MENU_CHANGE,
    menu: menu
  }
};

export const addGame = (key, obj) => {
  return {
    type: types.GAMES_ADD,
    key: key,
    obj: obj
  }
};

export const setInGame = (path, data) => {

  return {
    type: types.GAMES_SET_IN,
    path: path,
    data: data
  }
};

export const setGame = (data) => {

  return {
    type: types.GAMES_SET,
    data: data
  }
};

export const unsetGame = () => {

  return {
    type: types.GAMES_UNSET
  }
};

export const toggleGame = (state) => {

  return {
    type: types.GAMES_TOGGLE,
    state: state
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
