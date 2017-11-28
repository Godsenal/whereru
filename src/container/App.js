import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  Route, Switch, withRouter} from 'react-router-dom';
import { Home, Information } from './';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from '../style/App.scss';
import '../style/transition.css';
class App extends Component {
  
  render(){
    const currentKey = location.pathname.split('/')[1] || '/';
    return(
      <div className={styles.container}>
        <TransitionGroup>
          <CSSTransition
            key={currentKey} 
            timeout={800} 
            classNames="fade" 
            mountOnEnter={true} 
            unmountOnExit={true}>
            <div>
              <Switch location={this.props.location}>
                <Route exact path="/" component={Home}/>
                <Route path="/information" component={Information}/>
              </Switch>
            </div>
          </CSSTransition>
          
        </TransitionGroup>
      </div>
    );
  }
}
App.defaultProps = {
  location : {},
};
App.propTypes = {
  location : PropTypes.object.isRequired,
};
export default withRouter(App);