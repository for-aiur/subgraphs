const {ds, fromDatastore} = require('./datastore');

const userKind = 'User';

function read({email}) {
  const q = ds.createQuery(userKind);

  if (email)
    q.filter('email', '=', email);

  return ds.runQuery(q).then(results => fromDatastore(results[0]));
}

function write({name, email, isAdmin=false}) {
  let registrationDate = new Date();

  const entity = {
    key: ds.key(userKind),
    data: {name, email, registrationDate, isAdmin}
  };

  return ds.insert(entity).then(() => {
    let user = entity.data;
    user.key = entity.key;
    return user;
  });
}

function remove(user) {
  ds.delete(user.key);
}

module.exports = {
  read: read,
  write: write,
  remove: remove,
};
