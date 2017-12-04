import React, { Component } from 'react';
import { RouterWrapper } from './';
import { TransitionGroup } from 'react-transition-group';
import styles from '../style/App.scss';
import '../style/transition.css';
class App extends Component {
  
  render(){
    return(
      <div className={styles.container}>
        <TransitionGroup className={styles.container}>
          <RouterWrapper />
        </TransitionGroup>
      </div>
    );
  }
}
export default App;