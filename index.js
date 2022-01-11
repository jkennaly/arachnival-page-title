const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context, callback) => {
    let lineupUrl = "https://festigram.app/site/festivals/Coachella/2020"
    let responseCode = 200;
    console.log("request: " + JSON.stringify(event));
    
    if (event.queryStringParameters && event.queryStringParameters.lineupUrl) {
        lineupUrl = event.queryStringParameters.lineupUrl;
    }
    
    if (event.body) {
        let body = JSON.parse(event.body)
        if (body.festid) 
            festid = body.festid;
    }
  let result = null;
  let browser = null;

  try {
  	//await chromium.font('./.fonts/NotoColorEmoji.ttf');
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    await page.goto(lineupUrl);

    result = await page.title();
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
  console.log('Spidey sensed', result)
  return callback(null, result);
};