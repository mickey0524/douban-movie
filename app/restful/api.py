from flask import jsonify
from flask import request
from app.restful import restful
import time

from app.spider.movie_index import Movie_index
from app.spider.movie_detail import Movie_detail
from app.spider.review_word_frequency import Review_word_frequency
from app.spider.comment_word_frequency import Comment_word_frequency

@restful.route('/movie_index')
def movie_index():
  try:
    movie_index = Movie_index()
  except:
    return jsonify(
      message = 'error'
    )
  print 'movie_index'
  return jsonify(
    message = "success",
    data = movie_index.get_movies()
  )

@restful.route('/movie_detail')
def movie_detail():
  movie_id = request.values.get('id')
  try:
    movie_detail = Movie_detail(movie_id)
  except:
    return jsonify(
      message = 'error'
    )
  return jsonify(
    message = 'success',
    data = movie_detail.get_movies()
  )

@restful.route('/review_word_frequency')
def review_word_frequency():
  movie_id = request.values.get('id')
  try:
    review_word_frequency = Review_word_frequency(movie_id)
  except:
    return jsonify(
      message = 'error'
    )
  return jsonify(
    message = 'success',
    data = review_word_frequency.get_frequency()
  )

@restful.route('/comment_word_frequency')
def comment_word_frequency():
  movie_id = request.values.get('id')
  try:
    comment_word_frequency = Comment_word_frequency(movie_id)
  except:
    return jsonify(
      message = 'error'
    )
  return jsonify(
    message = 'success',
    data = comment_word_frequency.get_frequency()
  )
