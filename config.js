/* eslint-disable no-undef */
global.console = {
    ...console,
    log: jest.fn((message) => process.stdout.write(`${message}\n`))
  };