import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../style/AttractionTable.scss';
import {Notify} from './';
import { Table, Icon, Divider, Pagination, Select } from 'antd';
import { getPlaces,readyGetPlaces } from '../action/data';

const Option = Select.Option;
const cx = classNames.bind(styles);
const regex= /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g;

const columns = [{
  title: '이름',
  dataIndex: 'place_name',
  key: 'place_name',
}, {
  title: '카테고리',
  dataIndex: 'category_group_name',
  key: 'category_group_name',
}, {
  title: '거리',
  dataIndex: 'distance',
  key: 'distance',
}, {
  title: '주소',
  dataIndex: 'address_name',
  key: 'address_name'
},{
  title: 'url',
  dataIndex: 'place_url',
  key: 'place_url',
  render: text => <a href={text}>{text}</a>
}
];

class PlaceTable extends Component {
  static propTypes = {
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    addressName: PropTypes.string.isRequired,

    places : PropTypes.object.isRequired,
    getPlaces : PropTypes.func.isRequired,
    readyGetPlaces: PropTypes.func.isRequired,
  }
  state = {
    word: '',
    data: [],
    page: 1,
    radius: 2000,
    sort: 'accuracy',
    row: 10,
  }
  componentDidMount(){
    this.props.readyGetPlaces();
    
  }
  setData = (data) => {
    return data.map((place,i)=>{{
      return{
        key: i,
        ...place
      };
    }});
  }
  handleChange = (e) => {
    this.setState({
      word: e.target.value,
    });
  }
  handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      
      const {lat, lon} = this.props;
      const {word, radius, sort, row} = this.state;

      let trimed = word.trim();
      if(trimed.match(regex)){
        this.notify.error('검색어에 특수문자는 포함될 수 없습니다.');
        this.setState({
          word: '',
        });
        return ;
      }
      this.props.getPlaces(word, lat, lon, radius,  row, sort)
        .then(()=>{
          if(this.props.places.status === 'SUCCESS'){
            this.setState({
              data: this.setData(this.props.places.list),
              page: 1
            });
          }
        });
    }
  }
  handlePagination = (page) => {
    const {lat, lon} = this.props;
    const {word, radius, row, sort} = this.state;
    this.props.getPlaces(word, lat, lon, radius, row, sort, page)
      .then(()=>{
        if(this.props.places.status === 'SUCCESS'){
          this.setState({
            data: this.setData(this.props.places.list),
            page
          });
        }
      });
  }
  handleRadius = (radius) =>{
    const {lat, lon} = this.props;
    const {word, row, sort} = this.state;
    this.props.getPlaces(word, lat, lon, radius, row, sort)
      .then(()=>{
        if(this.props.places.status === 'SUCCESS'){
          this.setState({
            data: this.setData(this.props.places.list),
            page: 1,
            radius
          });
        }
      });
  }
  render() {
    const {radius, data, page, word} = this.state;
    const { places} = this.props;
    return (
      <div className={cx('container')}>
        <Notify
          ref={ref=>this.notify = ref}/>
        <div className={styles.filter}>
          <span>반경 : </span>
          <Select defaultValue="2000" size='small' style={{ width: 120 }} onChange={this.handleRadius}>
            <Option value="100">100</Option>
            <Option value="500">500</Option>
            <Option value="1000">1000</Option>
            <Option value="2000">2000</Option>
            <Option value="5000">5000</Option>
            <Option value="10000">10000</Option>
          </Select>
        </div>
        <input value={word} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
        <div className={cx('listWrapper')}>
          {places.status === 'WAITING'?
            <div className={styles.loading}>
              <Icon type='loading'/>
            </div>:
            places.status === 'SUCCESS'?
              <div>
                <Table 
                  columns={columns} 
                  dataSource={data} 
                  pagination={{
                    onChange: this.handlePagination,
                    current: page,
                    total: places.totalCount
                  }}/>
              </div>
              :null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) =>{
  return {
    places : state.data.places
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPlaces : (word, lat, lon, radius, row, sort, page) => {
      return dispatch(getPlaces(word, lat,lon,radius,row, sort, page));
    },
    readyGetPlaces : () => {
      dispatch(readyGetPlaces());
    }
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(PlaceTable);