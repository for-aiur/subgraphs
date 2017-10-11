import flask

APP = flask.Flask(__name__, template_folder='./')

@APP.route('/api/')
def index():
    return "{'result': 'Under development.'}"
