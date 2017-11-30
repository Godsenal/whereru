import {
  SEARCH_ADDRESS,
  SEARCH_ADDRESS_SUCCESS,
  SEARCH_ADDRESS_FAILURE
} from './ActionTypes';

import axios from 'axios';
const kakaoApi = axios.create({
  baseURL: 'https://dapi.kakao.com'
});
const searchApi = '/v2/local/search/address.json';
kakaoApi.defaults.headers.common['Authorization'] = 'KakaoAK 62a0c42953c577f681f7d4236b9373f0';
kakaoApi.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

function waitForFetch(type, payload = {}){
  return {
    type,
    ...payload
  };
}
function successFetch(type, payload = {}){
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

export function searchAddress(word, page = 1){
  return dispatch => {
    dispatch(waitForFetch(SEARCH_ADDRESS), {word});
    return kakaoApi.get(searchApi+'?query='+word+'&page='+page)
      .then(
        res =>{
          const meta = res.data.meta;
          const doc = res.data.documents;
          dispatch(successFetch(SEARCH_ADDRESS_SUCCESS,{
            documents: doc,
            count : meta.total_count,
            isEnd: meta.is_end,
          }));
        },
        error =>{
          dispatch(failureFetch(
            SEARCH_ADDRESS_FAILURE, error.err, error.code
          ));
        });
  };
}