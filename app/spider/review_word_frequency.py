import requests
import re
import jieba
from pyquery import PyQuery as pq
from lxml.html import fromstring

class Review_word_frequency(object):

  def __init__(self, movie_id):
    self.base_url = 'https://movie.douban.com/subject/' + movie_id + '/reviews?start='
    self.user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
    self.referer = 'https://movie.douban.com/'
    self.headers = { 'User-Agent': self.user_agent, 'Referer': self.referer }

  def _get_page_source(self, start_num):
    url = self.base_url + str(start_num)
    r = requests.get(url, headers = self.headers)
    r.encoding = 'utf-8'
    return pq(fromstring(r.text))

  def _get_review_list(self, doc):
    review_list = []
    for item in doc('.review-list .review-item').items():
      content = item.find('.short-content').text()
      content = re.sub(r'\.\.\..*', '', content)
      review_list.append(content)
    return review_list

  def _get_review_word(self, page_num):
    word_dict, word_arr = {}, []
    for i in range(0, page_num):
      page_source = self._get_page_source(i * 20)
      review_list = self._get_review_list(page_source)
      for review in review_list:
        seg_list = jieba.cut_for_search(review)
        for word in seg_list:
          if not all(u'\u4e00' <= char <= u'\u9fff' for char in word):
            continue
          cur_num = word_dict.get(word, 0)
          cur_num += 1
          word_dict[word] = cur_num

    for i in word_dict:
      word_arr.append({
        'name': i,
        'value': word_dict[i]
      })
    def sort_cmp(x, y):
      if x['value'] > y['value']:
        return -1
      else:
        return 1
      return 0
    word_arr = sorted(word_arr, sort_cmp)
    return word_arr[:30]

  def get_frequency(self):
    return self._get_review_word(10)



