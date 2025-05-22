import os
import csv

def update_csv_headers(folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith('.csv'):
            file_path = os.path.join(folder_path, filename)

            with open(file_path, 'r', newline='', encoding='utf-8') as f:
                reader = list(csv.reader(f))
                if reader:
                    reader[0][0] = 'Image link'

            with open(file_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerows(reader)

for folder in ['static/raw-data/abilitys', 'static/raw-data/weapons']:
    update_csv_headers(folder)