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
    more: PropTypes.bool.isRequired,
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
  }
  componentWillReceiveProps = (nextProps) => {
    if(!this.props.more && nextProps.more){
      this.props.getFivedaysWeather(this.props.lat,this.props.lon);
    }
  }
  
  getC = (temp) => {
    return (temp - 273.15).toFixed(1)+'°C';
  }
  getIcon = (code) => {
    var prefix = 'wi wi-';
    var icon = weatherIcons[code].icon;
  
    // If we are not in the ranges mentioned above, add a day/night prefix.
    if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
      icon = 'day-' + icon;
    }
  
    // Finally tack on the prefix.
    icon = prefix + icon;

    return icon;
  }
  renderTodayWeather = () => {
    const {weather} = this.props.weather_today;
    return (
      <div>
        <div className={styles.todayMain}>
          <div className={cx('weatherMain','weatherMainIcon')}>
            <div className={cx('date','description')}>{moment.unix(weather.dt).format('dddd Do')}</div>
            <i className={this.getIcon(weather.id)}/>
            <div className={styles.description}>{weather.description}</div>
          </div>
          <div className={styles.weatherMain}>
            <div>현재기온 : {this.getC(weather.temp)}</div>
            <div>습도 : {weather.humidity}%</div>
            <div>바람 : {weather.wind.speed}m/s</div>
          </div>
        </div>
        <div className={styles.weatherSub}>
          <div className={styles.max}>최고 기온 : {this.getC(weather.temp_max)}</div>
          <div className={styles.min}>최저 기온 : {this.getC(weather.temp_min)}</div>
        </div>
      </div>
    );
  }
  renderFivedaysWeather = () => {
    const {weathers} = this.props.weather_fivedays;
    return (
      <div className={styles.fivedaysMain}>
        {
          weathers.map((list,i) => {
            const {weather, temp_max, temp_min, dt} = list;
            return(
              <div className={cx('weatherMain','fivedaysList')} key={i}>
                <div>{moment.unix(dt).format('dddd Do')}</div>
                <i className={this.getIcon(weather.id)}/>
                <div >{weather.description}</div>
                <div>
                  <span className={styles.max}>{this.getC(temp_max)}</span>
                  /
                  <span className={styles.min}>{this.getC(temp_min)}</span>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
  render() {
    const {weather_today, weather_fivedays, more} = this.props;
    return (
      <div className={cx({
        container:!more,
        moreContainer: more
      })}>
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
        {more?
          <div className={styles.fivedaysContainer}>
            {
              weather_fivedays.status === 'WAITING'?
                <div className={styles.loading}>
                  <Icon type='loading'/>
                </div>
                :weather_fivedays.status === 'SUCCESS'?
                  this.renderFivedaysWeather()
                  :null
            }
          </div>:null
        }
        
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