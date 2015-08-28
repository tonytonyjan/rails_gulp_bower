gulp = require 'gulp'
$ = require('gulp-load-plugins')()
browserSync = require('browser-sync').create()
spawn = require('child_process').spawn

gulp.task 'default', ['serve', 'application.css', 'application.js']

gulp.task 'serve', ['watch'], ->
  rails = spawn('rails', [ 's' ])
  rails.stdout.on 'data', (buffer) -> console.log buffer.toString().trim()
  rails.stderr.on 'data', (buffer) ->
    buf = buffer.toString().trim()
    console.error buf
    if buf.match 'start'
      browserSync.init proxy: 'localhost:3000'
  gulp.watch('app/views/**/*').on('change', browserSync.reload)

gulp.task 'watch', ['watch:js', 'watch:css']
gulp.task 'watch:js', ->
  gulp.watch 'app/assets/javascripts/application/**/*.{coffee,js}', ['application.js']
gulp.task 'watch:css', ->
  gulp.watch 'app/assets/stylesheets/application/**/*.{css,scss,sass}', ['application.css']

gulp.task 'application.js', ->
  gulp.src [
    'app/assets/javascripts/application/manifest.js'
    'vendor/assets/components/bootstrap/dist/js/bootstrap.js'
    'vendor/assets/components/material-design-lite/material.js'
    'app/assets/javascripts/application/**/*.{coffee,js}'
  ]
  .pipe $.if(/\.coffee$/, $.coffee())
  .pipe $.concat('application.js')
  .pipe gulp.dest 'app/assets/javascripts'
  .pipe browserSync.stream()

gulp.task 'application.css', ->
  gulp.src [
    'app/assets/stylesheets/application.scss'
    'app/assets/stylesheets/application/**/*.{css,scss,sass}'
  ]
  .pipe $.concat 'application'
  .pipe $.sass
    includePaths: ['vendor/assets/components']
  .pipe $.replace /url\((['"]?)[^\1)]*fonts\/([^\1)]+)\1\)/g, "url('<%= asset_path '$2' %>')"
  .pipe $.rename 'application.css.erb'
  .pipe gulp.dest 'app/assets/stylesheets'
  .pipe browserSync.stream()