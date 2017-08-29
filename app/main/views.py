from app.main import main
from flask import render_template

@main.route('/', methods=['GET'])
def home():
  return render_template('main/home.html')

@main.route('/detail', methods=['GET'])
def detail():
  return render_template('main/detail.html')