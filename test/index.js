const test = require('tape');
const MongoClient = require('mongodb').MongoClient;
const nef = require('nef');
const nefMongo = require('../');

const url = 'mongodb://localhost:27017/myproject';
const db = nef(nefMongo(url));

function reset() {
  db.foo.keys().forEach(key => {
    db.foo.remove(key);
  });
}

reset();

function readJSON(name, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      MongoClient.connect(url, (err, db) => {
        if (err) return reject(err);

        db.collection('nef').find({}).toArray((err, docs) => {
          if (err) return reject(err);

          docs.forEach((doc) => {
            if (doc.name === name) {
              resolve(JSON.parse(doc.data));
            }
          });

          db.close();
        });
      });
    }, time);
  });
}

test('get and set', t => {
  t.plan(5);

  t.equal(db.foo.get('bar'), undefined);
  db.foo.set('bar', 1);
  t.equal(db.foo.get('bar'), 1);

  readJSON('foo', 100).then(data => {
    t.equal(data.bar, 1);
  });

  db.powers.set('flash', 'super speed');
  t.equal(db.foo.get('bar'), 1);

  readJSON('powers', 100).then(data => {
    t.equal(data.flash, 'super speed');
  });
});

test('keys', t => {
  t.plan(5);

  t.deepEqual(db.foo.keys(), ['bar']);
  readJSON('foo', 100).then(data => {
    t.deepEqual(Object.keys(data), ['bar']);
    db.foo.set('baz', 49);
    t.deepEqual(db.foo.keys(), ['bar', 'baz']);
    return readJSON('foo', 100);
  }).then(data => {
    t.deepEqual(Object.keys(data), ['bar', 'baz']);
  });

  readJSON('powers', 100).then(data => {
    t.deepEqual(Object.keys(data), ['flash']);
  });
});

test('put', t => {
  t.plan(7);

  readJSON('foo', 100).then(data => {
    t.equal(data.bar, 1);
    t.equal(data.baz, 49);
    db.foo.put('bar', val => val + 1);
    db.foo.put('baz', val => Math.sqrt(val));
    t.equal(db.foo.get('bar'), 2);
    t.equal(db.foo.get('baz'), 7);
    return readJSON('foo', 100);
  }).then(data => {
    t.equal(data.bar, 2);
    t.equal(data.baz, 7);
  });

  db.powers.put('flash', val => val + ' and tossing lightning');
  readJSON('powers', 100).then(data => {
    t.equal(data.flash, 'super speed and tossing lightning');
  });
});

test('remove', t => {
  t.plan(5);

  t.equal(db.foo.get('baz'), 7);
  readJSON('foo', 100).then(data => {
    t.equal(data.baz, 7);
    db.foo.remove('baz');
    t.equal(db.foo.get('baz'), undefined);
    return readJSON('foo', 100);
  }).then(data => {
    t.equal(data.baz, undefined);
  });

  db.powers.remove('flash');
  readJSON('powers', 100).then(data => {
    t.equal(data.flash, undefined);
  });
});
