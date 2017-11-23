#!/usr/bin/env python

import sys

from app import create_app
from settings import PORT

app = create_app()

if __name__ == '__main__':
  port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
  app.run(threaded=True, port=port)