import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.less';

class Main extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="photo">
        <img src={this.props.imgUrl} />
        <div className="movie-title">{ this.props.title } </div>
        <div className="star-num">
          { this.props.starNum != '暂无评分' && <span className="star"></span> }
          { this.props.starNum != '暂无评分' && <span className="star full-star" style={{ width: this.props.starNum * 7 + 'px' }}></span> }
          <span className="num">{ this.props.starNum }</span>
        </div>
      </div>
    )
  }
}

Main.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  starNum: PropTypes.string.isRequired
}

Main.defaultProps = {
  imgUrl: "https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2485983612.webp",
  title: "战狼2",
  starNum: "5.0"
}

export default Main;