import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { Menu, Icon } from 'antd';
import MdWbSunny from 'react-icons/lib/md/wb-sunny';
import MdLocalAttraction from 'react-icons/lib/md/local-attraction';
import {WeatherTable, AttractionTable} from '../component';
import styles from '../style/Table.scss';

const cx = classNames.bind(styles);

export default class Table extends Component {
  static propTypes = {
    latlon: PropTypes.object.isRequired,
    address: PropTypes.object.isRequired,
  }
  state = {
    menu: 'weather',
  }
  clickMore = (comp) => {
    this.setState({
      [comp]: !this.state[comp],
    });
  }
  handleMenu = (e) => {
    this.setState({
      menu: e.key,
    });
  }
  render() {
    const {latlon, address} = this.props;
    const {menu, weather, attraction} = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div >{address.name}</div>
          <div className={styles.menuWrapper}>
            <Menu
              onClick={this.handleMenu}
              selectedKeys={[menu]}
              mode="horizontal"
            >
              <Menu.Item key="weather">
                <MdWbSunny style={{fontSize: 16}}/> 날씨
              </Menu.Item>
              <Menu.Item key="attraction">
                <MdLocalAttraction style={{fontSize: 16}}/> 관광지
              </Menu.Item>
            </Menu>
          </div>
        </div>
        <div className={styles.contentContainer}>
          {
            menu === 'weather'?
              <div className={cx('content')}>
                <WeatherTable lat={latlon.lat} lon={latlon.lon} addressName={address.name}/>
              </div>
              :null
          }
          {
            menu === 'attraction'?
              <div className={cx('content')}>
                <AttractionTable lat={latlon.lat} lon={latlon.lon} addressName={address.name}/>
              </div>
              :null
          }
        </div>
        
      </div>
    );
  }
}
