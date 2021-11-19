import { Product, ProductType } from '../product';

it('implements optimistic concurrency control', async () => {
  // create an instance of a product
  const product = Product.build({
    name: 'msi 3060ti ventus',
    sku: 'msi-3060ti-ventus',
    type: ProductType.Simple,
  });

  // save the product to db
  await product.save();

  // fetch the product twice
  const firstInstance = await Product.findById(product.id);
  const secondInstance = await Product.findById(product.id);

  // make 2 separate changes to the products we fetched
  firstInstance!.set({ name: 'MSI 3060ti Ventus' });
  secondInstance!.set({ name: 'MSI 3090 Ventus' });

  // save the first fetched product
  await firstInstance!.save();

  // save the second fetched product and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const product = Product.build({
    name: 'msi 3060ti ventus',
    sku: 'msi-3060ti-ventus',
    type: ProductType.Simple,
  });

  await product.save();
  expect(product.version).toEqual(0);

  await product.save();
  expect(product.version).toEqual(1);

  await product.save();
  expect(product.version).toEqual(2);
});
