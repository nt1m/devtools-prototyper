module.exports = function(grunt) {
  var type = "type='application/javascript;version=1.8'";

  grunt.initConfig({
    pkg: require("./package.json"),
    eslint: {
      scripts: ["src/**/*.js", "src/**/*.jsx", "!src/chrome/lib/*.js"]
    },
    babel: {
      options: {
        whitelist: ["react", "es6.arrowFunctions"],
      },
      chrome: {
        files: [{
          expand: true,
          cwd: "src/chrome",
          src: "**/*.jsx",
          dest: "dist/chrome",
          ext: ".js"
        }]
      }
    },
    copy: {
      chrome: {
        files: [{
          expand: true,
          cwd: "src/chrome",
          src: ["**/*.js", "**/*.xhtml", "**/*.html"],
          dest: "dist/chrome"
        }]
      },
      other: {
        files: [{
          expand: true,
          cwd: "src",
          src: ["*.js", "chrome.manifest", "install.rdf", "skin/**/*",
                "locale/**/*"],
          dest: "dist"
        }]
      }
    },
    injector: {
      options: {
        transform: function(path) {
          path = path.replace("/dist/chrome/", "");
          return "<script src='" + path + "' " + type + "></script>";
        }
      },
      "dist/chrome/panel.html": ["dist/chrome/globals.js",
             "dist/chrome/lib/*.js",
             "!dist/chrome/lib/emmet.min.js",
             "dist/chrome/backend/storage.js",
             "dist/chrome/backend/settings.js",
             "dist/chrome/backend/template.js",
             "dist/chrome/backend/settings.js",
             "dist/chrome/backend/code.js",
             "dist/chrome/components/overlay.js",
             "dist/chrome/components/editors/editor.js",
             "dist/chrome/components/editors/editors.js",
             "dist/chrome/components/menus/menu.js",
             "dist/chrome/components/menus/*.js",
             "dist/chrome/components/settings/*.js",
             "dist/chrome/components/sidebar/button.js",
             "dist/chrome/components/sidebar/*.js",
             "dist/chrome/app.js", "dist/chrome/main.js"]
    },
    clean: {
      files: ["dist"]
    },
    zip: {
      build: {
        cwd: "dist",
        src: "dist/**/*",
        dest: "build/devtools-prototyper-<%= pkg.version %>.xpi"
      }
    },
    watch: {
      jsx: {
        files: ["src/**/*.jsx"],
        tasks: ["react"]
      },
      copy: {
        files: ["src/**/*", "!src/chrome/libs/*.js"],
        tasks: ["copy"]
      },
    },
    exec: {
      install: {
        stderr: false,
        exitCode: 8,
        command: "wget --post-file <%= zip.build.dest %> localhost:8888;"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-zip");
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-injector");

  grunt.registerTask("default", ["clean", "babel", "copy",
                                 "injector", "eslint"]);
  grunt.registerTask("build", ["clean", "babel", "copy", "injector", "zip"]);
  grunt.registerTask("install", ["build", "exec:install"]);
};
