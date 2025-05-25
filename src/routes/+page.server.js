// src/routes/+page.server.js
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';
// @ts-ignore
import Papa from 'papaparse';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const classFilePath = path.resolve('src/lib/data/classes.csv');
  const classFileContent = fs.readFileSync(classFilePath, 'utf-8');

  const ringFilePath = path.resolve('src/lib/data/rings/rings.csv');
  const ringFileContent = fs.readFileSync(ringFilePath, 'utf-8');

  const enchantFilePath = path.resolve('src/lib/data/enchantments.csv');
  const enchantFileContent = fs.readFileSync(enchantFilePath, 'utf-8');

  const { data: classData } = Papa.parse(classFileContent, {
    header: true,
    skipEmptyLines: true,
  });
  const { data: ringDataRaw } = Papa.parse(ringFileContent, {
    header: true,
    skipEmptyLines: true,
  });
  const { data: enchantData } = Papa.parse(enchantFileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const getTierValue = (/** @type {string} */ tier) => {
    if (tier === 'UT') return 100;
    if (tier === 'ST') return 101;
    const num = parseInt(tier, 10);
    return isNaN(num) ? 999 : num;
  };

  const ringData = ringDataRaw.sort((/** @type {{ Tier: string; }} */ a, /** @type {{ Tier: string; }} */ b) => getTierValue(a.Tier) - getTierValue(b.Tier));

  return {
    classes: classData,
    rings : ringData,
    enchantments: enchantData,
  };
}
