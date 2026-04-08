// src/services/mahabhulekh/scraper.service.js
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const LAUNCH_OPTS = {
  headless: false,
  slowMo: 50,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  defaultViewport: null,
};

const ID = {
  district: 'ContentPlaceHolder1_ddlMainDist',
  taluka: 'ContentPlaceHolder1_ddlTalForAll',
  village: 'ContentPlaceHolder1_ddlVillForAll',
  rbtnSearchTypeCTS: 'ContentPlaceHolder1_rbtnSearchType_0',
  ctsInput: 'ContentPlaceHolder1_txtcsno',
  searchBtn: 'ContentPlaceHolder1_btnsearchfind',
  surveyResult: 'ContentPlaceHolder1_ddlsurveyno',
  mobileInput: 'ContentPlaceHolder1_txtmobile1',
  captchaInput: 'ContentPlaceHolder1_txtcaptcha',
  submitBtn: 'ContentPlaceHolder1_btnmainsubmit',
};

const SITE_URL = 'https://bhulekh.mahabhumi.gov.in/NewBhulekh.aspx';

class MahabhulekhScraper {

  async scrapeLandRecord(params = {}) {
    const {
      districtValue,
      talukaValue,
      villageValue,
      fullSurveyInput,
      mobile = '9999999999',
    } = params;

    let browser = null;
    let finalHTML = '';

    try {
      browser = await puppeteer.launch(LAUNCH_OPTS);
      const page = await browser.newPage();

      // Anti-detection
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(Function.prototype, 'caller', { get: () => null });
        Object.defineProperty(Function.prototype, 'callee', { get: () => null });
      });

      await page.goto(SITE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
      await delay(4000);

      // Select District, Taluka, Village
      let frame = await this.findFrameWithElement(page, `#${ID.district}`);
      await this.setSelectValue(frame, ID.district, districtValue); 
      await delay(1800);

      await this.setSelectValue(frame, ID.taluka, talukaValue); 
      await delay(1800);

      await this.setSelectValue(frame, ID.village, villageValue); 
      await delay(3000);

      // Select CTS Search Type
      frame = await this.findFrameWithElement(page, `#${ID.rbtnSearchTypeCTS}`);
      await frame.evaluate(id => document.getElementById(id)?.click(), ID.rbtnSearchTypeCTS);
      await delay(2000);

      // Enter Survey Number prefix
      const prefix = fullSurveyInput.split('/')[0].trim();
      frame = await this.findFrameWithElement(page, `#${ID.ctsInput}`);
      await frame.type(`#${ID.ctsInput}`, prefix, { delay: 80 });
      await delay(1500);

      // Click Search
      frame = await this.findFrameWithElement(page, `#${ID.searchBtn}`);
      await frame.click(`#${ID.searchBtn}`);
      await delay(2500);

      // Select exact survey from dropdown
      frame = await this.findFrameWithElement(page, `#${ID.surveyResult}`);
      const surveyOptions = await frame.$$eval(`#${ID.surveyResult} option`, opts =>
        opts.map(o => ({ label: o.textContent.trim(), value: o.value })).filter(o => o.label)
      );

      const match = surveyOptions.find(o => o.label === fullSurveyInput) || surveyOptions[0];
      if (match) {
        await this.setSelectValue(frame, ID.surveyResult, match.value);
      }
      await delay(2500);

      // Enter Mobile Number
      console.log(`Entering Mobile: ${mobile}`);
      frame = await this.findFrameWithElement(page, `#${ID.mobileInput}`);
      
      await frame.evaluate((id, val) => {
        const el = document.getElementById(id);
        if (el) {
          el.focus();
          el.value = val;
          ['input', 'change', 'blur', 'keydown'].forEach(eventType => {
            el.dispatchEvent(new Event(eventType, { bubbles: true }));
          });
        }
      }, ID.mobileInput, mobile);

      await delay(1000);

      // CAPTCHA Instruction
      console.log('\nPlease solve the CAPTCHA and CLICK the SUBMIT button yourself.');
      console.log(' Wait until the FULL result appears (table with मालकाचे नाव, खाता, क्षेत्र, etc.)');
      console.log('Do not close the browser until you see " Result page loaded successfully!"');

      // ====================== IMPROVED POLLING ======================
      const startTime = Date.now();
      const MAX_WAIT_MS = 180000; // 3 minutes

      let successDetected = false;

      while (Date.now() - startTime < MAX_WAIT_MS) {
        await delay(2000);

        try {
          finalHTML = await page.content();
        } catch (e) {
          console.log(' Browser was closed by user');
          return {
            verified: false,
            reason: "Browser was closed before result loaded",
            html: "",
            retry: true
          };
        }

        const lowerHTML = finalHTML.toLowerCase();

        // Strong success conditions based on your actual result screenshot
        const hasOwnerTable = lowerHTML.includes('मालकाचे नाव') || 
                             lowerHTML.includes('owner name') ||
                             lowerHTML.includes('malik') ||
                             finalHTML.includes('gvOwnerDetails');

        const hasKhataArea = (lowerHTML.includes('खाता') || lowerHTML.includes('khata')) &&
                            (lowerHTML.includes('क्षेत्र') || lowerHTML.includes('area') || 
                             lowerHTML.includes('8.80'));

        const hasSurveyInfo = lowerHTML.includes('सर्व्हे नंबर') || 
                             lowerHTML.includes('गट नंबर') ||
                             lowerHTML.includes(fullSurveyInput.toLowerCase());

        const hasResultTable = hasOwnerTable || hasKhataArea || hasSurveyInfo;

        // Check if still stuck on CAPTCHA error
        const hasCaptchaError = lowerHTML.includes('invalid captcha') || 
                               lowerHTML.includes('incorrect captcha') ||
                               lowerHTML.includes('कॅप्चा चुकीचा') ||
                               lowerHTML.includes('captcha') && lowerHTML.includes('wrong');

        if (hasResultTable && !hasCaptchaError) {
          console.log(' Result page loaded successfully!');
          successDetected = true;
          break;
        }

        if (hasCaptchaError) {
          console.log('Still showing CAPTCHA error. Please re-enter correct CAPTCHA and click Submit again.');
        }

        // Progress log every 10 seconds
        if ((Date.now() - startTime) % 10000 < 2500) {
          console.log(` Waiting for result... (${Math.floor((Date.now() - startTime)/1000)}s elapsed)`);
        }
      }

      const isSuccess = successDetected && finalHTML.length > 70000;

      return {
        verified: isSuccess,
        surveyLabel: match?.label || fullSurveyInput,
        html: finalHTML,
        retry: !isSuccess,
        reason: isSuccess ? null : "Result not detected or incomplete"
      };

    } catch (err) {
      console.error('ERROR:', err.message);
      return {
        verified: false,
        reason: err.message.includes('Target closed') || err.message.includes('Session closed') 
                  ? "Browser was closed by user" 
                  : err.message,
        html: finalHTML || '',
        retry: true
      };
    } finally {
      if (browser) {
        // await browser.close();   // Keep commented during development
      }
    }
  }

  // Helper Methods
  async setSelectValue(frame, id, value) {
    return frame.evaluate((id, val) => {
      const el = document.getElementById(id);
      if (el) {
        el.value = val;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return !!el;
    }, id, value);
  }

  async findFrameWithElement(page, selector, timeout = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      for (const f of page.frames()) {
        if (await f.$(selector)) return f;
      }
      await delay(400);
    }
    throw new Error(`Element ${selector} not found in any frame`);
  }
}

module.exports = new MahabhulekhScraper();