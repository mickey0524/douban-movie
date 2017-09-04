#!/usr/bin/env python

from app import create_app

app = create_app()

# app.run(host='10.1.9.247', threaded=True)
app.run(threaded=True)