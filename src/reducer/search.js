import * as types from '../action/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  documents: [],
  isEnd: false,
  count: -1,
  err: '',
  errCode: -1,
};

export default function search(state, action){
  if(typeof state === 'undefined'){
    return state = initialState;
  }

  switch(action.type){
  case types.SEARCH_ADDRESS:
    return update(state,{
      status: {$set:'WAITING'},
      documents: {$set: []}
    });
  case types.SEARCH_ADDRESS_SUCCESS:
    return update(state,{
      status: {$set:'SUCCESS'},
      documents: {$set: action.documents},
      count: {$set: action.count},
      isEnd: {$set: action.isEnd}
    });
  case types.SEARCH_ADDRESS_FAILURE:
    return update(state,{
      status: {$set:'FAILURE'},
      documents: {$set: []},
      count: {$set: -1},
      isEnd: {$set: false},
      err: {$set: action.err},
      errCode: {$set: action.errCode}
    });
  default:
    return state;
  }
}