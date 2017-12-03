import {
  DATA_SET_ADDRESS,
  DATA_SET_LATLON,
  DATA_GET_LATLON,
  DATA_GET_LATLON_SUCCESS,
  DATA_GET_LATLON_FAILURE,
  DATA_GET_ADDRESS,
  DATA_GET_ADDRESS_SUCCESS,
  DATA_GET_ADDRESS_FAILURE,
  DATA_GET_TODAY_WEATHER,
  DATA_GET_TODAY_WEATHER_SUCCESS,
  DATA_GET_TODAY_WEATHER_FAILURE,
  DATA_GET_FIVEDAYS_WEATHER,
  DATA_GET_FIVEDAYS_WEATHER_SUCCESS,
  DATA_GET_FIVEDAYS_WEATHER_FAILURE,
} from './ActionTypes';

import axios from 'axios';
import moment from 'moment';
const kakaoApi = axios.create({
  baseURL: 'https://dapi.kakao.com',
  headers: {
    'Content-Type':'application/x-www-form-urlencoded',
    'Authorization':'KakaoAK 62a0c42953c577f681f7d4236b9373f0'
  },
  timeout: 10000,
});
const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org',
  timeout: 10000,
});

const mapApi = '/v2/local/search/address.json';
const coord2addressApi = '/v2/local/geo/coord2address.json';

const language = 'kr';
const weatherKey = '87c0c8e8bd2932e474295bb435c42eb8';
const coord2weatherApi = '/data/2.5/weather';
const coord2forecastApi = '/data/2.5/forecast';
function waitForFetch(type){
  return {
    type,
  };
}
function successFetch(type, payload){
  return {
    type,
    ...payload,
  };
}
function failureFetch(type, err, code){
  return {
    type,
    err,
    code
  };
}
// 주소 검색 이용시 주소 설정하는 raw action.
export function setAddress(data, name){
  return {
    type: DATA_SET_ADDRESS,
    data,
    name,
  };
}
// 위도와 경도를 이용해 주소 불러오기.
export function getAddress(lat,lon){
  return (dispatch) => {
    dispatch(waitForFetch(DATA_GET_ADDRESS));
    return kakaoApi.get(coord2addressApi+'?x='+lon+'&y='+lat)
      .then(
        res=>{
          const doc = res.data.documents[0].address;
          dispatch(successFetch(DATA_GET_ADDRESS_SUCCESS,{
            data: doc,
            name: doc.address_name
          }));
        },
        error =>{
          dispatch(failureFetch(
            DATA_GET_ADDRESS_FAILURE, error.err, error.code
          ));
        });
  };
}
// geolocation 이용시 위,경도 설정하는 raw action.
export function setLatlon(lat,lon){
  return {
    type: DATA_SET_LATLON,
    lat,
    lon
  };
}
// 주소를 이용해 위,경도 불러오기.
export function getLatlon(address){
  return (dispatch) => {
    dispatch(waitForFetch(DATA_GET_LATLON));
    return kakaoApi.get(mapApi+'?query='+address)
      .then(
        res =>{
          const doc = res.data.documents[0];
          dispatch(successFetch(DATA_GET_LATLON_SUCCESS,{
            lat: doc.y, 
            lon: doc.x
          }));
        },
        error =>{
          dispatch(failureFetch(
            DATA_GET_LATLON_FAILURE, error.err, error.code
          ));
        });
  };
}
// 위,경도를 이용해 오늘 날씨 불러오기.
export function getTodayWeather(lat,lon){
  return dispatch => {
    dispatch(waitForFetch(DATA_GET_TODAY_WEATHER));
    return weatherApi.get(coord2weatherApi+'?lat='+lat+'&lon='+lon+'&lang='+language+'&APPID='+weatherKey)
      .then(
        res => {
          const data =res.data.weather?res.data.weather[0]:[];
          const temp = res.data.main;
          const {dt, wind, rain} = res.data;
          let weather = {
            ...data,
            ...temp,
            dt,
            wind,
            rain
          };
          dispatch(successFetch(DATA_GET_TODAY_WEATHER_SUCCESS,{
            weather
          }));
        },
        error => {
          const cod = error.data.code;
          dispatch(failureFetch(
            DATA_GET_TODAY_WEATHER_FAILURE, '에러 발생.', cod
          ));
        }
      );
  };
}

/* weathers data를 파싱하여 3일간의 데이터를 이차원배열로 옮겨줌 */
function parseWeathers(weathers){
  let previousDate = 0;
  let data = [];
  let index = -1;
  let today = new Date();
  for(var i=0; i<weathers.length; i++){
    let date = moment.unix(weathers[i].dt).date();
    if(date == today.getDate()){
      continue;
    }
    let hour = moment.unix(weathers[i].dt).hour();
    if(previousDate != date){
      if(index > 2){
        break;
      }
      previousDate = date;
      data[++index] = {
        dt: '',
        weather: {},
        temp_min: 9999,
        temp_max: -9999,
      };
    }
    if(data[index].temp_min > weathers[i].main.temp_min){
      data[index].temp_min = weathers[i].main.temp_min;
    }
    if(data[index].temp_max < weathers[i].main.temp_max){
      data[index].temp_max = weathers[i].main.temp_max;
    }
    if(hour === 12){
      data[index].weather = weathers[i].weather[0];
    }
    data[index].dt = weathers[i].dt;
  }
  return data;
}
// 위,경도를 이용해 5일 날씨 불러오기.
export function getFivedaysWeather(lat,lon){
  return dispatch => {
    dispatch(waitForFetch(DATA_GET_FIVEDAYS_WEATHER));
    return weatherApi.get(coord2forecastApi+'?lat='+lat+'&lon='+lon+'&lang='+language+'&APPID='+weatherKey)
      .then(
        res => {
          const weathers = res.data?parseWeathers(res.data.list):[];
          const list = res.data.list?res.data.list:[];
          dispatch(successFetch(DATA_GET_FIVEDAYS_WEATHER_SUCCESS,{
            weathers,
            list
          }));
        },
        error => {
          const cod = error.data.code;
          dispatch(failureFetch(
            DATA_GET_FIVEDAYS_WEATHER_FAILURE, '에러 발생.', cod
          ));
        }
      );
  };
}