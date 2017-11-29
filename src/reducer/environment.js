import * as types from '../action/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  isMobile: window.innerWidth < 1000,
};

export default function environment(state, action){
  if(typeof state === 'undefined'){
    state = initialState; 
  }

  switch(action.type){
  case types.CHANGE_IS_MOBILE:
    return update(state,{
      isMobile: {$set: action.isMobile}
    });
  case types.CHANGE_WIDTH_AND_HEIGHT:
    return update(state,{
      screenWidth: {$set: action.screenWidth},
      screenHeight: {$set: action.screenHeight},
    });
  default:
    return state;
  }
}