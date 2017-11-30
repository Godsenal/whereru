import {
  DATA_SET_ADDRESS,
  DATA_SET_LATLON,
  DATA_GET_LATLON,
  DATA_GET_LATLON_SUCCESS,
  DATA_GET_LATLON_FAILURE,
  DATA_GET_ADDRESS,
  DATA_GET_ADDRESS_SUCCESS,
  DATA_GET_ADDRESS_FAILURE,
} from './ActionTypes';

import axios from 'axios';

const kakaoApi = axios.create({
  baseURL: 'https://dapi.kakao.com'
});
const mapApi = '/v2/local/search/address.json';
const coord2addressApi = '/v2/local/geo/coord2address.json';
kakaoApi.defaults.headers.common['Authorization'] = 'KakaoAK 62a0c42953c577f681f7d4236b9373f0';
kakaoApi.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

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