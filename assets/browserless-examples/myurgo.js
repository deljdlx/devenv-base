export default async function ({ page , zip}) {

  function delay(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time)
    });
  }


  await page.goto('https://myurgo.fr/admin', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  const screenshot1 = await page.screenshot({
    fullPage: true,
  });


  const loginInput = await page.$('input[name="user_email"]');
  const passwordInput = await page.$('input[name="user_password"]');
  const submitButton = await page.$('button[type="submit"]');


  // fill in login form
  await loginInput.type('jdelsescaux@stimdata.com');
  await passwordInput.type('eJe3EkBZbIHYGCCSvzkb');
  await submitButton.click();

  await delay(3000);

  // 1) calculer la hauteur réelle de la page
  const height = await page.evaluate(() => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  });

  // 2) étendre le viewport
  await page.setViewport({
    width: 1920,
    height: height,
  });

  // 3) forcer overflow: visible pour éviter les clips
  await page.evaluate(() => {
    document.body.style.overflow = 'visible';
    document.documentElement.style.overflow = 'visible';
  });


  await delay(500);

  // 4) petit delay pour stabiliser le layout
  // await page.waitForTimeout(500);

  // 5) screenshot réel
  const screenshot2 = await page.screenshot({
    fullPage: true,
  });



  // base64 encode screenshots
  const screenshot1Base64 = screenshot1.toString('base64');
  const screenshot2Base64 = screenshot2.toString('base64');


  return {
    files: {
      'screen1.png': screenshot1Base64,
      'screen2.png': screenshot2Base64,
    }
  }
}

