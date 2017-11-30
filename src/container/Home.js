import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Modal, Button} from 'antd';

import styles from '../style/Home.scss';
import {AddressSearch, DaumAddressSearch, Notify} from '../component';
import {getAddress, setAddress, getLatlon, setLatlon} from '../action/data';
import {searchAddress} from '../action/search';
import {initEnvironment} from '../action/environment';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      notify: false,
      isReady : false,
    };
  }
  componentDidMount = () => {
    window.addEventListener('resize',this.props.initEnvironment);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.props.initEnvironment);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.location.state && nextProps.location.state.isRedirect){
      this.props.history.replace('/',undefined);
      this.notify.warning('먼저 위치를 설정해주세요.',3000);
      
    }
  }
  /*
  getNotify = () => {
    this.notify.success('hoho',0);
  }
  clearNotify = () => {
    this.notify.clearNotify();
  }
  */
  showModal = () => {
    if(!this.state.visible){
      this.setState({
        visible: true,
      });
    }
    
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleSearchComplete = (data) => {
    this.props.setAddress(data,data.address_name);
    this.props.setLatlon(data.y, data.x);
    this.setState({
      visible: false,
    });
    this.notify.success('검색 완료!',2000,()=>{
      this.props.history.push('/information');
    });
    
    /*
    this.props.getLatlon(data.address)
      .then(
        res=>{
          this.notify.success('검색 완료!',2000,()=>{
            this.props.history.push('/information');
          });
        });
    */
  }
  getLocation = () => {
    if (navigator.geolocation) {
      this.notify.clearNotify();
      const msg = this.notify.loading('주소를 가져오는 중...', 0);
      navigator.geolocation.getCurrentPosition(
        position=>{
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          this.props.setLatlon(lat, lon);
          this.props.getAddress(lat, lon)
            .then(
              res=>{
                this.notify.removeNotify(msg);
                this.notify.success('성공! 잠시만 기다려주세요...',2000,()=>{
                  this.props.history.push('/information');
                });
              },
              error=>{
                this.notify.removeNotify(msg);
                this.notify.error('주소 불러오기 실패. 다시 시도해 주세요.',3000);
              }
            );
        },
        error=>{
          this.notify.removeNotify(msg);
          this.notify.error('위치 확인 권한을 허용한 후 다시 눌러주세요.');
        });
      
    } else {
      this.notify.warning('위치 확인을 지원하지 않는 기기입니다.');
    }
  }
  render(){
    const {visible} = this.state;
    const {address, environment, search, searchAddress} =this.props;
    return(
      <div className={styles.body}>
        <div className={styles.container}>
          <h2 className={styles.question}>어디에 있으신가요?</h2>
          <div className={styles.mainInput} tabIndex='-1' onClick={this.showModal} >
            {address.name?address.name:'검색해보세요.'}
          </div>
          <div className={styles.divider}/>
          <div className={styles.or}>or</div>
          <Button shape="circle" icon="compass" onClick={this.getLocation}/>
        </div>
        <Modal
          title="주소 찾기"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <AddressSearch visible={visible} search={search} searchAddress={searchAddress} onSelect={this.handleSearchComplete}/>
        </Modal>
        <Notify
          ref={ref=>this.notify = ref}/>
        <Button shape='circle' onClick={this.getNotify}>추가</Button>
        <Button shape='circle' onClick={this.clearNotify}>제거</Button>
      </div>
    );
  }
}
Home.propTypes = {
  address: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  getAddress: PropTypes.func.isRequired,

  latlon: PropTypes.object.isRequired,
  setLatlon: PropTypes.func.isRequired,
  getLatlon: PropTypes.func.isRequired,
  
  environment: PropTypes.object.isRequired,
  initEnvironment: PropTypes.func.isRequired,

  search: PropTypes.object.isRequired,
  searchAddress: PropTypes.func.isRequired,

  location : PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    address : state.data.address,
    latlon: state.data.latlon,
    search: state.search,
    environment: state.environment,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAddress: (lat,lon) => {
      return dispatch(getAddress(lat,lon));
    },
    setAddress: (address,name) => {
      dispatch(setAddress(address,name));
    },
    getLatlon: (address) => {
      return dispatch(getLatlon(address));
    },
    setLatlon: (lat,lon) => {
      dispatch(setLatlon(lat,lon));
    },
    searchAddress: (word, page) => {
      return dispatch(searchAddress(word, page));
    },
    initEnvironment: () => {
      dispatch(initEnvironment());
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);