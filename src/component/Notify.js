import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup} from 'react-transition-group';

import * as util from '../util/NotifyUtil';
import styles from '../style/notify.scss';
import '../style/transition.css';
import FaExclamationCircle from 'react-icons/lib/fa/exclamation-circle';
import FaCheckCircle from 'react-icons/lib/fa/check-circle';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';

class Notification extends Component{
  static defaultProps = {
    classNames: 'boom',
    timeout: 500,
    mountOnEnter: true,
    unmountOnExit: true,
  };
  static propTypes = {
    classNames: PropTypes.string.isRequired,
    timeout: PropTypes.number.isRequired,
    mountOnEnter: PropTypes.bool.isRequired,
    unmountOnExit: PropTypes.bool.isRequired,
  };
  state = {
    in : true,
  }
  componentDidMount(){
    setTimeout(()=>{
      this.setState((state, props)=>{
        return {
          in: false
        };
      });
    },this.props.duration);
  }
  render(){
    const {key, classNames, timeout, mountOnEnter, unmountOnExit, id, message, children, handleRemove, type} = this.props;
    return(
      <CSSTransition
        in={this.state.in}
        classNames={classNames}
        timeout={timeout}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        onExited={()=>{handleRemove(id);}}>
        {
          !children?
            <div className={styles.notifyWrapper}>
              <div className={styles.notify}>
                {type == 'success'?
                  <FaCheckCircle className={styles.success} style={{verticalAlign: 'baseline'}}/>
                  :type == 'warning'?
                    <FaExclamationCircle className={styles.warning} style={{verticalAlign: 'baseline'}}/>
                    :type == 'error'?
                      <FaTimesCircle className={styles.error} style={{verticalAlign: 'baseline'}}/>
                      :''}
                &nbsp;{message}
              </div>
            </div>
            :
            <div className={styles.notifyWrapper}>
              {children}
            </div>
        }
      </CSSTransition>
    );
  }
  
  
}
export default class Notify extends Component{
  constructor(props){
    super(props);
    this.state = {
      show: false,
      message: '',
      type: '',
      id: 0,
      notifications: [],
    };
  }
  notify = (message = '메시지를 설정해주세요.', type = '', duration = 3000) => {
    this.setState(function(state,props){
      let key = util.generateToastId();
      return {
        id: state.id + 1,
        notifications: [...state.notifications, this.makeNotification(message, type, duration,key)]
      };
    });
  }
  makeNotification = (message, type, duration, key) => {
    return {
      component: <Notification key={key} id={key} message={message} type={type} duration={duration} handleRemove={this.handleRemove}/>,
      id: key
    };
  }
  handleRemove = (key) => {
    console.log(key);
    this.setState(
      function(state, props){
        return {
          notifications: state.notifications.filter(noti => noti.id !== key)
        };
      });
  }
  renderNotification = () => {
    return (
      this.state.notifications.map((noti,index) => {
        return noti.component;
      })
    );
  }
  render(){
    return(
      <TransitionGroup className={styles.transitionContainer}>
        {this.renderNotification()}
      </TransitionGroup>
    );
  }
  
}

