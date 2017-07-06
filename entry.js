#!/usr/bin/env node

const rl      = require('readline-sync');
const fs      = require('fs');
const process = require('process');
const Main    = require('./classes/Main.js');

const main = new Main(process.argv[2]);

main.initialize();