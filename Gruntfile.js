module.exports = function(grunt) {
  var type = "type='application/javascript;version=1.8'";

  grunt.initConfig({
    pkg: require("./package.json"),
    eslint: {
      scripts: ["src/**/*.js", "src/**/*.jsx", "!src/lib/*.js"]
    },
    react: {
      chrome: {
        files: [{
          expand: true,
          cwd: "src",
          src: "**/*.jsx",
          dest: "chrome",
          ext: ".js"
        }]
      }
    },
    copy: {
      chrome: {
        files: [{
          expand: true,
          cwd: "src",
          src: ["**/*.js", "**/*.xhtml"],
          dest: "chrome"
        }]
      }
    },
    injector: {
      options: {
        transform: function(path) {
          path = path.replace("/chrome/", "");
          return "<script src='" + path + "' " + type + "></script>";
        }
      },
      "chrome/panel.xhtml": ["chrome/**/*.js"]
    },
    clean: {
      files: ["chrome"]
    },
    zip: {
      "build/devtools-prototyper-<%= pkg.version %>.xpi":
      ["chrome/**/*", "locale/**/*", "skin/**/*",
       "chrome.manifest", "install.rdf", "bootstrap.js"]
    },
    watch: {
      jsx: {
        files: ["src/**/*.jsx"],
        tasks: ["react"]
      },
      js: {
        files: ["src/**/*.js", "!src/libs/*.js"],
        tasks: ["copy"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-zip");
  grunt.loadNpmTasks("grunt-react");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-asset-injector");

  grunt.registerTask("default", ["clean", "react", "copy",
                                 "injector", "eslint"]);
  grunt.registerTask("build", ["clean", "react", "copy", "injector", "zip"]);
};
