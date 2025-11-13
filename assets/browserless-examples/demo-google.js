export default async function ({ page }) {

  function delay(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time)
    });
  }

  await page.goto('https://www.google.com/', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  // close popup if any
  // try {
  //   const acceptButton = await page.$('button[aria-label="Accept all"]');
  //   if (acceptButton) {
  //     await acceptButton.click();
  //     await delay(1000); // wait for 1 second after clicking
  //   }
  // }
  // catch (e) {
  //   console.log('No popup to close');
  // }

  await delay(500 + Math.random() * 500);

  // inside google search input, type "browserless" and hit enter
  await page.type('*[name="q"]', 'browserless');
  await page.keyboard.press('Enter');

  // wait for 5 seconds
  await delay(5000);

  // await page.waitForTimeout(4000)

  // not working
  // await page.waitForSelector('#search');

  // take a full page screenshot of the results
  // const screenshot = await page.screenshot({ fullPage: true });


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
  const screenshot = await page.screenshot({
    fullPage: true,
  });

  return screenshot;
}