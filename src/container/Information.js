import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import {Table} from '../component';

import styles from '../style/Information.scss';

class Information extends Component {
  static propTypes = {
    latlon: PropTypes.object.isRequired,
    
    address: PropTypes.object.isRequired,
  
    history: PropTypes.object.isRequired,
  }
  render() {
    const {latlon, address} = this.props;
    if(this.props.latlon.status == 'INIT'){
      return <Redirect to={{pathname: '/', state:{isRedirect: true}}}/>;
    }
    return (
      <div className={styles.container}>
        <Table latlon={latlon} address={address}/>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return{
    latlon: state.data.latlon,
    address: state.data.address,
  };
};
export default connect(mapStateToProps)(Information);
