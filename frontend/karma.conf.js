module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    reporters: ['progress', 'kjhtml'],
    /*
    auskommentierte Teile für Linux-Systeme,
    die ChromeHeadless nicht out of the box unterstützen
    LINUX:
    browsers: ['google-chrome-stable --headless', 'ChromeHeadlessCI'],
    */
    browsers: ['ChromeHeadless'],
    singleRun: false,
    restartOnFileChange: true,
    customLaunchers: {
      ChromeHeadlessCI: {
        // LINUX
        //base: 'google-chrome-stable --headless',
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },
  });
};
