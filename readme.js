const fs = require("fs");
const https = require("https");

const username = "jprojectplatform";
const token = process.env.GITHUB_TOKEN;

function ghFetch(path) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: "api.github.com",
      path,
      headers: {
        "User-Agent": "node.js",
        "Authorization": `token ${token}`
      }
    }, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", reject);
  });
}

async function main() {
  // Repos ulizo-Star wewe binafsi
  const starred = await ghFetch(`/users/${username}/starred?per_page=100`);
  // Repos unazomiliki
  const own = await ghFetch(`/users/${username}/repos?per_page=100`);

  // Markdown ya Starred
  let starredMd = starred.map(r =>
    `- [${r.full_name}](${r.html_url}) ${r.description ? `- ${r.description}` : ""}`
  ).join("\n");

  // Markdown ya zingine zisizo-Starred
  let otherMd = own
    .filter(r => !starred.find(s => s.id === r.id))
    .map(r =>
      `- [${r.name}](${r.html_url}) ${r.description ? `- ${r.description}` : ""}`
    ).join("\n");

  const content = `
# Hi 👋, I'm JH4CK3R CEO OF J PROJECT PLATFORM  

Welcome to J Project Platform GitHub profile! Here are all my repositories:  

## 🌟 Starred Repositories
${starredMd || "No starred repos yet."}

## 📂 Other Repositories
${otherMd || "No other repos yet."}
`;

  fs.writeFileSync("README.md", content.trim() + "\n");
}

main();
