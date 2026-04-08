// src/jobs/workers/verify.worker.js

const scraper = require('../../services/mahabhulekh/scraper.service');
const parser = require('../../services/mahabhulekh/parser.service');
const verifier = require('../../services/mahabhulekh/verifier.service');

module.exports = async function(job) {
  const { input } = job.data;

  const scraped = await scraper.scrapeLandRecord(input);
  const parsed = parser.parseHTML(scraped.html);

  const result = verifier.verify({
    input,
    scraped: parsed
  });

  return result;
};