import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import styles from '../style/Modal.scss';
import '../style/transition.css';
export default class Modal extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    footer: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  }
  static defaultProps = {
    width: 350,
    height: 400,
    title: '',
    footer: [],
  }
  handleClose = (e, el = 'wrapper') => {
    if(el === 'container'){
      this.props.handleClose();
    }
    else{
      e.stopPropagation();
    }
  }
  render() {
    const {visible, title, footer} = this.props;
    return (
      <CSSTransition
        in={visible}
        timeout={300}
        classNames='boom'
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <div 
          className={styles.container} 
          onClick={(e)=>this.handleClose(e,'container')}>
          <div 
            className={styles.wrapper}
            onClick={this.handleClose}>
            {title? <div className={styles.header}>{title}</div> : null}
            <div className={styles.body}>
              {this.props.children}
            </div>
            {footer ?<div className={styles.footer}>{footer.map((comp, i)=> <div key={i}>{comp}</div>)}</div> : null}
          </div>
        </div>
      </CSSTransition>
    );
  }
}
