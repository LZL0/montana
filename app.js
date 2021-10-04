const puppeteer = require("puppeteer");
const states = require("./states.json");

async function getNumbers() {
  try {
    let data = [];

    const browser = await puppeteer.launch();
    const objKeys = Object.keys(states);

    Promise.all(

    );

    for (let index = 0; index < objKeys.length; index++) {
      const page = await browser.newPage();

      const stateName = objKeys[index];
      const state = states[stateName];
      await page.goto(state.url, { waitUntil: "networkidle0" });

      let stateData = {
        cases: 0,
        hospitalizations: 0,
        deaths: 0,
      };

      if (state.casesSelector) {
        stateData["cases"] = await getNumber(page, state.casesSelector);
      }

      if (state.hospitalizationsSelector) {
        stateData["hospitalizations"] = await getNumber(
          page,
          state.hospitalizationsSelector
        );
      }

      if (state.deathsSelector) {
        stateData["deaths"] = await getNumber(page, state.deathsSelector);
      }

      console.log(stateData);

      data[stateName] = stateData;

      await page.close();
    }

    console.log(data);

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

async function getNumber(page, selector) {
  await page.waitForSelector(selector);
  const element = await page.$(selector);
  const number = await page.evaluate((el) => el.textContent, element);

  console.log(number);

  return formatNumber(number);
}

function formatNumber(string) {
    string = string.replace(',', '');
    return Number.parseInt(string);
}

getNumbers();
