import * as types from '../action/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  address:{
    data:{},
    name: '',
  },
  latlon:{
    status: 'INIT',
    lat: 0,
    lon: 0,
    err: '',
    errCode: 0,
  },
  weather_today:{
    status: 'INIT',
    weather: {},
    err: '',
    errCode: 0,
  },
  weather_fivedays:{
    status: 'INIT',
    weathers: [],
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
        errCode: {$set: action.errCode},
      }
    });
  case types.DATA_SET_LATLON:
    return update(state, {
      latlon: {
        status: { $set: 'SUCCESS'},
        lat: {$set: Number(action.lat)},
        lon: {$set: Number(action.lon)}
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
        lat: {$set: Number(action.lat)},
        lon: {$set: Number(action.lon)},
      }
    });
  case types.DATA_GET_LATLON_FAILURE:
    return update(state, {
      latlon: {
        status: { $set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode},
      }
    });
  case types.DATA_GET_TODAY_WEATHER:
    return update(state, {
      weather_today: {
        status: { $set: 'WAITING'}
      }
    });
  case types.DATA_GET_TODAY_WEATHER_SUCCESS:
    return update(state, {
      weather_today: {
        status: { $set: 'SUCCESS'},
        weather: { $set: action.weather}
      }
    });
  case types.DATA_GET_TODAY_WEATHER_FAILURE:
    return update(state, {
      weather_today: {
        status: { $set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode},
      }
    });
  case types.DATA_GET_FIVEDAYS_WEATHER:
    return update(state, {
      weather_fivedays: {
        status: { $set: 'WAITING'}
      }
    });
  case types.DATA_GET_FIVEDAYS_WEATHER_SUCCESS:
    return update(state, {
      weather_fivedays: {
        status: { $set: 'SUCCESS'},
        weathers: { $set: action.weathers}
      }
    });
  case types.DATA_GET_FIVEDAYS_WEATHER_FAILURE:
    return update(state, {
      weather_fivedays: {
        status: { $set: 'FAILURE'},
        err: {$set: action.err},
        errCode: {$set: action.errCode},
      }
    });
  default:
    return state;
  }
}