// src/routes/+page.server.js
// @ts-ignore
import Papa from 'papaparse';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const classFileContent = await (await fetch('/raw-data/classes.csv')).text();
  const ringFileContent = await (await fetch('/raw-data/rings/rings.csv')).text();
  const enchantFileContent = await (await fetch('/raw-data/enchantments.csv')).text();

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
