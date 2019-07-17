# handlebars-copy
Copy files from one directory to another, rendering files with handlebars templates

```JavaScript

const handlebarsCopy = require('handlebars-copy');

await handlebarsCopy('./src-dir', './dest-dir', {author:'Zoidberg'})

```

Includes cli utility best installed with -G see ```handlebars-copy -h``` for more.

```bash

handlebars-copy test-data/src test-data/dest test-data/data.json

```
