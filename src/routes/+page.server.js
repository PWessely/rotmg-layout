// src/routes/+page.server.js
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const classFilePath = path.resolve('static/raw-data/classes.csv');
  const classFileContent = fs.readFileSync(classFilePath, 'utf-8');

  const ringFilePath = path.resolve('static/raw-data/rings/rings.csv');
  const ringFileContent = fs.readFileSync(ringFilePath, 'utf-8');

  const { data: classData } = Papa.parse(classFileContent, {
    header: true,
    skipEmptyLines: true,
  });
  const { data: ringDataRaw } = Papa.parse(ringFileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const getTierValue = (tier) => {
    if (tier === 'UT') return 100;
    if (tier === 'ST') return 101;
    const num = parseInt(tier, 10);
    return isNaN(num) ? 999 : num;
  };

  const ringData = ringDataRaw.sort((a, b) => getTierValue(a.Tier) - getTierValue(b.Tier));

  return {
    classes: classData,
    rings : ringData,
  };
}
