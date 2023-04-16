const request = require("request-promise-native");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://tappedout.net/mtg-decks/primal-rain-2/?cb=1681526968";

(async () => {
  try {
    const html = await request(url);
    const $ = cheerio.load(html);

    const cards = [];

    $("div.boardList table tbody tr").each((i, element) => {
      const name = $(element).find("td.card a").text().trim();
      const amount = $(element).find("td.amount").text().trim();
      const edition = $(element).find("td.language").text().trim();

      if (language === "English") {
        cards.push({ name, amount, edition });
      }
    });

    const json = JSON.stringify({ cards }, null, 2);
    fs.writeFileSync("cards.json", json);
    console.log("Cards successfuly saved to cards.json");
  } catch (err) {
    console.log(err);
  }
})();
