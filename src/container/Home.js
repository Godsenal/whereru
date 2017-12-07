import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Button} from 'antd';
import classNames from 'classnames/bind';
import styles from '../style/Home.scss';
import {DaumAddressSearch, Notify, Modal} from '../component';
import {getAddress, setAddress, getLatlon, setLatlon} from '../action/data';
import {initEnvironment} from '../action/environment';

const cx = classNames.bind(styles);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      notify: false,
      isReady : false,
    };
  }
  /*
  componentDidMount = () => {
    window.addEventListener('resize',this.props.initEnvironment);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.props.initEnvironment);
  }
  */
  componentDidMount = () => {
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
  handleClose = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleSearchComplete = (data) => {
    this.props.setAddress(data, data.address);
    this.setState({
      visible: false,
    });
    this.props.getLatlon(data.address)
      .then(()=>{
        if(this.props.latlon.status === 'SUCCESS'){
          this.notify.success('검색 완료!',2000,()=>{
            this.props.history.push('/information');
          });
        }
        else{
          this.notify.error('검색 실패! 다시 한번 검색해주세요.',2000);
        }
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
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
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
        },options);
      
    } else {
      this.notify.warning('위치 확인을 지원하지 않는 기기입니다.');
    }
  }
  render(){
    const footerAction = [<Button key={1} onClick={this.handleClose}>닫기</Button>];
    const {visible} = this.state;
    const {address} =this.props;
    return(
      <div className={styles.body}>
        <div className={styles.container}>
          <h2 className={cx('title')}>WHERE ARE YOU?</h2>

          <div className={cx('questionWrapper')}>
            <p className={styles.question}>위치를 지정해주세요.</p>
            <p className={styles.question}>정해진 위치로 주변 정보들을 보여드립니다.</p>
          </div>
          <div className={styles.inputContainer}>
            <button className={styles.button} onClick={this.showModal}>
              주소로 검색
            </button>
            <button className={styles.button} onClick={this.getLocation}>
              현재 위치 지정
            </button>
          </div>
        </div>
        <Modal
          title='주소 검색'
          visible={visible}
          handleClose={this.handleClose}
          footer={footerAction}
        >
          <DaumAddressSearch visible={visible} handleSearchComplete={this.handleSearchComplete}/>
        </Modal>
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

  backHome: PropTypes.func.isRequired,
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
    setAddress: (address,name) => {
      dispatch(setAddress(address,name));
    },
    getLatlon: (address) => {
      return dispatch(getLatlon(address));
    },
    setLatlon: (lat,lon) => {
      dispatch(setLatlon(lat,lon));
    },
    initEnvironment: () => {
      dispatch(initEnvironment());
    },
    backHome: () => {
      dispatch({
        type: 'BACK_HOME'
      });
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);