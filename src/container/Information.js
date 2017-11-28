import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
  Route,
  Redirect,
} from 'react-router-dom'
class Information extends Component {
  componentDidMount = () => {
    console.log(this.props.location);
  }
  render() {
    const {latlon} = this.props;
    if(latlon.status == 'INIT'){
      return(
        <Redirect to = '/'/>
      );
    }
    else{
      return (
        <div style={{margin: 'auto', fontSize: 100}}>
          Hello.
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return{
    latlon: state.data.latlon,
  };
};
const mapDispatchToProps = (dispatch) => {
  return{

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Information);
