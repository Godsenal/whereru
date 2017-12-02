import React, { Component } from 'react';
import PropTypes from 'prop-types';


import {WeatherTable} from '../component';
import styles from '../style/Table.scss';

export default class Table extends Component {
  static propTypes = {
    latlon: PropTypes.object.isRequired,
    address: PropTypes.object.isRequired,
  }
  state = {
    weather: false,
  }
  clickMore = (comp) => {
    this.setState({
      [comp]: !this.state[comp],
    });
  }
  render() {
    const {latlon, address} = this.props;
    const {weather} = this.state;
    return (
      <div className={styles.container}>
        <div>
          <WeatherTable lat={latlon.lat} lon={latlon.lon} addressName={address.name} more={weather}/>
          <div className={styles.button}>
            <a onClick={()=>{this.clickMore('weather');}}>{!weather?'더 보기':'간략히 보기'}</a>
          </div>
        </div>
      </div>
    );
  }
}
