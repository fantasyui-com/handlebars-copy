const path = require('path');
const walk = require('walkdir');
const handlebars = require('handlebars');
const {copyFile, mkdir, readFile, writeFile} = require('fs').promises;

handlebars.registerHelper('modules', function(person) {
  if(!person) return "";
  return person.map(i=>`"${i}":"latest"`).join(", ");
});

module.exports = main;

async function main(source, destination, data){

  // without path normalization the srcExpression will fail and clobber src files
  let src = path.resolve(source);
  let dest = path.resolve(destination);

  let srcExpression = new RegExp(`^${src}`)
  let fileWalk = await walk.async(src, {return_object:true, follow_symlinks:false});

  // dreate the database
  const database = Object
  .entries(fileWalk)
  .map(([fileLocation, fileStats]) => ({
    directory: fileStats.isDirectory(),
    file: fileStats.isFile(),
    src: fileLocation,
    dest: fileLocation.replace(srcExpression, dest)
  }))
  .filter(i=>i.src!=i.dest) // clobber protection just incase of freaky fs mounts or some such

  // create base dir as the dest may not actually exist
  await mkdir(dest, {recursive:true});

  // pre-create all the needed directories
  for({dest} of database.filter(i=>i.directory)){
    await mkdir(dest, {recursive:true});
  }

  // copy all files in
  for({src, dest} of database.filter(i=>i.file)){
    await copyFile(src, dest);
  }

  // interpolate eveything
  for({dest} of database.filter(i=>i.file)){
    const source = await readFile(dest);
    const template = handlebars.compile(source.toString());
    const result = template(data);
    await writeFile(dest, result);
  }


}

//NOTE: at the time of writing, it was unsafe to use promises in .map/forEach hence the for loops ....
