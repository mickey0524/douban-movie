import requests
import json
import re
from pyquery import PyQuery as pq
from lxml.html import fromstring

class Movie_index(object):

  def __init__(self):
    self.url = 'https://movie.douban.com/'
    self.popular_movie_url = 'https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=40&page_start=0'
    self.popular_tv_url = 'https://movie.douban.com/j/search_subjects?type=tv&tag=%E7%83%AD%E9%97%A8&page_limit=40&page_start=0'
    self.user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
    self.referer = 'https://movie.douban.com/'
    self.headers = { 'User-Agent': self.user_agent, 'Referer': self.referer }
    self._get_page_source();

  def _get_page_source(self):
    r = requests.get(self.url, headers = self.headers)
    r.encoding = 'utf-8'
    page_source = r.text
    self.doc = pq(fromstring(page_source))

  def _get_reveal_movie(self):
    movie_list = []
    for movie in self.doc('.screening-bd .ui-slide-content').children('li').items():
      id = re.sub(r'[^0-9]', '', movie('.title a').attr('href'))
      list_item = {
        'imgUrl': movie('.poster img').attr('src'),
        'title': movie('.title').text(),
        'score': movie('.rating').text(),
        'detailUrl': '/detail?' + id
      }
      if list_item['detailUrl']:
        movie_list.append(list_item)
    return movie_list

  def _get_popular(self, url):
    data = json.loads(requests.get(url, headers = self.headers).text)['subjects']
    data_list = []
    for item in data:
      data_list.append({
        'imgUrl': item['cover'],
        'title': item['title'],
        'score': item['rate'],
        'detailUrl': '/detail?' + re.sub(r'[^0-9]', '', item['url'])
      })
    return data_list

  def _get_popular_comment(self):
    comment_list = []
    for comment in self.doc('.reviews-bd .review').items():
      id = re.sub(r'[^0-9]', '', comment('.review-hd a').attr('href'))
      comment_list.append({
        'avatar': comment('.review-hd img').attr('data-original'),
        'detailUrl': '/detail?' + id,
        'title': comment('.review-bd h3').text(),
        'user': comment('.review-meta').children('a:first-child').text(),
        'name': comment('.review-meta').children('a:last-of-type').text(),
        'score': comment('.review-meta').children('span').attr('class'),
        'content': comment('.review-content').text().strip()
      })
    return comment_list


  def get_movies(self):
    reveal_movie = self._get_reveal_movie()
    popular_movie = self._get_popular(self.popular_movie_url)
    popular_tv = self._get_popular(self.popular_tv_url)
    popular_comment = self._get_popular_comment()
    return {
      'reveal_movie': reveal_movie,
      'popular_movie': popular_movie,
      'popular_tv': popular_tv,
      'popular_comment': popular_comment
    }