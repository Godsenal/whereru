import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DaumAddressSearch extends Component {
  componentDidMount(){
    const script = document.createElement('script');
    script.src = this.props.scriptUrl;
    script.onload = () => {
      this.setState({isReady: true});
      this.initiate(this);
    };
    document.body.appendChild(script);
  }
  componentWillReceiveProps(nextProps){
    if(!this.props.visible && nextProps.visible){
      this.initiate(this, nextProps.screenWidth);
    }
  }
  initiate = (comp,width) => {
    window.daum.postcode.load(() => {
      const Postcode = new window.daum.Postcode({
        oncomplete: function oncomplete(data) {
          comp.props.handleSearchComplete(data, comp.props.autoClose);
        },
        onresize: function onresize(size) {
          if (comp.props.autoResize) comp.setState({ height: size.height });
        },
        theme: comp.props.theme,
        animation: comp.props.animation,
        autoMapping: comp.props.autoMapping,
        shorthand: comp.props.shorthand,
        pleaseReadGuide: comp.props.pleaseReadGuide,
        pleaseReadGuideTimer: comp.props.pleaseReadGuideTimer,
        maxSuggestItems: comp.props.maxSuggestItems,
        showMoreHName: comp.props.showMoreHName,
        hideMapBtn: comp.props.hideMapBtn,
        hideEngBtn: comp.props.hideEngBtn,
        width: width<1000?width * 0.8:width * 0.4,
        height: comp.props.height,
      });
      if(this.daumSearch){
        Postcode.embed(this.daumSearch);
      }
    });
  }
  
  render() {
    return (
      <div ref={(ref) => this.daumSearch = ref}>
        
      </div>
    );
  }
}
DaumAddressSearch.propTypes = {
  screenWidth: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  scriptUrl: PropTypes.string.isRequired,
};
DaumAddressSearch.defaultProps = {
  width: 570,
  height: 400,
  autoClose: true,
  autoResize: false,
  animation: false,
  autoMapping: true,
  shorthand: true,
  pleaseReadGuide: 0,
  pleaseReadGuideTimer: 1.5,
  maxSuggestItems: 10,
  showMoreHName: false,
  hideMapBtn: true,
  hideEngBtn: true,
  style: null,
  defaultQuery: null,
  theme: null,
  scriptUrl: 'http://dmaps.daum.net/map_js_init/postcode.v2.js?autoload=false',

  visible: false,
};