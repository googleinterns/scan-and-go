# create_component.py - Creates React component from sample files
# into specified folder

# Make python2/3 compatible
from __future__ import print_function
import os
import sys
import argparse
from argparse import RawTextHelpFormatter

# Make python2/3 compatible
if (sys.version_info[0] < 3):
    input = raw_input # python2 input parses strings as python syntax

PROG_DESC = """
create_component.py - Creates a React Component with
given name into the specified folder.
  - <name>.tsx
  - <name>.test.tsx
  - index.tsx
specify config settings in 'crc.config.json' within
yarn root director
"""

parser = argparse.ArgumentParser(description=PROG_DESC,formatter_class=RawTextHelpFormatter)
parser.add_argument("name",help="Name of React Component")
parser.add_argument("path",help="Directory path for component, omit filename")

args = parser.parse_args()

# Make required directory folder structure
component_folder = os.path.join(args.path,args.name);
if (os.path.isdir(component_folder)):
    opt = input("Folder exists, confirm potential overwrite(y/n):")
    if (opt != "y"):
        print("Script aborted, folder already exists")
        exit(1)
else:
    os.makedirs(component_folder);

# Read template files
__dir__ = os.getcwd();
TEMPLATE_COMPONENT_PATH = "template.tsx"  #TODO: Replace with read from crc.config.json
TEMPLATE_TEST_PATH = "template.test.tsx"  #TODO: Replace with read from crc.config.json
TEMPLATE_INDEX_PATH = "template.index.tsx"#TODO: Replace with read from crc.config.json

# Replace inline variables with specified configs
#TODO Read variable mapping from crc.config.json
var_mapping = dict()
var_mapping["$NAME"] = args.name

def parseFileLines(fname):
    file_data = ""
    with open(fname,'r') as fin:
        for line in fin:
            for k in var_mapping.keys():
                line = line.replace(k,var_mapping[k])
            file_data += line
    return file_data

def writeFileLines(fname,file_lines):
    with open(fname,'w+') as fout:
        for line in file_lines:
            fout.write(line)

# Read component template
component = parseFileLines(os.path.join(__dir__,TEMPLATE_COMPONENT_PATH))
# Read test template
test = parseFileLines(os.path.join(__dir__,TEMPLATE_TEST_PATH))
# Read index template
index = parseFileLines(os.path.join(__dir__,TEMPLATE_INDEX_PATH))

# Write files
component_file_path = os.path.join(component_folder,args.name+".tsx")
test_file_path = os.path.join(component_folder,args.name+".test.tsx")
index_file_path = os.path.join(component_folder,"index.tsx");
writeFileLines(component_file_path,component)
writeFileLines(test_file_path,test)
writeFileLines(index_file_path,index)
