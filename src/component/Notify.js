import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { CSSTransition} from 'react-transition-group';
import styles from '../style/notify.scss';
import '../style/transition.css';
import FaExclamationCircle from 'react-icons/lib/fa/exclamation-circle';
import FaCheckCircle from 'react-icons/lib/fa/check-circle';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';
export default class Notify extends Component{
  constructor(props){
    super(props);
    this.state = {
      show: false,
      message: '',
      type: ''
    };
  }
  notify = (message = '메시지를 설정해주세요.', type = '', duration = 3000) => {
    this.setState({
      show: true,
      message,
      type,
    });
    setTimeout(()=>{
      this.setState({
        show: false,
      });
    },duration);
  }
  render(){
    const {show, type, message} = this.state;
    const props = this.props;
    return(
      <CSSTransition
        in={show}
        classNames={props.classNames}
        timeout={props.timeout}
        mountOnEnter={props.mountOnEnter}
        unmountOnExit={props.unmountOnExit}>
        {
          !props.children?
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
              {props.children}
            </div>
        }
      </CSSTransition>
    );
  }
  
};

Notify.defaultProps = {
  classNames: 'boom',
  timeout: 500,
  mountOnEnter: true,
  unmountOnExit: true,
};
Notify.propTypes = {
  classNames: PropTypes.string.isRequired,
  timeout: PropTypes.number.isRequired,
  mountOnEnter: PropTypes.bool.isRequired,
  unmountOnExit: PropTypes.bool.isRequired,
};
