import React, { Component } from 'react';
import {  Route, Switch, withRouter} from 'react-router-dom';
import { Home, Information } from './';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from '../style/App.scss';

class App extends Component {
  
  render(){
    return(
      <div className={styles.container}>
        <TransitionGroup
        >
          <CSSTransition
            key={this.props.location.key} 
            timeout={500} 
            classNames="fade" 
            mountOnEnter={true} 
            unmountOnExit={true}>
            <div>
              <Switch  location={this.props.location}>
                <Route path="/" component={Home}/>
                <Route path="/information" component={Information}/>
              </Switch>
            </div>
          </CSSTransition>
          
        </TransitionGroup>
      </div>
    );
  }
}

export default withRouter(App);