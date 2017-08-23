from flask import Flask
from main import main
from restful import restful
import configs

blueprints = [
  main,
  restful
]

def create_app(config = None):
  app = Flask(__name__)
  configure_app(app, config)

  for bp_name in blueprints:
    app.register_blueprint(bp_name)

  return app

def configure_app(app, config):
  app.config.from_object(configs.BaseConfig())

  if not config:
    config = configs.config_map['dev']

  app.config.from_object(config)
