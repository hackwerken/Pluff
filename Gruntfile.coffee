"use strict"
path = require("path")
shell = require("shelljs")

module.exports = (grunt) ->
  # load all grunt tasks
  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    sass:
      options:
        includePaths: ["public/bower_components/foundation/scss"],
      dist:
        options:
          outputStyle: "compressed"
        files:
          "public/css/app.css": "public/scss/app.scss"

    autoprefixer:
      build:
        expand: true
        cwd: "public/css"
        src: ["**/*.css"]
        dest: "public/css"

    copy:
      dist:
        files: [
          expand: true
          flatten: true
          src: ["public/bower_components/jquery/jquery.min.js"]
          dest: "public/js/vendor/"
          filter: "isFile"
        ]

    concat:
      options:
        separator: ";"
      dist:
        src: ["public/js/app.js", "public/js/popup.js"]
        dest: "public/js/all.js"

    uglify:
      options:
        compress:
          drop_console: true
      dist:
        files:
          "public/js/all.js": ["public/js/all.js"]

    cacheBust:
      options:
        length: 6
        baseDir: "public/"
      files: ["app/views/home.blade.php"]

    watch:
      grunt:
        files: ["Gruntfile.coffee"]
        tasks: ["sass"]
      sass:
        files: ["public/scss/{,*/}*.scss", "public/bower_components/{,*/}*.scss"]
        tasks: ["sass", "autoprefixer"]
      concat:
        files: ["public/js/app.js", "public/js/popup.js"]
        tasks: ["concat", "uglify"]
      cacheBust:
        files: ["public/css/{,*/}*.css", "public/js/{,*/}*.js"]
        tasks: ["cacheBust"]
      livereload:
        files: ["app/{,*/}*.php", "public/js/{,*/}*.js", "public/css/{,*/}*.css", "public/img/{,*/}*.{jpg,gif,svg,jpeg,png}"]
        options:
          livereload: true


    open:
      app:
        path: "http://pluff.dev:8000/"

      project:
        path: path.resolve()

  grunt.registerTask "vagrant-up", ->
    shell.exec "vagrant up"
  grunt.registerTask "default", ["vagrant-up", "sass", "autoprefixer", "copy", "concat", "uglify", "cacheBust", "open:app", "watch"]
