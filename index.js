const MongoClient = require('mongodb').MongoClient;
const deasync = require('deasync');
const jph = require('json-parse-helpfulerror');

function nefMongo(url) {
  let hasLoaded = false;
  let objects = {
    _save(name, object) {
      MongoClient.connect(url, (err, db) => {
        if (err) throw err;

        const col = db.collection('nef');
        const json = JSON.stringify(object);

        function cb(err) {
          if (err) throw err;
          db.close();
        }

        col.updateOne({name}, {$set: {data: json}}, {upsert: true}, cb);
      });
    }
  };

  MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    db.collection('nef').find({}).toArray((err, docs) => {
      if (err) throw err;

      docs.forEach(doc => {
        try {
          objects[doc.name] = jph.parse(doc.data);
        } catch (e) {
          if (e instanceof SyntaxError) {
            e.message = 'Malformed JSON in doc: ' + doc.name + '\n' + e.message;
          }
          throw e;
        }
      });

      hasLoaded = true;

      db.close();
    });
  });

  deasync.loopWhile(() => !hasLoaded);

  return objects;
}

module.exports = nefMongo;
