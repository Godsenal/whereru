import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Icon} from 'antd';

import moment from 'moment';
import classNames from 'classnames/bind';
import styles from '../style/WeatherTable.scss';
import weatherIcons from '../util/WeatherIcons';
import 'weather-icons/css/weather-icons.css';

import { getTodayWeather, getFivedaysWeather } from '../action/data';

const cx = classNames.bind(styles);

class WeatherTable extends Component {
  static propTypes = {
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    addressName: PropTypes.string.isRequired,

    weather_today: PropTypes.object.isRequired,
    weather_fivedays: PropTypes.object.isRequired,

    getTodayWeather: PropTypes.func.isRequired,
    getFivedaysWeather: PropTypes.func.isRequired,
  }
  componentDidMount = () => {
    this.props.getTodayWeather(this.props.lat,this.props.lon);
    this.props.getFivedaysWeather(this.props.lat,this.props.lon);
  }
  componentWillReceiveProps = (nextProps) => {
  }
  /*
  makeChart = () => {
    const list = this.props.weather_fivedays.list.slice(0,10);
    const ctx = document.getElementById('weather-chart');
    var labels = [];
    var temps = [];
    for(var i = 0; i < list.length; ++i){
      labels.push(moment.unix(list[i].dt).format('Do hh')+'시');
      temps.push(this.getC(list[i].main.temp));
    }
    const data = {
      labels,
      datasets: [{
        label: '날씨',
        lineTension: 0.1,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        borderColor: 'rgb(255, 204, 0)',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointBackgroundColor: 'rgb(255, 204, 0)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointRadius: 1,
        pointHitRadius: 10,
        showLines: false,
        fill : false,
        data: temps,
      }],
      
    };
    const lineChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function(tooltipItems, data) { 
              return tooltipItems.yLabel + '°C';
            }
          }
        },
        animation: {
          duration: 1,
          onComplete: function () {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
  
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                console.log(list);
                ctx.fillText(list.weather[0].description, bar._model.x, bar._modelx.y - 2);                            
                ctx.fillText(data+'°C', bar._model.x, bar._model.y - 5);
              });
            });
          }
        }
      }   
    });
  }
  */
  //섭씨 구하기.
  getC = (temp,type = 'S') => {
    temp = Number(temp);
    if(type == 'S'){
      temp = temp - 273.15;
    }
    return temp.toFixed(1);
  }
  //json parsing해서 openweathermap의 id에 맞는 icon 가져오기.
  getIcon = (code, API = 'OWM') => { // Open Weather Map
    var prefix = 'wi wi-';
    var icon = weatherIcons[code].icon;
  
    // If we are not in the ranges mentioned above, add a day/night prefix.
    if(API === 'SK'){
      if (code < 7) {
        icon = 'day-' + icon;
      }
    }
    else if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
      icon = 'day-' + icon;
    }
  
    // Finally tack on the prefix.
    icon = prefix + icon;

    return icon;
  }
  renderTodayWeather = () => {
    const {weather} = this.props.weather_today;
    if(weather.length <= 0){
      return(
        <div>
          날씨 정보를 불러오지 못했습니다.
        </div>
      );
    }
    const {sky, temperature, humidity, wind, timeObservation} = weather;
    const code = sky.code.substring(5,7);
    return (
      <div>
        <div className={styles.todayMain}>
          <div className={styles.header}>현재 날씨</div>
          <div className={cx('weatherMain','weatherMainIcon')}>
            <div className={cx('date','description')}>{moment(timeObservation).format('dddd Do')}</div>
            <i className={this.getIcon(code,'SK')}/>
            <div className={styles.description}>{sky.name}</div>
          </div>
          <div className={styles.weatherMain}>
            <div>현재기온 : {this.getC(temperature.tc,'C')}°C</div>
            <div>습도 : {humidity?Number(humidity).toFixed(1):'?'}%</div>
            <div>바람 : {wind.wspd?Number(wind.wspd).toFixed(1):'?'}m/s</div>
          </div>
        </div>
        <div className={styles.weatherSub}>
          <div className={styles.max}>최고 기온 : {this.getC(temperature.tmax,'C')}°C</div>
          <div className={styles.min}>최저 기온 : {this.getC(temperature.tmin,'C')}°C</div>
        </div>
      </div>
    );
  }
  renderTimeWeather = () => {
    const list = this.props.weather_fivedays.list.slice(0,9);
    return(
      <div className={styles.fivedaysMain}>
        <div className={styles.header}>시간별 날씨</div>
        <div className={styles.weatherList}>
          {
            list.map((item, i) => {
              const {weather, main, dt} = item;
              return(
                <div className={cx('weatherMain','fivedaysList','fivedaysMain')} key={i}>
                  <div>{moment.unix(dt).format('Do A h')}시</div>
                  <i className={this.getIcon(weather[0].id)}/>
                  <div >{weather[0].description}</div>
                  <div>
                    <span className={styles.max}>{this.getC(main.temp_max)}°C</span>
                    /
                    <span className={styles.min}>{this.getC(main.temp_min)}°C</span>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );

  }
  renderFivedaysWeather = () => {
    const {weathers} = this.props.weather_fivedays;
    return (
      <div className={styles.fivedaysMain}>
        <div className={styles.header}>일별 날씨</div>
        <div className={styles.weatherList}>
          {
            weathers.map((list,i) => {
              const {weather, temp_max, temp_min, dt} = list;
              return(
                <div className={cx('weatherMain','fivedaysList')} key={i}>
                  <div>{moment.unix(dt).format('dddd Do')}</div>
                  <i className={this.getIcon(weather.id)}/>
                  <div >{weather.description}</div>
                  <div>
                    <span className={styles.max}>{this.getC(temp_max)}°C</span>
                    /
                    <span className={styles.min}>{this.getC(temp_min)}°C</span>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
  render() {
    const {weather_today, weather_fivedays} = this.props;
    return (
      <div className={cx('container')}>
        <div className={styles.todayContainer}>
          {weather_today.status === 'WAITING'?
            <div className={styles.loading}>
              <Icon type='loading'/>
            </div>
            :weather_today.status === 'SUCCESS'?
              this.renderTodayWeather()
              :null
          }
        </div>
        <div className={styles.fivedaysContainer}>
          {
            weather_fivedays.status === 'WAITING'?
              <div className={styles.loading}>
                <Icon type='loading'/>
              </div>
              :weather_fivedays.status === 'SUCCESS'?
                <div>
                  {this.renderTimeWeather()}
                  {this.renderFivedaysWeather()}
                </div>
                :null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    weather_today: state.data.weather_today,
    weather_fivedays: state.data.weather_fivedays,
  };
};
const mapDispatchToProps = (dispatch) => {
  return{
    getTodayWeather: (lat,lon) => {
      return dispatch(getTodayWeather(lat,lon));
    },
    getFivedaysWeather: (lat,lon) => {
      return dispatch(getFivedaysWeather(lat,lon));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(WeatherTable);