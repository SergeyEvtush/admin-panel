const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require("gulp-sass")(require("sass"));

const dist = "C:/openserver/domains/react-admin/admin";

gulp.task("copy-html", () => {
  return gulp.src("./app-project/src/index.html").pipe(gulp.dest(dist));
});
gulp.task("build-js", () => {
  return gulp
    .src("./app-project/src/main.js")
    .pipe(
      webpack({
        mode: "development",
        output: {
          filename: "script.js",
        },
        watch: false,
        devtool: "source-map",
        module: {
          rules: [
            {
              test: /\.(?:js|mjs|cjs)$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  targets: "defaults",
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        debug: true,
                        corejs: 3,
                        useBuiltIns: "usage",
                      },
                    ],
                    "@babel/react",
                  ],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest(dist));
});

gulp.task("build-sass", () => {
  return gulp
    .src("./app-project/scss/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(dist));
});
gulp.task("copy-api", () => {
  gulp.src("./app-project/api/**/.*").pipe(gulp.dest(dist + "/api"));
  return gulp.src("./app-project/api/**/*.*").pipe(gulp.dest(dist + "/api"));
});
gulp.task("copy-assets", () => {
  return gulp
    .src("./app-project/assets/**/*.*")
    .pipe(gulp.dest(dist + "/assets"));
});
gulp.task("watch", () => {
  gulp.watch("./app-project/src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./app-project/assets/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch("./app-project/api/**/*.*", gulp.parallel("copy-api"));
  gulp.watch("./app-project/scss/**/*.*", gulp.parallel("build-sass"));
  gulp.watch("./app-project/src/**/*.*", gulp.parallel("build-js"));
});

gulp.task(
  "build",
  gulp.parallel(
    "copy-html",
    "copy-assets",
    "copy-api",
    "build-sass",
    "build-js"
  )
);

gulp.task("default", gulp.parallel("watch", "build"));
