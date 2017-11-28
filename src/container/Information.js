import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import styles from '../style/Information.scss';

class Information extends Component {
  componentDidMount = () => {
    const {latlon, history} = this.props;
    if(this.props.latlon.status == 'INIT'){
      history.replace('/',{
        isRedirect: true,
      });
    }
  }
  render() {
    const {latlon, address} = this.props;
    return (
      <div className={styles.container}>
        {
          latlon.status == 'INIT'?
            null:
            <div style={{margin: 'auto', fontSize: 100}}>
              {address.name}
            </div>
        }
      </div>
    );
  }
}

Information.propTypes = {
  latlon: PropTypes.object.isRequired,
  
  address: PropTypes.object.isRequired,

  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return{
    latlon: state.data.latlon,
    address: state.data.address,
  };
};
const mapDispatchToProps = (dispatch) => {
  return{

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Information);
