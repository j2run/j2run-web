// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('j2');

// Create a new document in the collection.
db.getCollection('wbdomains').deleteMany({});
db.getCollection('wbdomains').insertMany([
  {
    domain: 'j2run.com',
  },
]);
