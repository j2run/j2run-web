// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('j2');

// Create a new document in the collection.
db.getCollection('categories').deleteMany({
  id: {
    $in: [1, 2, 3],
  },
});

db.getCollection('categories').insertMany([
  {
    id: 1,
    name: 'Cloud J2ME',
    description: '',
  },
  {
    id: 2,
    name: 'Cloud Android',
    description: '',
  },
  {
    id: 3,
    name: 'Web Builder',
    description: '',
  },
]);
