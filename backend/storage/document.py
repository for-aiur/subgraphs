from google.appengine.ext import ndb  # pylint: disable=E0401,E0611
from user import User

class Document(ndb.Model):
    """A model class for storing documents."""
    title = ndb.StringProperty(required=True)
    identifier = ndb.StringProperty(required=True)
    category = ndb.StringProperty(required=True)
    date = ndb.DateTimeProperty(auto_now=True)
    owner = ndb.KeyProperty(kind=User, required=True)
    public = ndb.BooleanProperty(required=True, default=False)
    content = ndb.TextProperty(indexed=False, required=True)
