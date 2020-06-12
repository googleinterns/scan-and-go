import sys
for line in sys.stdin:
    line = line.strip()
    if len(line) != 7:
        continue
    code = [int(i) for i in line]
    sum1 = 0
    sum2 = 0
    for i in range(len(code)):
        if (i%2):
            sum1 += code[i]
        else:
            sum2 += 3*code[i]
    chksum_val = sum1 + sum2
    chksum_digit = (10 - chksum_val%10)%10
    code.append(chksum_digit)
    print(''.join([str(i) for i in code]))
