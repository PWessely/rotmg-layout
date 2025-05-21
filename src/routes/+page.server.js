// src/routes/+page.server.js
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const filePath = path.resolve('static/raw-data/classes.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const { data } = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  return {
    classes: data,
  };
}
