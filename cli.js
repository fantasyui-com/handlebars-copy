#!/usr/bin/env node

const handlebarsCopy = require('./index.js');
const program = require('commander');
const path = require('path');
const fs = require('fs');

program
  .version('0.1.0')
  .arguments('<src> <dest> <data>')
  .action(function (src, dest, dataFile) {
    const data = JSON.parse(fs.readFileSync(dataFile).toString())
    handlebarsCopy(src, dest, data)
  });

program.parse(process.argv)
