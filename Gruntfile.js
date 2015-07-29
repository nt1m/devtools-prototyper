module.exports = function(grunt) {
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

  grunt.registerTask("default", ["react", "copy", "eslint"]);
  grunt.registerTask("build", ["react", "copy", "zip"]);
};
