from bs4 import BeautifulSoup
import csv
import re

# Read HTML content from file
with open("static/temp.txt", "r", encoding="utf-8") as file:
    html_content = file.read()

# Parse HTML with BeautifulSoup
soup = BeautifulSoup(html_content, "html.parser")

# Extract the table
table = soup.find("table")

# Extract the base filename from the header (e.g., "Single Stat Enchantments")
header_text = table.find("th", colspan="6").get_text(strip=True)
filename_base = re.sub(r'\W+', '', header_text.replace(" ", ""))  # Remove special chars and whitespace
csv_filename = f"static/raw-data/enchants/{filename_base}.csv"

# Get image src from the header
image_tag = table.find("img")
image_src = image_tag["src"] if image_tag else ""

# Extract table headers from the second row (column names), but overwrite first two
th_elements = table.find_all("tr")[1].find_all("th")
headers = ["Image link", "Enchantment Name"] + [th.get_text(strip=True) for th in th_elements[2:]]


rows = []
for tr in table.find_all("tr")[2:]:  # Skip the first two rows
    tds = tr.find_all("td")
    first_td = tds[0]
    
    # Extract image src from the first <td>
    img_tag = first_td.find("img")
    row_img_src = img_tag["src"] if img_tag else ""
    
    cols = [row_img_src]  # Start with the image link from the row
    
    for td in tds[1:]:
        for br in td.find_all("br"):
            br.replace_with(" ")
        cols.append(td.get_text())
    
    rows.append(cols)

# Write to CSV
with open(csv_filename, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(headers)
    writer.writerows(rows)

print(f"CSV file '{csv_filename}' has been created.")
