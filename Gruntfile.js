module.exports = function(grunt) {
  var type = "type='application/javascript;version=1.8'";

  grunt.task.registerTask("setRdfFileVersion", undefined, function() {
    var JSONManifest = grunt.file.read("package.json");
    var versionNumber = JSON.parse(JSONManifest).version;
    console.log("Setting install.rdf version to " + versionNumber + ".");

    var manifestURI = "dist/install.rdf";
    var addonManifest = grunt.file.read(manifestURI);
    addonManifest = addonManifest.replace("${version}", versionNumber);
    grunt.file.write(manifestURI, addonManifest);
    console.log("Version successfully set.");
  });

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
          src: ["**/*.js", "**/*.html"],
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
             "!dist/chrome/lib/l10n.js",
             "!dist/chrome/lib/emmet.min.js",
             "dist/chrome/backend/request.js",
             "dist/chrome/backend/storage.js",
             "dist/chrome/backend/settings.js",
             "dist/chrome/backend/template.js",
             "dist/chrome/backend/settings.js",
             "dist/chrome/backend/code.js",
             "dist/chrome/backend/ui.js",
             "dist/chrome/mixins/*.js",
             "dist/chrome/components/editors/previewer.js",
             "dist/chrome/components/editors/editor.js",
             "dist/chrome/components/editors/editors.js",
             "dist/chrome/components/menus/*.js",
             "dist/chrome/components/settings/*.js",
             "dist/chrome/components/sidebar/button.js",
             "dist/chrome/components/sidebar/*.js",
             "dist/chrome/app.js", "dist/chrome/main.js"]
    },
    clean: {
      files: ["dist", "build"]
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

  var packageJson = JSON.parse(grunt.file.read("package.json"));
  for (var packageName in packageJson.devDependencies) {
    if (packageName.indexOf("grunt-") !== -1) {
      grunt.loadNpmTasks(packageName);
    }
  }

  grunt.registerTask("default", ["clean", "babel", "copy",
                                 "injector", "setRdfFileVersion", "eslint"]);
  grunt.registerTask("build", ["clean", "babel", "copy", "injector", "setRdfFileVersion", "zip"]);
  grunt.registerTask("install", ["build", "exec:install"]);
};
