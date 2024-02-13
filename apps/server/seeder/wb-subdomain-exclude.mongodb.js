// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('j2');

// Create a new document in the collection.
db.getCollection('wbsubdomainexcludes').deleteMany({});
db.getCollection('wbsubdomainexcludes').insertMany([
  { subdomain: 'dev' },
  { subdomain: 'support' },
  { subdomain: 'contact' },
  { subdomain: 'admin' },
  { subdomain: 'manage' },
  { subdomain: 'test' },
  { subdomain: 'maintaince' },
  { subdomain: 'x67huy' },
  { subdomain: 'api' },
]);
