"use strict"
path = require("path")


module.exports = (grunt) ->
  # load all grunt tasks
  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks
  modRewrite = require("connect-modrewrite")

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
      dist: ["dist/*", "!.*", "!robots.txt"]

    copy:
      dist:
        files: [
          expand: true
          cwd: "app/"
          src: ["css/**", "js/**", "img/**/*", "fonts/**", "*.html", "partials/**", "json/**/*"]
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

    uncss:
      options:
        ignore: [
          # REGEX's
          /ngdialog/g, /angucomplete/g, /input/g,
          # Specific classes
          '.ngdialog-overlay'
        ]
      dist:
        files:
          'dist/css/app.css': ['app/*.html', 'app/partials/*.html']

    cssmin:
      dist:
        files:
          'dist/css/app.css': 'dist/css/app.css',

    uglify:
      options:
        mangle: false # preserve variables etc., bc angular doesn't like it (pussy)
        preserveComments: 'all' # we don't want no license trouble

    cacheBust:
      options:
        encoding: "utf8"
        algorithm: "md5"
        length: 12
        # TODO: Setting this to true is better, but then this plugins renames the files and we don't want that shizzle
        # There is a pull request for this luckily. Let's wait. (19 september 2014)
        rename: false
      assets:
        files: [
          src: ["dist/index.html"]
        ]

    buildcontrol:
      options:
        dir: "dist"
        commit: true
        push: true
        message: "Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%"

      production:
        options:
          remote: "https://github.com/SpaceK33z/Pluff.git"
          branch: "production"

    watch:
      grunt:
        files: ["Gruntfile.coffee"]
        tasks: ["sass"]

      sass:
        files: ["app/scss/{,*/}*.scss", "app/bower_components/{,*/}*.scss"]
        tasks: ["sass", "autoprefixer"]

      livereload:
        files: ["app/*.html", "app/partials/*.html", "app/js/{,*/}*.js", "app/css/{,*/}*.css", "app/img/{,*/}*.{jpg,gif,svg,jpeg,png}"]
        options:
          livereload: true

    connect:
      app:
        options:
          port: 9000
          hostname: "*"
          livereload: true
          base: "app/"
          middleware: (connect, options) ->
            middlewares = []
            directory = options.directory or options.base[options.base.length - 1]

            # enable Angular's HTML5 mode
            middlewares.push modRewrite(["!\\.html|\\.js|\\.svg|\\.css|\\.png$ /index.html [L]"])
            options.base = [options.base]  unless Array.isArray(options.base)
            options.base.forEach (base) ->

              # Serve static files.
              middlewares.push connect.static(base)
              return


            # Make directory browse-able.
            middlewares.push connect.directory(directory)
            middlewares
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
  grunt.registerTask "publish", ["clean:dist", "useminPrepare", "copy:dist", "concat", "uglify", "usemin", "cacheBust", "uncss", "cssmin", "buildcontrol", "open:dist", "connect:dist"]
