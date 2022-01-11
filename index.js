const chromium = require('chrome-aws-lambda');
const redis = require("redis");

const client = redis.createClient({url: process.env.REDIS_URL});

exports.handler = async (event, context, callback) => {
    let lineupUrl = "https://festigram.app/site/festivals/Coachella/2020"
    let responseCode = 200;
    console.log("request: " + JSON.stringify(event));

    if(event.Records && event.Records[0] && event.Records[0].Sns && event.Records[0].Sns.Message) {
    	try {
    		const parsedMessage = JSON.parse(event.Records[0].Sns.Message)
    		lineupUrl = parsedMessage.lineupUrl
    	} catch (err) {
    		console.error('Sns Message parse error')
    		console.error(err)
    	}
    } else if (event.queryStringParameters && event.queryStringParameters.lineupUrl) {
        lineupUrl = event.queryStringParameters.lineupUrl;
    }
  const leKey = 'arach-lineup.' + lineupUrl
  let result = null;
  let browser = null;

  try {
  	await chromium.font('./.fonts/NotoColorEmoji.ttf');
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
  await client.set(leKey, JSON.stringify(result), {
		EX: 3600 * 24 * 30
	})
  return callback(null, result);
};