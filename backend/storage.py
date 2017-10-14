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


class DocumentContent(ndb.Model):
    content = ndb.TextProperty(indexed=False, required=True)


class DocumentHeader(ndb.Model):
    """A model class for storing documents."""
    title = ndb.StringProperty(required=True)
    category = ndb.StringProperty(required=True)
    date = ndb.DateTimeProperty(auto_now_add=True)
    owner = ndb.KeyProperty(kind=User, required=True)
    public = ndb.BooleanProperty(required=True, default=False)
    flagged = ndb.IntegerProperty(required=True, default=0)
    likes = ndb.IntegerProperty(required=True, default=0)


class DocumentVote(ndb.Model):
    doc = ndb.KeyProperty(kind=DocumentHeader, required=True)
    user = ndb.KeyProperty(kind=User, required=True)
    type = ndb.IntegerProperty(required=True)
