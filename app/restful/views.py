from flask import jsonify
from app.restful import restful

@restful.route('/')
def index():
  obj = { 'baihao': 'shuai' }
  return jsonify(
    message = "success",
    data = obj
  )
