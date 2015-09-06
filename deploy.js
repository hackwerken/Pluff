var ftp = require('vinyl-ftp');
var dotenv = require('dotenv');
var fs = require('vinyl-fs');
var inquirer = require('inquirer');

dotenv.load();

var question = {type: 'confirm', name: 'continue', message: 'Are you sure you want to deploy?'};

inquirer.prompt(question, function(answers) {
  if (answers.continue) {
    uploadThatShit();
  } else {
    process.exit(1);
  }
});

// Use FTP to deploy.
// TODO: I really don't want to use FTP as it's insecure.
function uploadThatShit() {
  var conn = ftp.create({
    host: process.env.PLUFF_FTP_HOST,
    user: process.env.PLUFF_FTP_USER,
    password: process.env.PLUFF_FTP_PASSWORD,
    parallel: 10,
    log: console.log,
  });

  fs.src(['./dist/**'], {buffer: false})
    .pipe(conn.dest(process.env.PLUFF_FTP_DIST));
}
