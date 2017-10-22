from google.appengine.ext import ndb  # pylint: disable=E0401,E0611
from user import User

class Command(ndb.Model):
    name = ndb.StringProperty(required=True)
    identifier = ndb.StringProperty(required=True)
    category = ndb.StringProperty(required=True)
    date = ndb.DateTimeProperty(auto_now=True)
    owner = ndb.KeyProperty(kind=User, required=True)
    content = ndb.TextProperty(indexed=False, required=True)
