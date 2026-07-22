import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const outputDirectory = resolve("public/assets/cocota/clients");

const assets = [
  ["client-01-rpa.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/RPA-cocota-860x860.jpg.webp"],
  ["client-01-rpa.svg", "https://cocotastudio.com/wp-content/uploads/2026/01/RPA-logo.svg"],
  ["client-02-wild.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/wild-cocota-860x860.jpg.webp"],
  ["client-02-wild.svg", "https://cocotastudio.com/wp-content/uploads/2026/01/wild-logo.svg"],
  ["client-03-fiet.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/fiet-cocota-860x860.jpg.webp"],
  ["client-03-fiet.svg", "https://cocotastudio.com/wp-content/uploads/2026/01/FIET-logo-1.svg"],
  ["client-04-room-mate.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/Room-mate-cocota-860x860.jpg.webp"],
  ["client-04-room-mate.svg", "https://cocotastudio.com/wp-content/uploads/2026/01/Room-Mate-logo.svg"],
  ["client-05-madrid-beyond.webp", "https://cocotastudio.com/wp-content/uploads/2026/01/madridbeyond-cocota-1-860x860.jpg.webp"],
  ["client-05-madrid-beyond.svg", "https://cocotastudio.com/wp-content/uploads/2026/01/madridbeyond-logo.svg"],
  ["client-06-amadeus.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/amadeus-cocota.jpg.webp"],
  ["client-06-amadeus.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/amadeus-logo-1.svg"],
  ["client-07-avolta.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/avolta-cocota-2.jpg.webp"],
  ["client-07-avolta.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/avolta-logo-1.svg"],
  ["client-08-havaianas.mp4", "https://cocotastudio.com/wp-content/uploads/2024/06/havaianas-cocota.mp4"],
  ["client-08-havaianas.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/havaianas-logo-1.svg"],
  ["client-09-loewe.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/loewe-cocota.jpg.webp"],
  ["client-09-loewe.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/loewe-logo-1.svg"],
  ["client-10-sedra.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/sedra-cocota.jpg.webp"],
  ["client-10-sedra.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/sedra-logo-1.svg"],
  ["client-11-el-corte-ingles.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/el_corte_ingles-cocota.jpg.webp"],
  ["client-11-el-corte-ingles.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/ECI-logo-1.svg"],
  ["client-12-faster-displays.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/faster_displays-cocota.jpg.webp"],
  ["client-12-faster-displays.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/faster-logo-1.svg"],
  ["client-13-ahec.mp4", "https://cocotastudio.com/wp-content/uploads/2024/06/ahec-cocota.mp4"],
  ["client-13-ahec.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/american-hardwood-logo-1.svg"],
  ["client-14-juventud-madrid.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/juventud-cocota.jpg.webp"],
  ["client-14-juventud-madrid.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/comunidadmadrid-logo-1.svg"],
  ["client-15-valora.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/valora-cocota.jpg.webp"],
  ["client-15-valora.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/valora-logo.svg"],
  ["client-16-crusto.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/crusto-cocota.jpg.webp"],
  ["client-16-crusto.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/crusto-logo-1.svg"],
  ["client-17-rubicom.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/rubicom-cocota.jpg.webp"],
  ["client-17-rubicom.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/rubicom-logo-1.svg"],
  ["client-18-museo-del-traje.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/museo_del_traje-cocota.jpg.webp"],
  ["client-18-museo-del-traje.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/museodeltraje-logo-1.svg"],
  ["client-19-quintussa.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/quintussa-cocota.jpg.webp"],
  ["client-19-quintussa.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/quintussa-logo-1.svg"],
  ["client-20-kinepolis.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/kinepolis-cocota-2-860x860.jpg.webp"],
  ["client-20-kinepolis.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/kinepolis-logo-1.svg"],
  ["client-21-pichiavo.mp4", "https://cocotastudio.com/wp-content/uploads/2024/06/pichiavo-cocota.mp4"],
  ["client-21-pichiavo.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/pichiavo-logo-1.svg"],
  ["client-22-sincro.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/sincro-cocota.jpg.webp"],
  ["client-22-sincro.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/sincro-logo-1.svg"],
  ["client-23-gloss-raffles.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/gloss__raffles-cocota.jpg.webp"],
  ["client-23-gloss-raffles.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/glossraffles-logo-1.svg"],
  ["client-24-sexy-zebras.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/sexy_zebras-cocota.jpg.webp"],
  ["client-24-sexy-zebras.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/sexys-logo-2.svg"],
  ["client-25-ursa.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/ursa-cocota.jpg.webp"],
  ["client-25-ursa.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/ursa-logo-1.svg"],
  ["client-26-finect.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/finect-cocota.jpg.webp"],
  ["client-26-finect.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/finect-logo.svg"],
  ["client-27-unicef.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/unicef-cocota.jpg.webp"],
  ["client-27-unicef.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/unicef-logo.svg"],
  ["client-28-dame-la-brasa.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/dame_la_brasa-cocota.jpg.webp"],
  ["client-28-dame-la-brasa.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/damelabrasa-logo-1.svg"],
  ["client-29-musotoku.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/musotoku-cocota.jpg.webp"],
  ["client-29-musotoku.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/musotoku-logo-1.svg"],
  ["client-30-enresa.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/enresa-cocota.jpg.webp"],
  ["client-30-enresa.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/enresa-logo-1.svg"],
  ["client-31-sal-hierbas.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/hierbas_encantadas-cocota.jpg.webp"],
  ["client-31-sal-hierbas.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/salencantada-logo-1.svg"],
  ["client-32-circulo.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/circulo-cocota.jpg.webp"],
  ["client-32-circulo.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/circulo-logo-1.svg"],
  ["client-33-creative-europe.webp", "https://cocotastudio.com/wp-content/uploads/2024/06/europa_creativa-cocota.jpg.webp"],
  ["client-33-creative-europe.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/europa_creativa-logo-1.svg"],
  ["client-34-albidania.webp", "https://cocotastudio.com/wp-content/uploads/2024/07/albidania-cocota.jpg.webp"],
  ["client-34-albidania.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/albidania-logo-1.svg"],
  ["client-35-icex.webp", "https://cocotastudio.com/wp-content/uploads/2024/07/ICEX-cocota.jpg.webp"],
  ["client-35-icex.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/icex-logo-1.svg"],
  ["client-36-oros.webp", "https://cocotastudio.com/wp-content/uploads/2024/07/oros-cocota.jpg.webp"],
  ["client-36-oros.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/oros-logo-1.svg"],
  ["client-37-sponswatch.webp", "https://cocotastudio.com/wp-content/uploads/2024/07/Sponswatch-cocota.jpg.webp"],
  ["client-37-sponswatch.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/sponswatch-logo-1.svg"],
  ["client-38-kubuka.webp", "https://cocotastudio.com/wp-content/uploads/2024/07/kubuka-cocota.jpg.webp"],
  ["client-38-kubuka.svg", "https://cocotastudio.com/wp-content/uploads/2024/07/kubuka-logo-1.svg"],
  ["client-video-poster.webp", "https://cocotastudio.com/wp-content/uploads/2023/10/tino-rischawy-_zIpL_9sJIU-unsplash-860x1147.jpg.webp"],
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

console.log(`Downloaded ${assets.length} Cocota client assets.`);
