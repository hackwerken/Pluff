var ftp = require('vinyl-ftp');
var dotenv = require('dotenv');
var fs = require('vinyl-fs');
var spawn = require('child_process').spawn;
var inquirer = require('inquirer');

dotenv.load();

var question = {type: 'confirm', name: 'continue', message: 'Are you sure you want to deploy?'};
var USE_FTP = !!process.env.PLUFF_FTP_HOST;

inquirer.prompt(question).then(function(answers) {
  if (answers.continue) {
    uploadThatShit();
  } else {
    process.exit(1);
  }
});

function uploadThatShit() {
  if (USE_FTP) {
    return uploadWithFtp();
  }

  console.log('Uploading using rsync. Make sure you have this installed!');
  return uploadWithRsync();
}

// Use FTP to deploy.
// TODO: I really don't want to use FTP as it's insecure.
function uploadWithFtp() {
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

function uploadWithRsync() {
  if (!process.env.PLUFF_RSYNC_DEST) {
    throw Error('PLUFF_RSYNC_DEST is not set as an environment variable!');
  }
  spawn('rsync', ['-rv', '--delete', 'dist', process.env.PLUFF_RSYNC_DEST], {stdio: 'inherit'});
}
