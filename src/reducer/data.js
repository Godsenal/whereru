import * as types from '../action/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  address:{
    data:{},
    name: '',
  },
  latlon:{
    status: 'INIT',
    lat: '',
    lon: '',
    err: '',
    errCode: 0,
  }
};

export default function data(state, action){
  if(typeof state === 'undefined') {
    state = initialState;
  }

  switch(action.type) {
  /* LOGIN */
  case types.DATA_SET_ADDRESS:
    return update(state, {
      address: {
        status: { $set: 'SUCCESS'},
        data: { $set: action.data},
        name: {$set: action.name}
      }
    });
  case types.DATA_GET_ADDRESS:
    return update(state, {
      address: {
        status: { $set: 'WAITING'}
      }
    });
  case types.DATA_GET_ADDRESS_SUCCESS:
    return update(state, {
      address: {
        status: { $set: 'SUCCESS'},
        data: {$set: action.address},
        name: {$set: action.name},
      }
    });
  case types.DATA_GET_ADDRESS_FAILURE:
    return update(state, {
      address: {
        status: { $set: 'FAILURE'},
        err: {$set: action.err},
        code: {$set: action.code},
      }
    });
  case types.DATA_SET_LATLON:
    return update(state, {
      latlon: {
        status: { $set: 'SUCCESS'},
        lat: {$set: action.lat},
        lon: {$set: action.lon}
      }
    });
  case types.DATA_GET_LATLON:
    return update(state, {
      latlon: {
        status: { $set: 'WAITING'}
      }
    });
  case types.DATA_GET_LATLON_SUCCESS:
    return update(state, {
      latlon: {
        status: { $set: 'SUCCESS'},
        lat: {$set: action.lat},
        lon: {$set: action.lon},
      }
    });
  case types.DATA_GET_LATLON_FAILURE:
    return update(state, {
      latlon: {
        status: { $set: 'FAILURE'},
        err: {$set: action.err},
        code: {$set: action.code},
      }
    });
  default:
    return state;
  }
}