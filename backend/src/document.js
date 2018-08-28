'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const docData = require('./storage/document');
const user = require('./user');

const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());

// Use the oauth middleware to automatically get the user's profile
// information and expose login/logout URLs to templates.
router.use(user.template);

/**
 * POST /api/document/list
 *
 * Create a new document.
 */
router.post('/list', (req, res) => {
  let data = req.body;
  let category = data.category;

  let promises = [docData.read({public: true, category})];

  if (req.user && req.user.uid) {
    let owner = req.user.uid;
    promises.push(docData.read({public: false, category, owner}));
  }

  Promise.all(promises).then(results => {
    let docs = [];
    results.forEach(result => docs = docs.concat(result));
    let contents = docs.map(doc => JSON.parse(doc.content));
    return contents;
  })
  .catch(error => {
    console.log(error);
  })
  .then(contents => {
    res.json(contents);
  });
});

/**
 * Errors on "/api/document/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = {
    message: err.message,
    internalCode: err.code
  };
  next(err);
});

module.exports = {
  router
};


// @APP.route("/list", methods=["POST"])
// def list_docs():
//     expression = Document.public == True
//     data = flask.request.get_json()
//     uid = user.get_uid()
//     if uid:
//         expression = ndb.OR(
//             Document.owner == ndb.Key(User, uid),
//             expression)
//     category = data.get(u"category")
//     if category:
//         expression = ndb.AND(
//             Document.category == category,
//             expression)
//     query = Document.query(expression)
//     docs = query.fetch()
//     docs = [json.loads(doc.content) for doc in docs]
//     return flask.jsonify(docs)


// @APP.route("/get", methods=["POST"])
// def get_doc():
//     data = flask.request.get_json()
//     uid = user.get_uid()
//     if not uid:
//         flask.abort(403)

//     identifier = data.get(u"identifier")
//     if not identifier:
//         flask.abort(400)

//     expression = ndb.AND(
//         Document.identifier == identifier,
//         ndb.OR(
//             Document.owner == ndb.Key(User, uid),
//             Document.public == True))

//     doc = Document.query(expression).get()
//     return flask.jsonify(json.loads(doc.content))


// @APP.route("/save", methods=["POST"])
// def save_doc():
//     data = flask.request.get_json()
//     uid = user.get_uid()
//     if not uid:
//         flask.abort(403)

//     user_key = ndb.Key(User, uid)
//     if data[u"public"] and not user_key.get().isAdmin:
//         flask.abort(403)

//     identifier = data.get(u"identifier")
//     if not identifier:
//         flask.abort(400)

//     doc = Document.query(
//         ndb.AND(Document.identifier == identifier,
//                 Document.owner == user_key)).get()

//     if not doc:
//         doc = Document()
//         doc.owner = user_key

//     doc.title = data[u"title"]
//     doc.identifier = data[u"identifier"]
//     doc.category = data[u"category"]
//     doc.public = data[u"public"]
//     doc.content = json.dumps(data)
//     doc.put()
//     return "Success.", 200


// @APP.route("/delete", methods=["POST"])
// def delete_doc():
//     data = flask.request.get_json()
//     uid = user.get_uid()
//     if not uid:
//         flask.abort(403)

//     identifier = data.get(u"identifier")
//     if not identifier:
//         flask.abort(400)

//     doc = Document.query(
//         ndb.AND(Document.identifier == identifier,
//                 Document.owner == ndb.Key(User, uid))).get()
//     if not doc:
//         flask.abort(400)

//     if doc.owner.id() != uid:
//         flask.abort(401)

//     doc.key.delete()
//     return "Success.", 200
