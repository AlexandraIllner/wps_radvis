import generated from '@angular-devkit/build-angular/plugins/karma';

module.exports = function (config) {
  const isCI = !!process.env.CI;
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      generated,
    ],
    client: {
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    reporters: ['progress', 'kjhtml', 'junit'],

    junitReporter: {
      outputDir: 'test-results',
      outputFile: 'junit.xml',
      useBrowserName: false,
    },

    /*
    auskommentierte Teile für Linux-Systeme,
    die ChromeHeadless nicht out of the box unterstützen
    LINUX:
    browsers: ['google-chrome-stable --headless', 'ChromeHeadlessCI'],
    */
    browsers: ['ChromeHeadless'],
    singleRun: isCI,
    restartOnFileChange: !isCI,
    customLaunchers: {
      ChromeHeadlessCI: {
        // LINUX
        // base: 'google-chrome-stable --headless',
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },
  });
};
