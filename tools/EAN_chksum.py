# EAN8/EAN13/SSCC/GTIN Code Verifier & Checksum Generator
# Usage: cat <input_list_line_seperated> | python EAN_chksum.py

from __future__ import print_function
import sys

EAN8_LEN = 8
EAN13_LEN = 13

def intArrToString(arr):
    return ''.join([str(i) for i in arr])

def generateChksum(code):
    # Note 1-indexed naming convention for parity
    evenWeights = sum([d for i,d in enumerate(code) if i%2])
    oddWeights = 3*sum([d for i,d in enumerate(code) if i%2 == 0])
    chksumVal = evenWeights + oddWeights
    chksumDigit = (10 - chksumVal%10)%10
    return chksumDigit

# Treat each line as new code in input buffer
for line in sys.stdin:
    line = line.strip()
    code = [int(i) for i in line]
    if not len(code):   # Skip empty lines
        continue
    if len(line) == EAN8_LEN or len(line) == EAN13_LEN:   # Verify codes
        computedChksum = generateChksum(code[:-1])
        if (code[-1] == computedChksum):
            print(intArrToString(code))
        else:
            print("invalid")
    else:   # Generate checksum for incomplete codes
        code.append(generateChksum(code))
        print(intArrToString(code))
