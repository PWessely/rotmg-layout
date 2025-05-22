import requests
from bs4 import BeautifulSoup
import csv

for url_name in ['daggers', 'dual-blades', 'bows', 'longbows', 'wands', 'staves', 'swords', 'katanas', 'spellblades', 'morning-stars', 'flails', 'tachis']:

    url = 'https://www.realmeye.com/wiki/{url_name}'.format(url_name=url_name)

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()  # This will now succeed

    soup = BeautifulSoup(response.text, 'html.parser')

    with open(f'static/raw-data/weapons/{url_name}.csv', mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow([f'{url_name.upper()} Image link', 'Tier', 'Name', 'Damage (Average)', 'Projectile Image link'])

        tables = soup.find_all('table')

        for table in tables:
            for row in table.find_all('tr')[1:]:
                cols = row.find_all('td')
                col_count = len(cols)
                
                if col_count >= 3:
                    img_tag = cols[0].find('img')
                    img_link = img_tag['src'] if img_tag else ''
                    img_link = "https:" + img_link if img_link.startswith('//') else img_link

                    tier = cols[1].get_text(strip=True)
                    name = cols[2].get_text(strip=True)
                    damage = cols[3].get_text(strip=True)

                    proj_img_tag = cols[-1].find('img')
                    proj_img_link = proj_img_tag['src'] if proj_img_tag else ''
                    proj_img_link = "https:" + proj_img_link if proj_img_link.startswith('//') else proj_img_link

                    writer.writerow([
                        img_link, tier, name, damage, proj_img_link
                    ])
