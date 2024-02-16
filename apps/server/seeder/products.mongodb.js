// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('j2');

// Create a new document in the collection.
(async () => {
  await db.getCollection('products').deleteMany({});
  await db.getCollection('productretaloptions').deleteMany({});

  const products = await db.getCollection('products').insertMany([
    {
      name: 'Web Builder Free',
      description: '',
      categoryId: 3,
    },
    {
      name: 'Web Builder Gold',
      description: '',
      categoryId: 3,
    },
  ]);

  const webBuilderFreeProduct = products.insertedIds[0];
  await db.getCollection('productretaloptions').insertMany([
    {
      productId: webBuilderFreeProduct,
      price: 0,
      usageTime: -1,
    },
  ]);

  const webBuilderGoldProduct = products.insertedIds[1];
  await db.getCollection('productretaloptions').insertMany([
    {
      productId: webBuilderGoldProduct,
      price: 12000,
      usageTime: 30 * 24 * 60 * 60,
    },
    {
      productId: webBuilderGoldProduct,
      price: 11500 * 3,
      usageTime: 3 * 30 * 24 * 60 * 60,
    },
    {
      productId: webBuilderGoldProduct,
      price: 11000 * 6,
      usageTime: 6 * 30 * 24 * 60 * 60,
    },
    {
      productId: webBuilderGoldProduct,
      price: 9500 * 12,
      usageTime: 12 * 30 * 24 * 60 * 60,
    },
  ]);
})();
