import React, {Component} from 'react';
import { Home } from './';
import styles from '../style/App.scss';

class App extends Component {
  
  render(){
    return(
      <div className={styles.container}>
        <Home/>
      </div>
    );
  }
}

export default App;