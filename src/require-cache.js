const assert = require("assert");
const realFs = require("fs");

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require("fs"), fakeFs);
assert.strictEqual(require("node:fs"), realFs);
