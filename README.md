# nef

[![build status](https://img.shields.io/travis/CreaturePhil/nef-mongo/master.svg?style=flat-square)](https://travis-ci.org/CreaturePhil/nef-mongo)
[![Dependency Status](https://david-dm.org/CreaturePhil/nef-mongo.svg?style=flat-square)](https://david-dm.org/CreaturePhil/nef-mongo)
[![devDependency Status](https://david-dm.org/CreaturePhil/nef-mongo/dev-status.svg?style=flat-square)](https://david-dm.org/CreaturePhil/nef-mongo#info=devDependencies)

MongoDB plugin for nef

## Install

```
npm install nef-mongo --save
```

## Usage

```js
const nef = require('nef');
const nefMongo = require('nef-mongo');
const db = nef(nefMongo('mongodb://localhost:27017/myproject'));

db.money.set('phil', 10);
db.money.set('some_user', db.money.get('phil') + 10);
db.seen.set('some_user', Date.now());
db.posts.set('posts', [
  { title: 'OriginDB is awesome!', body: '...', likes: 10 },
  { title: 'flexbility ', body: '...', likes: 3 },
  { title: 'something someting something', body: '...', likes: 8 }
]);
```

In MongoDB:

```json
{
	"_id" : ObjectId("567e4741b09bffce48aa98b1"),
	"name" : "money",
	"data" : "{\"phil\":10,\"some_user\":20}"
}
{
	"_id" : ObjectId("567e4741b09bffce48aa98b2"),
	"name" : "seen",
	"data" : "{\"some_user\":1451116353687}"
}
{
	"_id" : ObjectId("567e4741b09bffce48aa98b3"),
	"name" : "posts",
	"data" : "{\"posts\":[{\"title\":\"OriginDB is awesome!\",\"body\":\"...\",\"likes\":10},{\"title\":\"flexbility \",\"body\":\"...\",\"likes\":3},{\"title\":\"something someting something\",\"body\":\"...\",\"likes\":8}]}"
}
```

## Docs

### nefMongo(url)

Loads in data and save function using nef collection of MongoDB.

## LICENSE

[MIT](LICENSE)
