"use strict"
path = require("path")


module.exports = (grunt) ->
  # load all grunt tasks
  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    sass:
      options:
        includePaths: ["app/bower_components/foundation/scss"]

      dist:
        options:
          outputStyle: "compressed"

        files:
          "app/css/app.css": "app/scss/app.scss"

    autoprefixer:
      build:
        expand: true
        cwd: "app/css"
        src: ["**/*.css"]
        dest: "app/css"

    clean:
      dist:
        src: ["dist/*", "!.*", "!robots.txt"]

    copy:
      dist:
        files: [
          expand: true
          cwd: "app/"
          src: ["css/**", "js/**", "img/**/*", "fonts/**", "**/*.html", "!**/*.scss"]
          dest: "dist/"
        ]

    useminPrepare:
      html: "app/*.html"
      options:
        dest: "dist"

    usemin:
      html: ["dist/*.html"]
      css: ["dist/css/*.css"]
      options:
        dirs: ["dist"]

    watch:
      grunt:
        files: ["Gruntfile.coffee"]
        tasks: ["sass"]

      sass:
        files: ["app/scss/{,*/}*.scss", "app/bower_components/{,*/}*.scss"]
        tasks: ["sass", "autoprefixer"]

      livereload:
        files: ["app/*.html", "app/js/{,*/}*.js", "app/css/{,*/}*.css", "app/img/{,*/}*.{jpg,gif,svg,jpeg,png}"]
        options:
          livereload: true

    connect:
      app:
        options:
          port: 9000
          base: "app/"
          hostname: "*"
          livereload: true

      dist:
        options:
          port: 9001
          base: "dist/"
          hostname: "*"
          keepalive: true
          livereload: false

    open:
      app:
        path: "http://localhost:9000"

      dist:
        path: "http://localhost:9001"

      project:
        path: path.resolve()

      projectDist:
        path: path.resolve() + "/dist"

  grunt.registerTask "default", ["sass", "autoprefixer", "connect:app", "open:app", "watch"]
  grunt.registerTask "publish", ["clean:dist", "open:projectDist", "useminPrepare", "copy:dist", "concat", "uglify", "usemin", "open:dist", "connect:dist"]
