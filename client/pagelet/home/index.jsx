import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Photo from '../../common/photo/index.jsx';
import Loading from '../../common/loading/index.jsx';
import './index.less'

class Main extends Component {

  constructor(props) {
    super(props);
    this.isScroll = {
      reveal: false,
      popMovie: false,
      popTv: false
    }
    this.state = {
      isSupportWebp: false,
      reveal: [],
      popularMovie: [[]],
      popularTv: [[]],
      comment: [],
      revealPageNum: {
        curPageNum: 1,
        allPageNum: 0
      },
      popularMovieNum: {
        curPageNum: 0,
        allPageNum: []
      },
      popularTvNum: {
        curPageNum: 0,
        allPageNum: []
      }
    }
    this.getWebpSupport = this.getWebpSupport.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getRevealMovie = this.getRevealMovie.bind(this);
    this.getPopular = this.getPopular.bind(this);
    this.getComment = this.getComment.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.scrollAnimate = this.scrollAnimate.bind(this);
    this.onPageDotClick = this.onPageDotClick.bind(this);
  }

  getWebpSupport() {
    let img = new Image();
    let _this = this;
    function getResult(event) {
        //如果进入加载且图片宽度为1(通过图片宽度值判断图片是否可以显示)
      let isSupportWebp = event && event.type === 'load' ? img.width == 1 : false;
      _this.setState({ isSupportWebp });
    }
    img.onerror = getResult;
    img.onload = getResult;
    img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='; //一像素图片
  }

  getRevealMovie(data) {
    const REVEAL_MOVIE_NUM = 6;
    return new Promise((resolve, reject) => {
      data.forEach((item) => {
        item.imgUrl = item.imgUrl.slice(0, item.imgUrl.lastIndexOf('.')) + '.webp';
      })
      let revealGroupLen = Math.ceil(data.length / REVEAL_MOVIE_NUM);
      let revealPageNum = this.state.revealPageNum;
      revealPageNum.allPageNum = revealGroupLen;
      this.setState({
        revealPageNum
      });
      let firstGroup = data.slice(0, REVEAL_MOVIE_NUM);
      let lastGroup = data.slice(REVEAL_MOVIE_NUM * (revealGroupLen - 1));
      let lastGroupLen = lastGroup.length;
      let goRight = lastGroupLen == REVEAL_MOVIE_NUM ? 0 : (REVEAL_MOVIE_NUM - lastGroupLen) * 150;
      data[data.length - 1].rightDistance = goRight;
      lastGroup[lastGroupLen - 1].rightDistance = goRight;
      resolve([ ...lastGroup, ...data, ...firstGroup ]);
    });
  }

  getPopular(data, type) {
    const SLIDE_PAGE_NUM = 12;
    return new Promise((resolve, reject) => {
      let res = [],
          curNum = 0,
          curArr = [];
      let pageNum = Math.ceil(data.length / SLIDE_PAGE_NUM);
      let popularPageNum = this.state[type];
      popularPageNum.allPageNum = new Array(pageNum).fill(0);
      if (type == 'popularMovieNum') {
        this.setState({
          popularMovieNum: popularPageNum
        })
        this.popMovieContainer.style.width = (popularPageNum.allPageNum + 2) * 100 + '%';
        Array.from(this.popMovieContainer.getElementsByClassName('slide-page')).forEach((item) => {
          item.style.width = 100 / (popularPageNum.allPageNum + 2) + '%';
        });
      }
      else {
        this.setState({
          popularTvNum: popularPageNum
        })
        this.popTvContainer.style.width = (popularPageNum.allPageNum + 2) * 100 + '%';
        Array.from(this.popTvContainer.getElementsByClassName('slide-page')).forEach((item) => {
          item.style.width = 100 / (popularPageNum.allPageNum + 2) + '%';
        });
      }
      for (let i = 0, len = data.length; i < len; i++) {
        data[i].imgUrl = data[i].imgUrl.slice(0, data[i].imgUrl.lastIndexOf('.')) + '.webp';
        curNum += 1;
        curArr.push(data[i]);
        if (curNum == SLIDE_PAGE_NUM || i + 1 == len) {
          res.push(curArr);
          curNum = 0;
          curArr = [];
        }
      }
      res.unshift(res[res.length - 1]);
      res.push(res[1]);
      resolve(res);
    });
  }

