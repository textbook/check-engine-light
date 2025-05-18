import argparse

parser = argparse.ArgumentParser(
    prog="check-engine-light",
)
parser.add_argument(
    "directory",
    help="the directory containing the package{,-lock}.json to analyse",
)
parser.add_argument(
    "-v", "--version",
    action="store_true",
    help="show the current version and exit",
)

if __name__ == "__main__":
    parser.parse_args()
