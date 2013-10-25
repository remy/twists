var util = require('util'),
    fs = require('fs'),
    twitter = require('twitter'),
    async = require('async'),
    twit = new twitter(require('./config.json')),
    // check if stdin is interactive, coerce to bool, then if it's being piped to isTTY will be false
    useStdin = !!!(process.stdin.isTTY),
    list = (process.argv[2] || '').split('/');

    /*
      config.json looks like this, and ensure the Twitter application has
      read/write access

      {
        "consumer_key": "...",
        "consumer_secret": "...",
        "access_token_key": "...",
        "access_token_secret": "..."
      };

     */

function readStdin(callback) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  var data = '';

  process.stdin.on('data', function(chunk) {
    data += chunk;
  });

  process.stdin.on('end', function() {
    console.log('Read from stdin');
    callback(null, data);
  });
}

function readFile(callback) {
  var filename = process.argv[3];
  console.log('Reading ' + filename);
  fs.readFile(filename, 'utf8', callback);
}

function createList(data, done) {
  var members = [];

  try {
    members = data.split('\n').filter(function (item) {
      return !!item.trim();
    }).map(function (item) {
      return item.trim().replace(/^@/, '');
    });
  } catch (err) {
    return done(err);
  }

  async.eachSeries(members, function (member, done) {
    twit.post('/lists/members/create_all.json', { slug: slug, owner_screen_name: owner_screen_name, screen_name: member }, function (data) {
      if (data.statusCode && data.statusCode == 404) {
        console.log('404: ' + member);
      }
      done();
    });
  }, function () {
    console.log('Done.');
    done();
  });
}

if (list.length < 2 || (!useStdin && !process.argv[3])) {
  console.log('Usage: node index.js screen_name/list_slug members.txt (or <stdin>');
  console.log('       members.txt is simply a text file with a list of twitter screen names\n');
  process.exit();
}

var owner_screen_name = list.pop(),
    slug = list.pop();

console.log('Loading ' + owner_screen_name + '/' + slug + '...');

async.waterfall([
  useStdin ? readStdin : readFile,
  createList
], function (err) {
  if (err) {
    console.error(err);
  }
});