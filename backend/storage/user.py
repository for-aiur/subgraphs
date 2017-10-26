from google.appengine.ext import ndb  # pylint: disable=E0401,E0611


class User(ndb.Model):
    name = ndb.StringProperty(required=True)
    email = ndb.StringProperty(required=True)
    registrationDate = ndb.DateTimeProperty(auto_now_add=True)
    subscribed = ndb.BooleanProperty(default=True)
    banned = ndb.BooleanProperty(required=True, default=False)
    facebookId = ndb.StringProperty(required=False)
    twitterId = ndb.StringProperty(required=False)
    googleId = ndb.StringProperty(required=False)
    imageUrl = ndb.StringProperty(required=False)
    isAdmin = ndb.BooleanProperty(required=True, default=False)
    authKey =  ndb.StringProperty(required=True)
