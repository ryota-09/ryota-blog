const { writeFileSync } = require("fs")
const Parser = require("rss-parser");
const parser = new Parser();

(async () => {
  let jsonFeed = {};
  const feed = await parser.parseURL("https://zenn.dev/ryota_09/feed?all=1");
  const items = feed.items.map((data) => {
    return data;
  });
  jsonFeed = items;
  writeFileSync("src/static/rss/data.json", JSON.stringify(jsonFeed));
})();