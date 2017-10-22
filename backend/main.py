import datetime
import logging
import flask
from api import user, document, command


APP = flask.Flask(__name__, template_folder="./")
APP.register_blueprint(document.APP, url_prefix="/api/doc")
APP.register_blueprint(user.APP, url_prefix="/api/user")
APP.register_blueprint(command.APP, url_prefix="/api/cmd")
APP.config["SECRET_KEY"] = user.SECRET_KEY


@APP.before_request
def make_session_permanent():
    flask.session.permanent = True
    APP.permanent_session_lifetime = datetime.timedelta(days=30)


@APP.errorhandler(500)
def server_error(_):
    logging.exception("An error occurred during a request.")
    return "An internal error occurred.", 500
