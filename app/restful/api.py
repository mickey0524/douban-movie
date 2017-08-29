from flask import jsonify
from flask import request
from app.restful import restful
import time

from app.spider.movie_index import Movie_index
from app.spider.movie_detail import Movie_detail

@restful.route('/movie_index')
def movie_index():
  try:
    movie_index = Movie_index()
  except:
    return jsonify(
      message = 'error'
    )
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
