const {TextEncoder, TextDecoder} = require('node:util');
require('isomorphic-fetch'); // eslint-disable-line import/no-unassigned-import

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
