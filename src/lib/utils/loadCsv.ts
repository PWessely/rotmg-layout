// src/lib/utils/loadCSV.ts
import Papa from 'papaparse';

export async function loadCSV(type: string, fileName: string, fetch: typeof globalThis.fetch): Promise<any[]> {
  const basePath = `/raw-data/${type}/`;

  if (type === 'weapons') {
    const weaponFilesMap: Record<string, string[]> = {
      Dagger: ['daggers.csv', 'dual-blades.csv'],
      Sword: ['swords.csv', 'flails.csv'],
      Bow: ['bows.csv', 'longbows.csv'],
      Stave: ['staves.csv', 'spellblades.csv'],
      Wand: ['wands.csv', 'morning-stars.csv'],
      Katana: ['katanas.csv', 'tachis.csv'],
    };

    const files = weaponFilesMap[fileName] || [];
    const allData: any[] = [];

    for (const file of files) {
      const res = await fetch(basePath + file);
      const text = await res.text();

      const { data } = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });

      allData.push(...data);
    }

    return allData;
  } else {
    const res = await fetch(`${basePath}${fileName}.csv`);
    const text = await res.text();

    const { data } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    return data;
  }
}
