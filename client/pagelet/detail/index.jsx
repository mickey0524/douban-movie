import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import fetch from 'isomorphic-fetch';
import echarts from 'echarts';
import wordCloud from 'echarts-wordcloud';
import './index.less';

// var echarts = require('echarts');
// require('echarts-wordcloud');

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
    // this.colorSet = ['#EDD8CB','#BFC0C3','#F59595','#8ECA51','#DFE0E1','#F6CBAD','#BAD4AD','#75839D','#89A9C8','#BFC0C3','#F59595','#8ECA51','#DFE0E1','#f3f9f1',  '#BAD4AD','#75839D','#89A9C8','#BFC0C3'];
    this.cloudOption = {
      title : {
        text: '词云',
        x:'center'
      },
      series: [{
        type: 'wordCloud',
        shape: 'cardioid',
        // maskImage: maskImage,
        left: 'center',
        top: 'center',
        width: '50%',
        height: '50%',
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          normal: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            }
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        data: [{
          name: 'Farrah Abraham',
          value: 366,
        }]
      }]
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
    this.getReviewCloud = this.getReviewCloud.bind(this);
    this.getCommentCloud = this.getCommentCloud.bind(this);
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
        this.getReviewCloud(data.data);
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
        this.getCommentCloud(data.data);
        commentChart.title.text = '短评单词频率分析';
        commentChart.series[0].data = data.data;
        this.setState({commentChart});
      }
    })
    .catch(err => {
      console.log('comment_word : ' + err);
    });
  }

  getReviewCloud(data) {
    // let cloudData = JSON.parse(JSON.stringify(data));
    // cloudData.forEach((item) => {
    //   item.visualMap = false;
    //   item.itemStyle = { normal: { color: '#DDD' }};
    // })
    // data = cloudData;
    let reviewCloudOption = JSON.parse(JSON.stringify(this.cloudOption));
    reviewCloudOption.title.text = '影评词云';
    reviewCloudOption.series[0].data = data;
    let cloudChart = echarts.init(this.reviewCloud);
    cloudChart.setOption(reviewCloudOption);
  }

  getCommentCloud(data) {
    let commentCloudOption = JSON.parse(JSON.stringify(this.cloudOption));
    commentCloudOption.title.text = '短评词云';
    commentCloudOption.series[0].data = data;
    let cloudChart = echarts.init(this.commentCloud);
    cloudChart.setOption(commentCloudOption);
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
          <div className="wordCloud" ref={(div) => { this.commentCloud = div; }}></div>
          <div className="wordCloud" ref={(div) => { this.reviewCloud = div; }}></div>
        </div>
      </div>
    )
  }
}

export default Main;