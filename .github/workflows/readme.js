import fs from "fs";
import fetch from "node-fetch";

const token = process.env.GITHUB_TOKEN;
const username = "jprojectplatform";

// helper to call GitHub API
async function ghFetch(url) {
  const res = await fetch(url, {
    headers: { Authorization: `token ${token}` }
  });
  return res.json();
}

async function main() {
  // starred repos (ulizo mark star)
  const starred = await ghFetch(`https://api.github.com/users/${username}/starred`);
  // repos zako mwenyewe
  const own = await ghFetch(`https://api.github.com/users/${username}/repos?per_page=100`);

  let starredMd = starred.map(r => `- [${r.full_name}](${r.html_url}) - ${r.description || ""}`).join("\n");
  let otherMd = own
    .filter(r => !starred.find(s => s.id === r.id))
    .map(r => `- [${r.name}](${r.html_url}) - ${r.description || ""}`).join("\n");

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
