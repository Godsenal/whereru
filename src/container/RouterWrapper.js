import React from 'react';
import PropTypes from 'prop-types';
import { Home, Information } from './';
import {  Route, Switch, withRouter} from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import '../style/transition.css';

const RouterWrapper = (props) => {
  const currentKey = location.pathname.split('/')[1] || '/';

  return(
    <CSSTransition
      in={props.in}
      key={currentKey} 
      timeout={800} 
      classNames="fade" 
      mountOnEnter={true} 
      unmountOnExit={true}>
      <div>
        <Switch location={props.location}>
          <Route exact path="/" component={Home}/>
          <Route path="/information" component={Information}/>
        </Switch>
      </div>
    </CSSTransition>
  );
};

RouterWrapper.defaultProps = {
  location : {},
  in: false,
};
RouterWrapper.propTypes = {
  location : PropTypes.object.isRequired,
  in: PropTypes.bool.isRequired,
};
export default withRouter(RouterWrapper);