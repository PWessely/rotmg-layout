// src/lib/utils/loadCSV.ts
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export async function loadCSV(type: string, fileName: string): Promise<any[]> {
  const basePath = `src/lib/data/${type}/`;

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
      const res = path.resolve(basePath + file);
      const text = fs.readFileSync(res, 'utf-8');

      const { data } = Papa.parse(text, {
        header: true,
        skipEmptyLines: true
      });

      allData.push(...data);
    }

    return allData;
  } else {
    const path = basePath + `${fileName}.csv`;
    const res = await fetch(path);
    const text = await res.text();

    const { data } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true
    });

    return data;
  }
}
