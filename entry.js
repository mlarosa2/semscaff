#!/usr/bin/env node

const process = require('process');
const Main    = require('./classes/Main.js');
const main    = new Main(process.argv[2]);

main.initialize();