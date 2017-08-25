import React, { Component } from 'react';
import Photo from '../../common/photo/index.jsx';
import './index.less'

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reveal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      popular: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [1, 2, 3]
      ],
      comment: [
        {
          avatar: 'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2494275707.webp',
          title: '第一期潜力',
          user: '熊猫宝宝',
          name: '极速前进 第四季',
          score: '10',
          content: '剪辑真的不怎么样，没有好好介绍嘉宾，匆匆带过。48固定嘉宾了，两个小男孩是什么鬼，从事什么职业啊。乱七八糟的开始了。还没看到实力的一对。这么多季下来，历任都是男女搭配干活不累，智商令人，勇夺冠军。夫'
        },
        {
          avatar: 'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2494275707.webp',
          title: '第一期潜力',
          user: '熊猫宝宝',
          name: '极速前进 第四季',
          score: '10',
          content: '剪辑真的不怎么样，没有好好介绍嘉宾，匆匆带过。48固定嘉宾了，两个小男孩是什么鬼，从事什么职业啊。乱七八糟的开始了。还没看到实力的一对。这么多季下来，历任都是男女搭配干活不累，智商令人，勇夺冠军。夫'
        }
      ]
    }
  }

  render() {
    return (
      <div id="home">
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
          <div className="movie-container">
            {
              this.state.reveal.map((item, index) => {
                return (
                  <a href="https://movie.douban.com/subject/26363254/?from=showing" key={index}><Photo title={index.toString()}></Photo></a>
                );
              })
            }
          </div>
        </div>
        <div className="cur-popular-movie">
          <header>最近热门电影</header>
          <div className="movie-container">
            {
              this.state.popular.map((pageItem, pageIndex) => {
                return (
                  <div className="slide-page" key={pageIndex}>
                    {
                      pageItem.map((movieItem, movieIndex) => {
                        {
                          return (
                            <a key={movieIndex} href="https://movie.douban.com/subject/26363254/?from=showing"><Photo></Photo></a>
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
              this.state.popular.map((pageItem, pageIndex) => {
                return (
                  <div className="slide-page" key={pageIndex}>
                    {
                      pageItem.map((tvItem, tvIndex) => {
                        {
                          return (
                            <a key={tvIndex} href="https://movie.douban.com/subject/26363254/?from=showing"><Photo></Photo></a>
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
    )
  }
}

export default Main;