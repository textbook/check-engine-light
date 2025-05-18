import argparse

parser = argparse.ArgumentParser(
    prog="check-engine-light",
)
parser.add_argument(
    "directory",
    help="the directory containing the lock file to analyse",
)
parser.add_argument(
    "-d", "--dev",
    action="store_true",
    help="whether to include dev dependencies",
)
parser.add_argument(
    "-e", "--engine",
    default="node",
    help='which engine to check (defaults to: "node")',
)
parser.add_argument(
    "-f", "--file",
    default="package-lock.json",
    help='which file to analyse (defaults to: "package-lock.json")',
)
parser.add_argument(
    "-v", "--version",
    action="store_true",
    help="show the current version and exit",
)

if __name__ == "__main__":
    parser.parse_args()
