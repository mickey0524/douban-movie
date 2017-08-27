import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Photo from '../../common/photo/index.jsx';
import Loading from '../../common/loading/index.jsx';
import './index.less'

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reveal: [],
      popularMovie: [[]],
      popularTv: [[]],
      comment: [],
    }
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData() {
    const SLIDE_PAGE_NUM = 12;
    fetch('/api/movie_index')
    .then(res => res.json())
    .then(data => {
      data = data.data;
      data.popular_comment.forEach((item) => {
        item.score = item.score.replace(/[^0-9]/g, '');
      });
      let popularMovie = [],
          popularTv = [],
          curNum = 0,
          curArr = [];
      for (let i = 0, len = data.popular_movie.length; i < len; i++) {
        curNum += 1;
        curArr.push(data.popular_movie[i]);
        if (curNum == SLIDE_PAGE_NUM || i + 1 == len) {
          popularMovie.push(curArr);
          curNum = 0;
          curArr = [];
        }
      }
      for (let i = 0, len = data.popular_movie.length; i < len; i++) {
        curNum += 1;
        curArr.push(data.popular_tv[i]);
        if (curNum == SLIDE_PAGE_NUM || i + 1 == len) {
          popularTv.push(curArr);
          curNum = 0;
          curArr = [];
        }
      }
      this.setState({
        reveal: data.reveal_movie,
        popularMovie,
        popularTv,
        comment: data.popular_comment
      })
      document.getElementById('loading').style.display = 'none';
      document.getElementsByClassName('home-container')[0].style.display = 'block';
    })
    .catch(err => {
      console.log('movie_index : ' + err);
    });
  }
  componentWillMount() {
    this.fetchData();
  }
  componentDidMount() {
    // let cycleNum = Math.ceil(this.state.reveal.length / 6 + 1) * 100;
    let cycleNum = 500;
    this.timer = setInterval(() => {
      let curLeft = Number(this.movieContainer.style.left.replace(/[^0-9]/g, ''));
      let proNum = 0;
      //console.log(curLeft);
      let step = () => {
        if (proNum < 100) {
          proNum += 1;
          let nowPrecent = -(curLeft + proNum);
          // else {
          this.movieContainer.style.left = nowPrecent + '%';
          // }
          if (nowPrecent <= -cycleNum) {
            //proNum = 0;
            //curLeft = 0;
            this.movieContainer.style.left = '-100%';
          }
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    let revealGroupLen = Math.ceil(this.state.reveal.length / 6);
    let lastGroup = this.state.reveal.slice(6 * (revealGroupLen - 1));
    let lastGroupLen = lastGroup.length;
    let goRight = lastGroupLen == 6 ? 0 : (6 - lastGroupLen) * 150;
    let curRevealArr = this.state.reveal.map((item, index) => {
      return (
        <a href={item.detailUrl} key={'cur' + index} style={Object.assign({}, (index == this.state.reveal.length - 1) && { marginRight: goRight + 'px' })}>
          <Photo title={item.title} imgUrl={item.imgUrl} score={item.score}></Photo>
        </a>
      );
    });
    let leftRevealArr = lastGroup.map((item, index) => {
      return (
        <a href={item.detailUrl} key={'left' + index} style={Object.assign({}, (index == lastGroupLen - 1) && { marginRight: goRight + 'px' })}>
          <Photo title={item.title} imgUrl={item.imgUrl} score={item.score}></Photo>
        </a>
      );
    });
    let rightRevealArr = this.state.reveal.slice(0, 6).map((item, index) => {
      return (
        <a href={item.detailUrl} key={'right' + index}>
          <Photo title={item.title} imgUrl={item.imgUrl} score={item.score}></Photo>
        </a>
      );
    });
    let revealArr = [ ...leftRevealArr, ...curRevealArr, ...rightRevealArr ];
    return (
      <div id="home">
        <Loading ref={(loading) => { this.loading = loading; }}></Loading>
        <div className="home-container" ref={(homeContainer) => { this.homeContainer = homeContainer }}>
          <header>豆瓣电影分析</header>
          <div className="reveal-movie">
            <div className="reveal-title">
              <header>正在热映</header>
              <div className="page">
                <span className="cur-page">1</span>
                <span className="all-page"> / 12</span>
                <span className="left"></span>
                <span className="right"></span>
              </div>
            </div>
            <div className="movie-container" ref={(div) => { this.movieContainer = div; }} style={{ left: '-100%' }}>
              { revealArr }
            </div>
          </div>
          <div className="cur-popular-movie">
            <header>最近热门电影</header>
            <div className="movie-container">
              {
                this.state.popularMovie.map((pageItem, pageIndex) => {
                  return (
                    <div className="slide-page" key={pageIndex}>
                      {
                        pageItem.map((movieItem, movieIndex) => {
                          {
                            return (
                              <a key={movieIndex} href={movieItem.detailUrl}>
                                <Photo title={movieItem.title} imgUrl={movieItem.imgUrl} score={movieItem.score}></Photo>
                              </a>
                            );
                          }
                        })
                      }
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="cur-popular-tv">
            <header>最近热门电视剧</header>
            <div className="tv-container">
              {
                this.state.popularTv.map((pageItem, pageIndex) => {
                  return (
                    <div className="slide-page" key={pageIndex}>
                      {
                        pageItem.map((tvItem, tvIndex) => {
                          {
                            return (
                              <a key={tvIndex} href={tvItem.detailUrl}>
                                <Photo title={tvItem.title} imgUrl={tvItem.imgUrl} score={tvItem.score}></Photo>
                              </a>
                            );
                          }
                        })
                      }
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="popular-comment">
            <header>最受欢迎的影评</header>
            <div className="comment-container">
            {
              this.state.comment.map((item, index) => {
                return (
                  <div className="comment-item" key={index}>
                    <div className="comment-avatar">
                      <img src={item.avatar} />
                    </div>
                    <div className="comment-mes">
                      <p className="title">{item.title}</p>
                      <p className="user-name">
                        <span>{item.user} 评论 </span>
                        <span>{item.name}</span>
                        <span> {item.score}</span>
                      </p>
                      <p className="content">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Main;