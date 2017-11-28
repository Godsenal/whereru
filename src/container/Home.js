import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Modal, Button, message} from 'antd';
import styles from '../style/Home.scss';

import {DaumAddressSearch} from '../component';
import {getAddress, setAddress, getLatlon, setLatlon} from '../action/data';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isReady : false,
    };
  }
  componentDidMount = () => {
    console.log(this.props.location)
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
          console.log(this.props.latlon);
        });
  }
  getLocation = () => {
    if (navigator.geolocation) {
      const msg = message.loading('loading', 0);
      navigator.geolocation.getCurrentPosition(
        position=>{
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          this.props.setLatlon(lat, lon);
          this.props.getAddress(lat, lon)
            .then(
              res=>{
                setTimeout(msg, 0);
              },
              error=>{
                setTimeout(msg, 0);
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
      message.info('This is a normal message');
    }
  }
  render(){
    const {visible} = this.state;
    const {address} =this.props;
    return(
      <div>
        <div className={styles.container}>
          <h2 className={styles.question}>어디에 있나요?</h2>
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