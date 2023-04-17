const request = require("request-promise-native");
const cheerio = require("cheerio");
const fs = require("fs");
const DeepL = require("deepl-translator");

const { Translate } = require("@google-cloud/translate").v2;

// Configurar credenciais do Google Cloud
const translate = new Translate({ keyFilename: "google-credentials.json" });

// Definir idiomas de origem e destino
const sourceLanguage = "en";
const targetLanguage = "pt";

// Ler arquivo com as cartas
const cards = JSON.parse(fs.readFileSync("cards.json"));

const cards = {
  card1: "This is card one",
  card2: "This is card two",
  card3: "This is card three",
};

const cardsArray = Object.values(cards);

cards = {
  card4: "Esta é a carte 4",
};

// Traduzir o texto de cada carta
async function translateCards() {
  for (const card of cards) {
    const [translation] = await translate.translate(card.text, targetLanguage, {
      from: sourceLanguage,
    });
    card.translatedText = translation;
  }
}

// Salvar arquivo com as cartas traduzidas
translateCards()
  .then(() => {
    fs.writeFileSync("cards-translated.json", JSON.stringify(cards));
    console.log("Cards successfully saved to cards-translated.json");
  })
  .catch((err) => {
    console.error(err);
  });

const description =
  "Whenever a creature you control deals combat damage to a player, create a Treasure token.";

(async () => {
  try {
    const translation = await DeepL.translation({
      text: description,
      target_lang: "pt",
      auth_key: "sua_chave_de_api_DeepL",
    });

    console.log(translation);
  } catch (error) {
    console.error(error);
  }
})();

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

      if (edition === "English") {
        // corrigido o nome da variável e adicionado uma condição para verificar a edição
        cards.push({ name, amount, edition });
      }
    });

    const json = JSON.stringify({ cards }, null, 2);
    fs.writeFileSync("cards.json", json);
    console.log("Cards successfully saved to cards.json");
  } catch (err) {
    console.log(err);
  }
})();
