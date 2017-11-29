import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup} from 'react-transition-group';

import * as util from '../util/NotifyUtil';
import styles from '../style/notify.scss';
import '../style/transition.css';
import {Icon} from 'antd';
import FaExclamationCircle from 'react-icons/lib/fa/exclamation-circle';
import FaCheckCircle from 'react-icons/lib/fa/check-circle';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';

class Notification extends Component{
  static defaultProps = {
    message: 'Need to set message',
    children: '',
    classNames: 'boom',
    timeout: 500,
    mountOnEnter: true,
    unmountOnExit: true,
  };
  static propTypes = {
    message: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    type: PropTypes.string.isRequired,
    classNames: PropTypes.string.isRequired,
    timeout: PropTypes.number.isRequired,
    mountOnEnter: PropTypes.bool.isRequired,
    unmountOnExit: PropTypes.bool.isRequired,
  };
  render(){
    const {classNames, timeout, mountOnEnter, unmountOnExit, message, children, type} = this.props;
    return(
      <CSSTransition
        in={this.props.in}
        classNames={classNames}
        timeout={timeout}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}>
        {
          !children?
            <div className={styles.notifyWrapper}>
              <div className={styles.notify}>
                {
                  type == 'success'?
                    <FaCheckCircle className={styles.success}/>
                    :type == 'warning'?
                      <FaExclamationCircle className={styles.warning}/>
                      :type == 'error'?
                        <FaTimesCircle className={styles.error}/>
                        :type == 'loading'?
                          <Icon type="loading" className={styles.loading}/>
                          :''}
                &nbsp;&nbsp;{message}
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
const init =  {
  duration: 3000,
  callback : ()=>{}
};

export default class Notify extends Component{
  constructor(props){
    super(props);
    this.state = {
      notifications: [],
    };
  }
  success = (message,duration,callback) =>{
    return this.notify(message,'success',duration,callback);
  }
  warning = (message,duration,callback) =>{
    return this.notify(message,'warning',duration,callback);
  }
  error = (message,duration,callback) =>{
    return this.notify(message,'error',duration,callback);
  }
  loading = (message,duration,callback) =>{
    return this.notify(message,'loading',duration,callback);
  }

  notify = (message, type, duration = init.duration, callback = init.callback) => {
    //Check duration is exist or not.
    var newDuration = duration;
    var newCallback = callback;
    if(typeof duration === 'function'){
      newDuration = init.duration; // default
      newCallback = duration;
    }
    var id = util.generateToastId();
    this.setState(function(state,props){
      return {
        notifications: [...state.notifications, this.makeNotification(message, type, newDuration, newCallback, id)]
      };
    });
    return id;
  }
  
  makeNotification = (message, type, duration, callback, id) => {
    // if duration == 0 : doesn't remove notify until user want to remove.
    let timer = duration > 0 ? 
      setTimeout(()=>{
        this.removeNotify(id,true);
      }, duration):null;
    return {
      component: <Notification key={id} message={message} type={type} duration={duration}/>,
      timer,
      callback,
      id,
    };
  }
  removeNotify = (id,timeout = false) => { // timeout = true : remove with timeout, flase : remove directly
    this.setState(
      function(state, props){
        return {
          notifications: 
          state.notifications.filter(
            noti => {
              if(noti.id !== id) return true;
              else  {
                !timeout?clearTimeout(noti.timer):null; 
                noti.callback();
              }
            }) // Remove setTimeout declared in notify()
        };
      });
  }
  clearNotify = () => {
    clearTimeout();
    this.setState({
      notifications:
        this.state.notifications.filter(
          noti => {
            noti.callback();
          }
        )
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

