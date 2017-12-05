import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../style/PlaceTable.scss';
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
  render: (text,record) => <a href={record.place_url} target='_blank'>{text}</a>
}, {
  title: '카테고리',
  dataIndex: 'category_group_name',
  key: 'category_group_name',
}, {
  title: '거리(m)',
  dataIndex: 'distance',
  key: 'distance',
}, {
  title: '주소',
  dataIndex: 'address_name',
  key: 'address_name'
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
  handleGetPlaces = () => {
    const {lat, lon} = this.props;
    const {word, radius, row, sort, page} = this.state;
    let trimed = word.trim();
    if(trimed.length === 0){
      return ;
    }
    if(trimed.match(regex)){
      this.notify.error('검색어에 특수문자는 포함될 수 없습니다.');
      this.setState({
        word: '',
      });
      return ;
    }
    this.props.getPlaces(word, lat, lon, radius,  row, sort, page)
      .then(()=>{
        if(this.props.places.status === 'SUCCESS'){
          this.setState({
            data: this.setData(this.props.places.list),
          });
        }
      });
  }
  handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      this.setState({
        page: 1,
      },this.handleGetPlaces);
    }
  }
  handlePagination = (page) => {
    this.setState({
      page,
    },this.handleGetPlaces);
  }
  handleRadius = (radius) =>{
    this.setState({
      radius,
      page: 1,
    },this.handleGetPlaces);
  }
  handleSort = (sort) => {
    this.setState({
      sort,
      page: 1,
    },this.handleGetPlaces);
  }
  render() {
    const {radius, data, page, word} = this.state;
    const { places} = this.props;
    return (
      <div className={cx('container')}>
        <Notify
          ref={ref=>this.notify = ref}/>
        <div className={cx('searchHeader')}>
          <div className={cx('filter','listInline')}>
            <Select defaultValue="accuracy" size='small' style={{ width: 90 }} onChange={this.handleSort}>
              <Option value="accuracy">정확도 순</Option>
              <Option value="distance">거리 순</Option>
            </Select>
          </div>
          <div className={cx('filter','listInline')}>
            <Select defaultValue="2000" size='small' style={{ width: 90 }} onChange={this.handleRadius}>
              <Option value="100">100m 내</Option>
              <Option value="500">500m 내</Option>
              <Option value="1000">1km 내</Option>
              <Option value="2000">2km 내</Option>
              <Option value="5000">5km 내</Option>
              <Option value="10000">10km 내</Option>
            </Select>
          </div>
          <div className={cx('inputContainer')}>
            <input value={word} autoFocus='true' placeholder='검색어를 입력해주세요' onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
          </div>
        </div>
        <div className={cx('listWrapper')}>
          {
            places.status === 'READY'?
              <div className={styles.ready}>
                <p>
                  주변 원하는 장소를 검색할 수 있습니다.
                </p>
                <p>
                  예를 들어 <span>'이마트','세븐일레븐'</span> 등을 검색하실 수 있습니다.
                </p>
                <p>
                  조금 더 큰 범주로도 검색이 가능합니다.
                </p>
                <p>
                  즉, <span>'대형마트','편의점'</span> 등도 검색하실 수 있어요.
                </p>
              </div>:
              places.status === 'WAITING'?
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