import user  # pylint: disable=E0401,E0611
import flask

from google.appengine.ext import ndb  # pylint: disable=E0401,E0611
from google.appengine.datastore.datastore_query import Cursor  # pylint: disable=E0401,E0611

import validation
from storage import DocumentHeader, DocumentContent, DocumentVote, User


MAX_PAGE_SIZE = 20


APP = flask.Blueprint('doc', __name__)


@APP.route('/list-personal', methods=['POST'])
def list_personal():
    uid = user.get_uid()
    if uid:
        query = DocumentHeader.query(
            DocumentHeader.owner == ndb.Key(User, uid))
        return flask.jsonify(get_documents_list(query))
    else:
        output = {'headers': [], 'cursor': None, 'more': False}
        return flask.jsonify(output)


@APP.route('/list-favorites', methods=['POST'])
def list_favorites():
    docs = []
    data = flask.request.get_json()
    cursor = Cursor(urlsafe=data.get(u'cursor', None))
    page_size = min(int(data.get(u'page', MAX_PAGE_SIZE)), MAX_PAGE_SIZE)
    more = False
    uid = user.get_uid()
    if uid:
        votes, cursor, more = DocumentVote.query(
            ndb.AND(DocumentVote.user == ndb.Key(User, uid),
                    DocumentVote.type == 1)).fetch_page(
                        page_size, start_cursor=cursor)
        for _vote in votes:
            doc = _vote.doc.get()
            if doc:
                docs.append({
                    'docid': doc.key.id(),
                    'title': doc.title,
                    'date': validation.date_to_string(doc.date),
                    'owner': doc.owner.id(),
                    'public': doc.public
                })
    output = {
        'headers': docs,
        'cursor': cursor.urlsafe() if cursor else '',
        'more': more
    }
    return flask.jsonify(output)


@APP.route('/list-new', methods=['POST'])
def list_new():
    return flask.jsonify(get_new_docs())


def get_new_docs():
    query = DocumentHeader.query(
        DocumentHeader.public).order(-DocumentHeader.date)
    return get_documents_list(query)


@APP.route('/list-popular', methods=['POST'])
def list_popular():
    return flask.jsonify(get_popular_docs())


def get_popular_docs():
    query = DocumentHeader.query(
        DocumentHeader.public).order(-DocumentHeader.likes)
    return get_documents_list(query)


def get_documents_list(query):
    data = flask.request.get_json()
    if data:
        cursor = Cursor(urlsafe=data.get(u'cursor', None))
        page_size = min(int(data.get(u'page', MAX_PAGE_SIZE)), MAX_PAGE_SIZE)
    else:
        cursor = None
        page_size = MAX_PAGE_SIZE
    doc_titles, cursor, more = query.fetch_page(
        page_size, start_cursor=cursor)
    docs = []
    for doc in doc_titles:
        docs.append({
            'docid': doc.key.id(),
            'title': doc.title,
            'date': validation.date_to_string(doc.date),
            'owner': doc.owner.id(),
            'public': doc.public
        })
    output = {
        'headers': docs,
        'cursor': cursor.urlsafe() if cursor else '',
        'more': more
    }
    return output


@APP.route('/view', methods=['POST'])
def view():
    data = flask.request.get_json()
    docid = data.get(u'docid', None)
    output = get_document(docid)
    return flask.jsonify(output)


def get_document(docid):
    if not docid:
        flask.abort(400)
    doc_key = ndb.Key(DocumentHeader, int(docid))
    doc = doc_key.get()
    if not doc:
        flask.abort(404)
    uid = user.get_uid()
    v = None
    if uid:
        user_key = ndb.Key(User, uid)
        v = DocumentVote.query(
            ndb.AND(DocumentVote.user == user_key,
                    DocumentVote.doc == doc_key)).get()
    if not doc.public:
        if doc.owner.id() != uid:
            flask.abort(401)
    content = ndb.Key(DocumentContent, doc.key.id()).get()
    output = {
        'header': {
            'docid': doc.key.id(),
            'title': doc.title,
            'date': validation.date_to_string(doc.date),
            'owner': doc.owner.id(),
            'public': doc.public
        },
        'content': {
            'content': content.content,
        },
        'vote': {
            'type': v.type if v else 0
        }
    }
    return output


@APP.route('/save', methods=['POST'])
def save():
    if not user:
        flask.abort(404)
    uid = user.get_uid()
    data = flask.request.get_json()
    data_header = data[u'header']
    data_content = data[u'content']
    docid = data_header.get(u'docid', None)
    if docid:
        doc = ndb.Key(DocumentHeader, docid).get()
        if doc.owner.id() != uid:
            flask.abort(401)
    else:
        doc = DocumentHeader()
        doc.owner = ndb.Key(User, uid)

    doc.title = data_header[u'title']
    doc.public = data_header[u'public']
    key = doc.put()

    content = DocumentContent(id=key.id())
    content.content = data_content[u'content']
    content.put()

    return flask.jsonify({
        'docid': doc.key.id()
    })


@APP.route('/delete', methods=['POST'])
def delete():
    uid = user.get_uid()
    if not uid:
        flask.abort(404)
    data = flask.request.get_json()
    docid = data.get(u'docid', None)
    if not docid:
        flask.abort(400)
    doc = ndb.Key(DocumentHeader, docid).get()
    content = ndb.Key(DocumentContent, docid).get()
    votes = DocumentVote.query(
        ndb.AND(DocumentVote.user == ndb.Key(User, uid),
                DocumentVote.doc == ndb.Key(DocumentHeader, docid))
    ).fetch(keys_only=True)
    if not doc:
        flask.abort(400)
    if doc.owner.id() != uid:
        flask.abort(401)
    doc.key.delete()
    if content:
        content.key.delete()
    if votes:
        ndb.delete_multi(votes)
    return 'Success.', 200


@APP.route('/vote', methods=['POST'])
def vote():
    uid = user.get_uid()
    if not uid:
        flask.abort(404)
    uid = user.get_uid()
    data = flask.request.get_json()
    docid = data.get(u'docid', None)
    user_key = ndb.Key(User, uid)
    doc_key = ndb.Key(DocumentHeader, docid)
    _vote = DocumentVote.query(
        ndb.AND(DocumentVote.user == user_key,
                DocumentVote.doc == doc_key)).get()
    doc = doc_key.get()
    if not doc:
        flask.abort(400)

    if _vote:
        # Undo the current vote
        if _vote.type == 1:
            doc.likes -= 1
        elif _vote.type == 2:
            doc.flagged -= 1
    else:
        _vote = DocumentVote()  # pytlint: disable(W0621)
        _vote.user = user_key
        _vote.doc = doc_key

    _type = data.get(u'type', None)
    _vote.type = type
    _vote.put()

    # Apply the new vote
    if _type == 1:
        doc.likes += 1
    elif _type == 2:
        doc.flagged += 1
    doc.put()
    return 'Success.', 200
