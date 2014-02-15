"use strict"
path = require("path")

module.exports = (grunt) ->
  # load all grunt tasks
  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    sass:
      options:
        includePaths: ["bower_components/foundation/scss"],
      dist:
        options:
          outputStyle: "compressed"
        files:
          "css/app.css": "scss/app.scss"

    autoprefixer:
      build:
        expand: true
        cwd: "css"
        src: ["**/*.css"]
        dest: "css"

    copy:
      dist:
        files: [
          expand: true
          flatten: true
          src: ["bower_components/jquery/jquery.min.js", "bower_components/modernizr/modernizr.js"]
          dest: "js/vendor/"
          filter: "isFile"
        ]

    # cssrazor:
    #   release:
    #     options:
    #       urls: [
    #         "http://localhost:9000/index.php"
    #         "http://localhost:9000/rooster.php"
    #       ]
    #       input: "css/app.css"
    #       output: "css/app.css"

    svgmin:
      dist:
        files: [
          expand: true
          cwd: "img/"
          src: ["**/*.svg"]
          dest: "dist/img/"
        ]

    concat:
      options:
        separator: ";"
      dist:
        src: ["js/app.js"]
        dest: "js/all.js"

    uglify:
      options:
        compress:
          drop_console: true
      dist:
        files:
          "js/all.js": ["js/all.js"]

    watch:
      grunt:
        files: ["Gruntfile.coffee"]
        tasks: ["sass"]
      sass:
        files: ["scss/{,*/}*.scss", "bower_components/{,*/}*.scss"]
        tasks: ["sass", "autoprefixer"]
      livereload:
        files: ["*.php", "js/{,*/}*.js", "css/{,*/}*.css", "img/{,*/}*.{jpg,gif,svg,jpeg,png}"]
        options:
          livereload: true


    php:
      app:
        options:
          keepalive: false
          open: true
          port: 9000
          hostname: "localhost"
          livereload: true

  grunt.registerTask "default", ["sass", "autoprefixer", "php", "copy", "concat", "uglify", "svgmin",  "watch"]
