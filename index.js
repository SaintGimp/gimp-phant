#!/usr/bin/env node

var Phant = require('phant'),
    app = Phant();

var listenPort = process.env.PORT || 3000;
Phant.HttpServer.listen(listenPort);

const path = require('path');
var dataDirectory = path.join(process.env.HOME, "site", "wwwroot", "App_Data");

// METADATA
// ========
var meta = require('phant-meta-json')({
  directory: dataDirectory
});

var validator = Phant.Validator({
  metadata: meta
});

// KEYCHAIN
// ========
var keychain = require('phant-keychain-hex')({
  keyLength: 12,
  publicSalt: process.env.PUBLIC_SALT || 'default',
  privateSalt: process.env.PRIVATE_SALT || 'default',
  deleteSalt: process.env.DELETE_SALT || 'default'
});

// STORAGE
// =======
var stream = require('phant-stream-json')({
  directory: dataDirectory,
  cap: null,
  chunk: 25 * 1024 * 1024, // 25 MB file chunks
  pageSize: 1000
});

app.registerOutput(stream);

// INPUTS
// ======
var defaultInput = Phant.HttpInput({
  validator: validator,
  metadata: meta,
  keychain: keychain
});

Phant.HttpServer.use(defaultInput);
app.registerInput(defaultInput);

// OUTPUTS
// =======
var defaultOutput = Phant.HttpOutput({
  validator: validator,
  storage: stream,
  keychain: keychain
});

Phant.HttpServer.use(defaultOutput);
app.registerOutput(defaultOutput);

// MANAGERS
// ========
var PhantManagerHttp = require('phant-manager-http')({
  validator: validator,
  metadata: meta,
  keychain: keychain
});

Phant.HttpServer.use(PhantManagerHttp);
app.registerManager(PhantManagerHttp);

console.log(
  "            .-.._\n      __  \/`" +
  "     '.\n   .-'  `\/   (   a \\" +
  "\n  \/      (    \\,_   \\\n \/|" +
  "       '---` |\\ =|\n` \\    \/_" +
  "_.-\/  \/  | |\n   |  \/ \/ \\ \\" +
  "  \\   \\_\\  jgs\n   |__|_|  |_|" +
  "__\\\n  welcome to phant.\n\n"
);

