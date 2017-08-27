from flask import jsonify
from app.restful import restful
import time

from app.spider.movie_index import Movie_index

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
