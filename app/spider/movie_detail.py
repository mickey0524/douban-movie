import requests
import re
from pyquery import PyQuery as pq
from lxml.html import fromstring
from multiprocessing.dummy import Pool as ThreadPool

class Movie_detail(object):

  def __init__(self, movie_id):
    self.url = 'https://movie.douban.com/subject/' + movie_id + '/'
    self.user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
    self.referer = 'https://movie.douban.com/'
    self.headers = { 'User-Agent': self.user_agent, 'Referer': self.referer }
    self._get_page_source()

  def _get_page_source(self):
    r = requests.get(self.url, headers = self.headers)
    r.encoding = 'utf-8'
    page_source = r.text
    self.doc = pq(fromstring(page_source))

  def _get_info(self):
    info = {
      'name': self.doc('#content').children('h1').text(),
      'movie_avatar': self.doc('#mainpic img').attr('src'),
      'info': self.doc('#info').outerHtml(),
      'score': self.doc('.rating_wrap .rating_num').text(),
      'score_people': self.doc('.rating_wrap .rating_people').text()
    }
    score_ratio = []
    for item in self.doc('.rating_wrap .ratings-on-weight .item').items():
      score_ratio.append(item('.rating_per').text()[:-1])
    info['score_ratio'] = score_ratio
    return info

  def _get_summary(self):
    summary = {
      'summary': self.doc('.related-info').find('#link-report').text(),
    }
    actor_avatars = []
    for item in self.doc('#celebrities li').items():
      actor_avatars.append({
        'avatar': re.sub(r'.*url\(', '', item.find('.avatar').attr('style'))[:-1],
        'name': item('.info .name a').text(),
        'role': item('.info .role').text()
      })
    summary['actor_avatars'] = actor_avatars
    return summary

  def _get_recommendation(self):
    recommendations, res = [], {}
    for item in self.doc('#recommendations .recommendations-bd dl').items():
      recommendations.append({
        'avatar': item('dt img').attr('src'),
        'name': item('dd').text()
      })
    res['recommendations'] = recommendations
    return res

  def _get_comment(self):
    comments, res = [], {}
    for item in self.doc('#comments-section #hot-comments .comment-item').items():
      info = item('.comment .comment-info')
      score = info('.rating').attr('class')
      if score:
        score = re.sub(r'rating|allstar', '', score).strip()
      else:
        score = ''
      comments.append({
        'name': info('a').text(),
        'score': score,
        'date': info('.comment-time ').text(),
        'content': item('.comment p').text()
      })
    res['comments'] = comments
    return res

  def _get_review(self):
    reviews, res = [], {}
    for item in self.doc('.reviews .review-list .review-item').items():
      info = item('.main-hd')
      reviews.append({
        'title': info('.title').text(),
        'avatar': info('.author-avatar img').attr('src'),
        'name': info('.author').text(),
        'score': re.sub(r'main-title-rating|allstar', '', info('.main-title-rating').attr('class')).strip(),
        'date': info('.main-meta').text(),
        'content': re.sub(r'\.\.\..*', '', item('.main-bd .short-content').text())
      })
    res['reviews'] = reviews
    return res


  def get_movies(self):
    pool = ThreadPool(8)

    info = pool.apply_async(self._get_info)

    summary = pool.apply_async(self._get_summary)

    recommendations = pool.apply_async(self._get_recommendation)

    comments = pool.apply_async(self._get_comment)

    reviews = pool.apply_async(self._get_review)

    pool.close()
    pool.join()

    result = {}
    result.update(info.get())
    result.update(summary.get())
    result.update(recommendations.get())
    result.update(comments.get())
    result.update(reviews.get())


    return result
