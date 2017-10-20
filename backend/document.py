import user
import json
import flask

from google.appengine.ext import ndb  # pylint: disable=E0401,E0611

import validation
from storage import Document, User

APP = flask.Blueprint('doc', __name__)


def get_documents_list(query):
    doc_titles = query.fetch()
    docs = []
    for doc in doc_titles:
        docs.append(json.loads(doc.content))
    return docs


@APP.route('/init', methods=['POST', 'GET'])
def init_docs():
    usr = user.get_user()
    if not usr or not usr.isAdmin:
        flask.abort(403)
    query = Document.query(Document.public == True)
    keys = query.fetch(keys_only=True)
    ndb.delete_multi(keys)
    data = json.load(open('catalog.json'))
    docs = []
    for item in data:
        doc = Document()
        doc.owner = ndb.Key(User, usr.key.id())
        doc.title = item[u'title']
        doc.type = item[u'type']
        doc.public = True
        doc.content = json.dumps(item)
        docs.append(doc)
    ndb.put_multi(docs)
    return '', 200


@APP.route('/list', methods=['POST', 'GET'])
def list_docs():
    query = Document.query(Document.public == True)
    docs = get_documents_list(query)
    uid = user.get_uid()
    if uid:
        query = Document.query(
            ndb.AND(Document.public == False,
                    Document.owner == ndb.Key(User, uid)))
        docs += get_documents_list(query)
    return flask.jsonify(docs)


@APP.route('/save', methods=['POST'])
def save():
    usr = user.get_user()
    if not usr:
        flask.abort(403)
    data = flask.request.get_json()
    typ = data.get(u'type', None)
    if typ:
        doc = Document.query(
            ndb.AND(Document.type == typ,
                    Document.owner == usr.key)).get()
    else:
        doc = Document()
        doc.owner = ndb.Key(User, usr.key.id())

    doc.title = data[u'title']
    doc.type = data[u'type']
    doc.public = data[u'public']
    doc.content = data[u'content']
    doc.put()

    return flask.jsonify({
        'docid': doc.key.id()
    })


@APP.route('/delete', methods=['POST'])
def delete():
    usr = user.get_user()
    if not usr:
        flask.abort(403)
    data = flask.request.get_json()
    typ = data.get(u'type', None)
    if not typ:
        flask.abort(400)
    doc = Document.query(
        ndb.AND(Document.type == typ,
                Document.owner == usr.key)).get()
    if not doc:
        flask.abort(400)
    if doc.owner.id() != usr.key.id():
        flask.abort(401)
    doc.key.delete()
    return 'Success.', 200
