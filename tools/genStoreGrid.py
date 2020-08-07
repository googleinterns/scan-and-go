# Write a csv with lots of stores to upload!
# Usage: python3 <script.py> <merchantId> > <outputfile.csv>
# Pipe the stdout from this script into the destination .csv
import sys

if (len(sys.argv) < 2):
    print("Error: Please provide merchant ID", file=sys.stderr)
    exit(1)

# Provide as input a Merchant ID
merchantId = sys.argv[1]

# Write Header
header = ["Store no.", "Store ID", "Name", "Address"]
print(",".join(header))

# Generate grid of latLong values
# correct to 4 d.p
SGCenter = (13665,1038125)
# +- (1000, 2000) will be sufficient for coverage of singapore main island
# This means we're uploading 8M stores

# Modify the step-count for range loop
# to adjust how many stores to populate in a
# evenly-spaced grid around Singapore
# For more robust testing, could also pertube
# this distribution with random noise
small_size = 100
medium_size = 25
large_size = 1
store_counter = 1
for dx in range(-1000, 1000, medium_size):
    for dy in range(-2000, 2000, medium_size):
        nLat = f"{SGCenter[0] + dx}"
        nLong = f"{SGCenter[1] + dy}"
        content = [f"{store_counter}", f"{merchantId}-{store_counter}", f"TESTSTORE_{store_counter}", f"{nLat[:-4]}.{nLat[-4:]}:{nLong[:-4]}.{nLong[-4:]}"]
        print(",".join(content))
        store_counter += 1
