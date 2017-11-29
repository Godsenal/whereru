import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Modal, Button, message} from 'antd';

import styles from '../style/Home.scss';
import {DaumAddressSearch, Notify} from '../component';
import {getAddress, setAddress, getLatlon, setLatlon} from '../action/data';

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
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.location.state && nextProps.location.state.isRedirect){
      this.props.history.replace('/',undefined);
      this.notify.notify('먼저 위치를 설정해주세요.','warning',3000);
      this.notify.notify('먼저 ff 설정해주세요.','warning',3000);
      this.notify.notify('먼저 위치를 qq.','warning',3000);

    }
  }
  getNotify = () =>{
    this.notify.notify('먼저 위치를 qq.','warning',3000);
  }
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
  handleSearchComplete = (data, autoClose) => {
    this.props.setAddress(data);
    if(autoClose){
      this.setState({
        data,
        visible: false,
      });
    }
    this.props.getLatlon(data.address)
      .then(
        res=>{
          this.props.history.push('/information');
        });
  }
  getLocation = () => {
    if (navigator.geolocation) {
      const msg = message.loading('주소를 가져오는 중...', 0);
      navigator.geolocation.getCurrentPosition(
        position=>{
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          this.props.setLatlon(lat, lon);
          this.props.getAddress(lat, lon)
            .then(
              res=>{
                setTimeout(msg, 0);
                message.success('주소 불러오기 성공.',1,()=>{
                  this.props.history.push('/information');
                });
              },
              error=>{
                setTimeout(msg, 0);
                message.error('주소 불러오기 실패. 다시 시도해 주세요.');
              }
            );
        },
        error=>{
          setTimeout(msg, 0);
          message.error('위치 확인 권한을 허용한 후 다시 눌러주세요.');
        });
      
    } else {
      message.config({
        top: 300,
        duration: 2,
      });
      message.info('위치 확인을 지원하지 않는 기기입니다.');
    }
  }
  render(){
    const {visible, notify} = this.state;
    const {address} =this.props;
    return(
      <div className={styles.body}>
        <div className={styles.container}>
          <h2 className={styles.question}>어디에 있으신가요?</h2>
          <input className={styles.mainInput} placeholder='검색해보세요.' readOnly onClick={this.showModal} value={address.name}/>
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
          <DaumAddressSearch visible={visible} handleSearchComplete={this.handleSearchComplete}/>
        </Modal>
        <Button shape="circle" onClick={this.getNotify} />
        <Notify
          ref={ref=>this.notify = ref}/>
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
  
  location : PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    address : state.data.address,
    latlon: state.data.latlon,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAddress: (lat,lon) => {
      return dispatch(getAddress(lat,lon));
    },
    setAddress: (address) => {
      dispatch(setAddress(address));
    },
    getLatlon: (address) => {
      return dispatch(getLatlon(address));
    },
    setLatlon: (lat,lon) => {
      dispatch(setLatlon(lat,lon));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);