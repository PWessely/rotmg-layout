import requests
from bs4 import BeautifulSoup
import csv

ring_categories = ['health-rings', 'magic-rings', 'attack-rings', 'defense-rings', 'speed-rings', 'dexterity-rings', 'vitality-rings', 'wisdom-rings', 'untiered-rings', 'set-rings', 'limited-rings']

written_names = set()

with open('static/raw-data/rings/rings.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['Image link', 'Tier', 'Name', 'Stat Bonus'])

    for url_name in ring_categories:
        url = f'https://www.realmeye.com/wiki/{url_name}'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        tables = soup.find_all('table')

        for table in tables:
            for row in table.find_all('tr')[1:]:
                cols = row.find_all('td')
                if len(cols) >= 4:
                    img_tag = cols[0].find('img')
                    img_link = img_tag['src'] if img_tag else ''
                    img_link = "https:" + img_link if img_link.startswith('//') else img_link

                    tier = cols[1].get_text(strip=True)
                    name = cols[2].get_text(strip=True)
                    stats = cols[3].get_text(strip=True)

                    if name not in written_names:
                        writer.writerow([img_link, tier, name, stats])
                        written_names.add(name)