  getComment(data) {
    return new Promise((resolve, reject) => {
      data.forEach((item) => {
        item.score = item.score.replace(/[^0-9]/g, '');
        if (this.state.isSupportWebp) {
          item.avatar = item.avatar.slice(0, item.avatar.lastIndexOf('.')) + '.webp';
        }
      });
      resolve(data);
    });
  }

  scrollHandler(direction, type) {
    if (this.isScroll[type]) {
      return ;
    }
    let cycleNum = type == 'reveal' ? (this.state.revealPageNum.allPageNum + 1) * 100 : type == 'popMovie' ? (this.state.popularMovieNum.allPageNum.length + 1) * 100 : (this.state.popularTvNum.allPageNum.length + 1) * 100;
    let el = type == 'reveal' ? this.revealContainer : type == 'popMovie' ? this.popMovieContainer : this.popTvContainer;
    direction = (direction == 'right' ? 1 : -1);
    this.scrollAnimate(cycleNum, el, type, direction);
  }

  fetchData() {
    const SLIDE_PAGE_NUM = 12,
          REVEAL_MOVIE_NUM = 6;
    fetch('/api/movie_index')
    .then(res => res.json())
    .then(data => {
      data = data.data;
      Promise.all([ this.getComment(data.popular_comment), this.getRevealMovie(data.reveal_movie), this.getPopular(data.popular_movie, 'popularMovieNum'), this.getPopular(data.popular_tv, 'popularTvNum') ])
      .then(value => {
        let [ comment, reveal, popularMovie, popularTv ] = value;
        this.setState({
          reveal,
          popularMovie,
          popularTv,
          comment
        });
        document.getElementsByClassName('loading')[0].style.display = 'none';
        document.getElementsByClassName('home-container')[0].style.display = 'block';
      })
    })
    .catch(err => {
      console.log('movie_index : ' + err);
    });
  }

  scrollAnimate(cycleNum, el, type, direction) {
    const SCROLL_SPEED = 4;
    if (type == 'reveal') {
      let pageNum = this.state.revealPageNum;
      let curPageNum = pageNum.curPageNum + direction;
      curPageNum = (curPageNum == pageNum.allPageNum + 1) ? 1 : (curPageNum == 0) ? pageNum.allPageNum : curPageNum;
      pageNum.curPageNum = curPageNum;
      this.setState({ revealPageNum: pageNum });
    }
    else if (type == 'popMovie') {
      let pageNum = this.state.popularMovieNum;
      let curPageNum = pageNum.curPageNum + direction;
      curPageNum = (curPageNum == pageNum.allPageNum.length) ? 0 : (curPageNum == -1) ? pageNum.allPageNum.length - 1 : curPageNum;
      pageNum.curPageNum = curPageNum;
      this.setState({ popularMovieNum: pageNum });
    }
    else {
      let pageNum = this.state.popularTvNum;
      let curPageNum = pageNum.curPageNum + direction;
      curPageNum = (curPageNum == pageNum.allPageNum.length) ? 0 : (curPageNum == -1) ? pageNum.allPageNum.length - 1 : curPageNum;
      pageNum.curPageNum = curPageNum;
      this.setState({ popularTvNum: pageNum });
    }
    direction *= SCROLL_SPEED;   //滚动速度
    this.isScroll[type] = true;
    let curLeft = Number(el.style.left.replace(/[^0-9]/g, ''));
    let proNum = 0;
    let step = () => {
      if (proNum < 100 / SCROLL_SPEED) {
        proNum += 1;
        let nowPrecent = -(curLeft + proNum * direction);
        el.style.left = nowPrecent + '%';
        if (nowPrecent <= -cycleNum) {
          el.style.left = '-100%';
        }
        if (nowPrecent >= 0) {
          el.style.left = -(cycleNum - 100) + '%';
        }
        requestAnimationFrame(step);
      }
      else {
        this.isScroll[type] = false;
      }
    }
    requestAnimationFrame(step);
  }

