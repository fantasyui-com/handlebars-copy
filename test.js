const assert = require('assert');
const {existsSync, constants} = require('fs');
const {access, unlink, readFile} = require('fs').promises;
const handlebarsCopy = require('./index.js');

async function main(){

  const expected = 'PASS';
  const targetFile = './test-data/dest/test.txt';

  if (existsSync(targetFile)) await unlink(targetFile);

  await handlebarsCopy('./test-data/src', './test-data/dest', {test:expected})

  if (!existsSync(targetFile)) throw new Error('File was not created.')

  const actual = (await readFile('./test-data/dest/test.txt')).toString().trim()

  assert.equal( actual , expected );

  if (existsSync(targetFile)) await unlink(targetFile);


}

main().catch(e=>console.log(e.message));
