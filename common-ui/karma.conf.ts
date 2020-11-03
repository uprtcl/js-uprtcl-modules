const path = require('path');

module.exports = (config) =>
  config.set({
    browsers: ['ChromeHeadlessNoSandbox'],
    // ## code coverage config
    coverageIstanbulReporter: {
      reports: ['lcovonly', 'text-summary'],
      combineBrowserReports: true,
      skipFilesWithNoCoverage: false,
      thresholds: {
        global: {
          statements: 10,
          branches: 10,
          functions: 10,
          lines: 10,
        },
      },
    },

    preprocessors: {
      'test/**/*.test.ts': ['webpack'],
    },
    webpack: {
      mode: 'development',
      entry: `./src/uprtcl-common-ui.ts`,
      output: {
        filename: 'bundle.js',
      },
      resolve: {
        extensions: ['.mjs', '.js', '.ts', '.json'],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader',
          },
          {
            test: /\.ts$/,
            exclude: [path.resolve(__dirname, 'test')],
            enforce: 'post',
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true },
            },
          },
        ],
      },
    },
    singleRun: true,
    concurrency: Infinity,

    plugins: [
      // resolve plugins relative to this config so that they don't always need to exist
      // at the top level
      require.resolve('karma-mocha'),
      require.resolve('karma-mocha-reporter'),
      require.resolve('karma-coverage-istanbul-reporter'),
      require.resolve('karma-snapshot'),
      require.resolve('karma-mocha-snapshot'),
      require.resolve('karma-chrome-launcher'),

      // fallback: resolve any karma- plugins
      'karma-*',
    ],
    frameworks: ['mocha', 'snapshot', 'mocha-snapshot'],
    reporters: ['mocha', 'coverage-istanbul'],
    colors: true,

    mochaReporter: {
      showDiff: true,
    },
    logLevel: config.LOG_INFO,

    restartOnFileChange: true,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },
    files: [
      {
        pattern: config.grep ? config.grep : 'test/**/*.test.ts',
        type: 'module',
        watched: false,
      },
    ],
  });
