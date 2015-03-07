#!/usr/bin/env node

var Phant = require('phant'),
    app = Phant();

var listenPort = process.env.PORT || 3000;
Phant.HttpServer.listen(listenPort);

// METADATA
// ========
var metaDatabaseUri = process.env.META_URI || 'mongodb://localhost/phant';
var meta = require('phant-meta-mongodb')({
  url: metaDatabaseUri
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
var storageDatabaseUri = process.env.STORAGE_URI || 'mongodb://localhost/phant';
var stream = require('phant-stream-mongodb')({
  url: storageDatabaseUri,
  cap: 0,
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

