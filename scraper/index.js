import axios from 'axios';
import * as cheerio from 'cheerio';
import saveFile from './saveFile.js';

import { entryRequirements } from './processing.js';

/**
 * Retrieve HTML from webpage (url)
 */
async function getPageHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

async function scrapeSite(url) {
  const html = await getPageHTML(url);
  const $ = cheerio.load(html);

  // build page data
  const course = {};

  // Scrape basic course data
  course.title = $('meta[property="og:title"]').attr('content');
  course.lastUpdated = $('meta[property="og:updated_time"]').attr('content');
  course.ucasCode = $('#keydetails .ug-ucas-code-text').text();
  course.year = $(".ug-course-full-year").text();

  // format start date
  course.starts = $(".ug-start-month-feature").text().split(/\r?\n/)[0];

  // scrape entry requirements
  console.log(url);
  course.entryRequirements = entryRequirements($);

  // Key details
  $("#keydetails ul li i").remove();

  // get fees data
  const courseCode = $('.course-ug-fee-lookup').data('course-internal-code');

  if (courseCode) {
    const response = await fetch('https://ssd.dept.shef.ac.uk/fees/ug/api/fee.php?course=' + courseCode);
    const data = await response.json();
    course.fees = data;
  }

  course.description = $('#coursedescription').html();
  course.modules = {};

  $('.uos-tabs button').each((index, element) => {
    const title = $(element).text().trim();
    const controls = $(element).attr('aria-controls');

    course.modules[index] = {
      title,
      content: $(`#${ controls }`).html(),
    };
  });

  return course;
}

const pages23 = await import('./pages/2023.js');
if (pages23.default.length) {
  let promises = [];
  let results = [];

  pages23.default.forEach(async function(url) {
    promises.push(() => {
      return scrapeSite(url);
    });
  });

  const all = Promise.all(promises.map(promise => promise()));
  const result = [];
  all.then((values) => {
    values.forEach(value => {
      result.push(value);
    })
    saveFile(result);
  });

}
