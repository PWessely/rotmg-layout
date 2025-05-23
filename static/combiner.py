import csv
import os
from glob import glob

# Folder containing the CSV files
input_folder = "static/raw-data/enchants"
output_file = "static/raw-data/enchantments.csv"

# Get list of all CSV files in the folder
csv_files = glob(os.path.join(input_folder, "*.csv"))

# Combine all files into one
with open(output_file, "w", newline="", encoding="utf-8") as outfile:
    writer = None
    for i, file in enumerate(csv_files):
        with open(file, "r", encoding="utf-8") as infile:
            reader = csv.reader(infile)
            header = next(reader)
            if writer is None:
                writer = csv.writer(outfile)
                writer.writerow(header)  # Write header once
            for row in reader:
                writer.writerow(row)

print(f"Combined CSV saved to '{output_file}'.")
