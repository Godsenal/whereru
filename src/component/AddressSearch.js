import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Pagination, Icon} from 'antd';
import styles from '../style/AddressSearch.scss';
export default class AddressSearch extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    search: PropTypes.object.isRequired,
    searchAddress: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  }
  state = {
    isInitial: true,
    word: '',
    page: 1,
  }
  componentDidMount = () => {
    this.input?this.input.focus():null;
  }
  
  componentWillReceiveProps = (nextProps) => {
    if(!this.props.visible && nextProps.visible){
      this.setState({
        isInitial: true,
        page: 1,
        word: '',
      });
    }
  }
  
  handleChange = (e) => {
    this.setState({
      word: e.target.value, 
    });
  }
  handlePagination = (page, pageSize) => {
    if(this.state.page == page){
      return ;
    }
    this.props.searchAddress(this.state.word,page);
    this.setState({
      page,
    });
  }
  handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      this.props.searchAddress(this.state.word)
        .then(()=>{
          this.setState({
            isInitial: false,
          });
        });
    }
  }
  handleSelect = (data) => {
    this.props.onSelect(data);
  }
  renderTip = (isInitial = false) => {
    return(
      <div className={styles.noresult}>
        {!isInitial?<p style={{fontSize: 20, fontWeight: 800, color: 'black'}}>검색 결과가 없습니다.</p>:null}
        <p style={{fontSize: 20, fontWeight: 800, marginTop: 20}}>Tip.</p>
        <p style={{color: 'black'}}>다음과 같은 조합으로 입력하세요.</p>
        <p style={{marginTop: 20}}>1. 도로명 + 건물번호 </p>
        <p>예) 판교역로 235</p>
        <p>2. 지역명(동/리) + 번지 </p>
        <p>예) 삼평동 681</p>
      </div>
    );
  }
  renderSearchResult = () => {
    const {search} = this.props;
    if(search.status === 'WAITING'){
      return null;
    }
    else if(search.status === 'SUCCESS' && search.documents.length > 0){
      return search.documents.map((result, index)=>{
        const {address, road_address} = result;
        let hasRoad = road_address?true:false;
        return( 
          <div key={index} className={styles.listWrapper}>
            {hasRoad?
              <div className={styles.zipCode}>
                <span>{road_address.zone_no}</span>
                <span>({address.zip_code.substr(0,3) + '-' + address.zip_code.substr(3,3)})</span>
              </div>
              :<div className={styles.warning}>
                * 조금 더 구체적인 주소를 입력해주세요.
              </div>}
            {hasRoad?<div className={styles.list}><span className={styles.category}>도로명 주소 : </span><a onClick={() => this.handleSelect(road_address)} className={styles.address}>{road_address.address_name}</a></div>: null}
            <div className={styles.list}><span className={styles.category}>지번 주소 : </span><a onClick={() => this.handleSelect(address)} className={styles.address}>{address.address_name}</a></div>
          </div>
        );
      });
    }
    else{
      return this.renderTip();
    }
  }
  render() {
    const {word, page, isInitial} = this.state;
    const {search} = this.props;
    return (
      <div className={styles.container}>
        <input ref={(ref)=>this.input = ref} className={styles.input} value={word} onChange={this.handleChange} placeholder='예) 화정동 925' onKeyPress={this.handleKeyPress}/>
        <div className={styles.listContainer}>
          {isInitial?
            this.renderTip(true)
            :this.renderSearchResult()}
        </div>
        {!isInitial?
          <Pagination className={styles.pagination} onChange={this.handlePagination} current={page} total={search.count}/>: null
        }
        
      </div>
    );
  }
}
