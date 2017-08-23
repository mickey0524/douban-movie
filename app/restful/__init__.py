from flask import Blueprint

restful = Blueprint('restful', __name__, url_prefix='/api')

from . import views