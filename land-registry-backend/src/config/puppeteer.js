const puppeteer = require('puppeteer');

exports.launchBrowser = () =>
  puppeteer.launch({ headless: 'new' });