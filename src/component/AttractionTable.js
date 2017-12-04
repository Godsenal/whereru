import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../style/AttractionTable.scss';
import {Pagination, Icon, Select} from 'antd';
import { getAttractions } from '../action/data';

const Option = Select.Option;
const cx = classNames.bind(styles);

class AttractionTable extends Component {
  static propTypes = {
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    addressName: PropTypes.string.isRequired,

    attractions : PropTypes.object.isRequired,
    getAttractions : PropTypes.func.isRequired,
  }
  state = {
    page: 1,
    radius: 2000,
    row: 10,
  }
  componentDidMount = () => {
    this.props.getAttractions(this.props.lat, this.props.lon);
  }
  handlePagination = (page) => {
    const {lat, lon} = this.props;
    const {radius, row} = this.state;
    this.props.getAttractions(lat, lon, radius, row, page);
    this.setState({
      page,
    });
  }
  handleRadius = (value) =>{
    const {lat, lon} = this.props;
    const {row} = this.state;
    this.props.getAttractions(lat, lon, value, row);
    this.setState({
      radius: value,
    });
  }
  renderAttractions = () => {
    const {list, totalCount, isEnd} = this.props.attractions; 
    var item = list.item?list.item.length>0?list.item:[list.item]:[];
    if(item.length <= 0){
      return(
        <div>
          주변에 관광지가 없습니다.
        </div>
      );
    }
    
    return(
      <div className={cx('listWrapper')}>
        {
          item.map((attraction, i) => {
            return(
              <div className={cx('listInline')} key={i}>
                <div>
                  {attraction.firstimage?
                    <img src={attraction.firstimage} width={250}/>
                    :<div className={cx('imageAlt')}>
                      이 장소는 이미지가 제공되지 않았습니다.
                    </div>
                  }
                </div>
                <div>
                  <div className={cx('listTitle')}>{attraction.title}</div>
                  <div className={cx('listAddr')}>{attraction.addr1}</div>
                </div>
              </div>
            );
          })
        }
        <Pagination className={styles.pagination} onChange={this.handlePagination} current={this.state.page} total={totalCount}/>
      </div>
    );
  }
  render() {
    const {radius} = this.state;
    const { attractions} = this.props;
    return (
      <div className={cx('container')}>
        <div className={styles.filter}>
          <span>반경 : </span>
          <Select defaultValue="2000" size='small' style={{ width: 120 }} onChange={this.handleRadius}>
            <Option value="100">100</Option>
            <Option value="500">500</Option>
            <Option value="1000">1000</Option>
            <Option value="2000">2000</Option>
            <Option value="5000">5000</Option>
          </Select>
        </div>
        <div className={cx('listContainer')}>
          {attractions.status === 'WAITING'?
            <div className={styles.loading}>
              <Icon type='loading'/>
            </div>:
            attractions.status === 'SUCCESS'?
              this.renderAttractions()
              :null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) =>{
  return {
    attractions : state.data.attractions
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAttractions : (lat, lon, radius, row, page) => {
      return dispatch(getAttractions(lat,lon,radius,row,page));
    }
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(AttractionTable);