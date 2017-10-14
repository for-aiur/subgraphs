import logging
import user
import flask
import document


APP = flask.Flask(__name__, template_folder='./')
APP.register_blueprint(document.APP, url_prefix='/api/doc')
APP.register_blueprint(user.APP, url_prefix='/api/user')
APP.config['SECRET_KEY'] = user.SECRET_KEY


@APP.errorhandler(500)
def server_error(_):
    logging.exception('An error occurred during a request.')
    return 'An internal error occurred.', 500
