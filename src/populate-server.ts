// populate-server.ts
import { bootstrap } from '@vendure/core';
import { populate } from '@vendure/core/cli';
import path from 'path';

import { config } from './vendure-config';
import { initialData } from './my-initial-data';

const productsCsvFile = path.join(__dirname, 'sample-products.csv');
console.log('Products found at: ' + productsCsvFile);
populate(() => bootstrap(config), initialData, productsCsvFile)
  .then((app) => {
    return app.close();
  })
  .then(
    () => process.exit(0),
    (err) => {
      console.log(err);
      process.exit(1);
    }
  );