  onPageDotClick(index, type) {
    let el = type == 'popMovie' ? this.popMovieContainer : this.popTvContainer;
    let cycleNum = type == 'popMovie' ? (this.state.popularMovieNum.allPageNum.length + 1) * 100 : (this.state.popularTvNum.allPageNum.length + 1) * 100;
    let pageNum = type == 'popMovie' ? this.state.popularMovieNum : this.state.popularTvNum;
    let direction;
    if (pageNum.curPageNum == 0 && index == pageNum.allPageNum.length - 1) {
      direction = -1;
    }
    else if (pageNum.curPageNum == pageNum.allPageNum.length - 1 && index == 0) {
      direction = 1;
    }
    else {
      let sub = Math.abs(index - pageNum.curPageNum);
      direction = (index > pageNum.curPageNum) ? sub : -sub;
    }

    this.scrollAnimate(cycleNum, el, type, direction);
  }

  componentWillMount() {
    console.log('index');
  }

  componentDidMount() {
    this.getWebpSupport();
    this.fetchData();
    this.timer = setInterval(() => {
      if (!this.isScroll.reveal) {
        this.scrollAnimate((this.state.revealPageNum.allPageNum + 1) * 100, this.revealContainer, 'reveal', 1);
      }
    }, 20000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div id="home">
        <Loading ref={(loading) => { this.loading = loading; }}></Loading>
        <div className="home-container" ref={(homeContainer) => { this.homeContainer = homeContainer }}>
          <header>豆瓣电影分析</header>
          <div className="reveal-movie">
            <div className="reveal-title">
              <header>正在热映</header>
              <div className="page">
                <span className="cur-page">{this.state.revealPageNum.curPageNum}</span>
                <span className="all-page"> / {this.state.revealPageNum.allPageNum}</span>
                <span className="left" onClick={() => this.scrollHandler('left', 'reveal')}></span>
                <span className="right" onClick={() => this.scrollHandler('right', 'reveal')}></span>
              </div>
            </div>
            <div className="movie-container" ref={(div) => { this.revealContainer = div; }} style={{ left: '-100%' }}>
              {
                this.state.reveal.map((item, index) => {
                  return (
                    <a key={index} href={item.detailUrl} style={Object.assign({}, item.rightDistance && { marginRight: item.rightDistance + 'px' })}>
                      <Photo title={item.title} imgUrl={item.imgUrl} score={item.score}></Photo>
                    </a>
                  );
                })
              }
            </div>
          </div>
          <div className="cur-popular-movie">
            <header>最近热门电影</header>
            <div className="movie-container" ref={(div) => { this.popMovieContainer = div; }} style={{ left: '-100%' }}>
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
            <div className="page-num">
              <span className="left" onClick={() => this.scrollHandler('left', 'popMovie')}></span>
              <div className="num">
                {
                  this.state.popularMovieNum.allPageNum.map((item, index) => {
                    return (
                      <span key={index} onClick={() => this.onPageDotClick(index, 'popMovie')} className={(this.state.popularMovieNum.curPageNum == index) && 'active'}></span>
                    );
                  })
                }
              </div>
              <span className="right" onClick={() => this.scrollHandler('right', 'popMovie')}></span>
            </div>
          </div>
          <div className="cur-popular-tv">
            <header>最近热门电视剧</header>
            <div className="tv-container" ref={(div) => { this.popTvContainer = div; }} style={{ left: '-100%' }}>
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
            <div className="page-num">
              <span className="left" onClick={() => this.scrollHandler('left', 'popTv')}></span>
              <div className="num">
                {
                  this.state.popularMovieNum.allPageNum.map((item, index) => {
                    return (
                      <span key={index} onClick={() => this.onPageDotClick(index, 'popTv')} className={(this.state.popularTvNum.curPageNum == index) && 'active'}></span>
                    );
                  })
                }
              </div>
              <span className="right"  onClick={() => this.scrollHandler('right', 'popTv')}></span>
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