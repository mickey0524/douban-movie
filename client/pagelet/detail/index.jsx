import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import fetch from 'isomorphic-fetch';
import './index.less';

class Main extends Component {

  constructor(props) {
    super(props);
    this.baseOption = {
      title : {
        text: '南丁格尔玫瑰图',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      series : [
        {
          type:'pie',
          name: '单词频率',
          radius : [20, 80],
          center : ['50%', '50%'],
          roseType : 'area',
          data:[
            {value:10, name:'rose1'},
            {value:5, name:'rose2'},
            {value:15, name:'rose3'},
            {value:25, name:'rose4'},
            {value:20, name:'rose5'},
            {value:35, name:'rose6'},
            {value:30, name:'rose7'},
            {value:40, name:'rose8'}
          ]
        }
      ]
    }
    this.state = {
      name: '',
      movie_avatar: '',
      info: '',
      comments: [],
      actor_avatars: [],
      recommendations: [],
      reviews: [],
      score: '',
      score_people: '',
      score_ratio: [],
      summary: '',
      reviewChart: {series: []},
      commentChart: {series: []}
    }
    this.fetchData = this.fetchData.bind(this);
    this.getReviewWord = this.getReviewWord.bind(this);
    this.getCommentWord = this.getCommentWord.bind(this);
  }

  fetchData() {
    let url = window.location.href;
    let movieId = url.slice(url.indexOf('?') + 1);
    fetch(`/api/movie_detail?id=${movieId}`)
    .then(res => res.json())
    .then(data => {
      if (data.message == 'success') {
        this.setState(data.data);
        document.getElementsByClassName('detail-container')[0].style.display = 'block';
      }
    })
    .catch(err => {
      console.log('movie_detail : ' + err);
    });
  }

  getReviewWord() {
    let url = window.location.href;
    let movieId = url.slice(url.indexOf('?') + 1);
    fetch(`/api/review_word_frequency?id=${movieId}`)
    .then(res => res.json())
    .then(data => {
      if (data.message == 'success') {
        let reviewChart = JSON.parse(JSON.stringify(this.baseOption));
        reviewChart.title.text = '影评单词频率分析';
        reviewChart.series[0].data = data.data;
        this.setState({reviewChart});
      }
    })
    .catch(err => {
      console.log('review_word : ' + err);
    });
  }

  getCommentWord() {
    let url = window.location.href;
    let movieId = url.slice(url.indexOf('?') + 1);
    fetch(`/api/comment_word_frequency?id=${movieId}`)
    .then(res => res.json())
    .then(data => {
      if (data.message == 'success') {
        let commentChart = JSON.parse(JSON.stringify(this.baseOption));
        commentChart.title.text = '短评单词频率分析';
        commentChart.series[0].data = data.data;
        this.setState({commentChart});
      }
    })
    .catch(err => {
      console.log('comment_word : ' + err);
    });
  }

  componentWillMount() {
    console.log('detail');
  }

  componentDidMount() {
    this.fetchData();
    this.getReviewWord();
    this.getCommentWord();
  }

  render() {
    return (
      <div id="detail">
        <div className="detail-container">
          <header>豆瓣电影分析</header>
          <div className="movie-info">
            <h2>{this.state.name}</h2>
            <div className="info-container">
              <div className="movie-mes">
                <div className="movie-avatar">
                  <img src={this.state.movie_avatar} />
                </div>
                <div dangerouslySetInnerHTML={{__html: this.state.info}} />
              </div>
              <div className="movie-score">
                <header>豆瓣评分</header>
                <div className="score-num">
                  <div className="left">{this.state.score}</div>
                  <div className="right">{this.state.score_people}</div>
                </div>
                <div className="score-detail">
                  {
                    this.state.score_ratio.map((item, index) => {
                      return(
                        <div className="item" key={index}>
                          <span className="star-num">{5 - index}星</span>
                          <span className="bar" style={{width: item * 2 + 'px'}}></span>
                          <span>{item}%</span>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="summary">
            <header>剧情简介· · · · · ·</header>
            <div className="summary-container">
              {this.state.summary}
            </div>
          </div>
          <div className="actor">
            <header>影人· · · · · ·</header>
            <div className="actor-container">
              {
                this.state.actor_avatars.map((item, index) => {
                  return (
                    <div className="actor-item" key={index}>
                      <img src={item.avatar} />
                      <p className="name">{item.name}</p>
                      <p className="role">{item.role}</p>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="comment">
            <header>短评· · · · · ·</header>
            <div className="comment-container">
              {
                this.state.comments.map((item, index) => {
                  return (
                    <div className="comment-item" key={index}>
                      <div className="info">
                        <span className="name">{item.name}</span>
                        看过
                        <span className="score">{item.score}</span>
                        <span className="date">{item.date}</span>
                      </div>
                      <div className="content">
                        {item.content}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="review">
            <header>影评· · · · · ·</header>
            <div className="review-container">
              {
                this.state.reviews.map((item, index) => {
                  return (
                    <div className="review-item" key={index}>
                      <div className="title">
                        {item.title}
                      </div>
                      <div className="info">
                        <img className="avatar" src={item.avatar} />
                        <span className="name">{item.name}</span>
                        看过
                        <span className="score">{item.score}</span>
                        <span className="date">{item.date}</span>
                      </div>
                      <div className="content">
                        {item.content}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
        <div className="figure-group">
          <ReactEcharts option={this.state.commentChart} />
          <ReactEcharts option={this.state.reviewChart} />
        </div>
      </div>
    )
  }
}

export default Main;