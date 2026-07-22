import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const outputDirectory = resolve("public/assets/cocota/news");

const assets = [
  ["news-01-newsletter.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/cocota-newsletter.jpg.webp"],
  ["news-02-weconnect-conference.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/news-WEconnect_conf-1.jpg.webp"],
  ["news-03-lovie-jury.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/cocota-Lovie-awards-jury.jpg.webp"],
  ["news-04-wild.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/news-wild.jpg.webp"],
  ["news-05-havaianas-launch.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/cocota-havaianas-launch.jpg.webp"],
  ["news-06-spire.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/new-spire.jpg.webp"],
  ["news-07-disc-workshop.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/news-DISC-personality.jpg.webp"],
  ["news-08-bbnight.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/news-BBNight.jpg.webp"],
  ["news-09-upv-interface-design.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/cocota-teaching-interface-design.jpg.webp"],
  ["news-10-stratosferica.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/news-stratosferica.jpg.webp"],
  ["news-11-awwwards.webp", "https://cocotastudio.com/wp-content/uploads/2024/10/news-awwwards.jpg.webp"],
  ["news-12-paris-conference.webp", "https://cocotastudio.com/wp-content/uploads/2024/10/news-paris_conf.jpg.webp"],
  ["news-13-european-design-awards.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/cocota-edawards.jpg.webp"],
];

async function downloadAsset([filename, url]) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  const outputPath = resolve(outputDirectory, filename);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
  console.log(`Downloaded ${filename}`);
}

await mkdir(outputDirectory, { recursive: true });

for (let index = 0; index < assets.length; index += 4) {
  await Promise.all(assets.slice(index, index + 4).map(downloadAsset));
}

console.log(`Downloaded ${assets.length} Cocota news assets.`);
