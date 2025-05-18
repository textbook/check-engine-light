# Check Engine Light

Ensure your dependencies match your engine requirements.

## Usage

```shell
$ npx check-engine-light --help
usage: check-engine-light [-h] [-d] [-e ENGINE] [-f FILE] [-v] directory

positional arguments:
  directory             the directory containing the lock file to analyse

options:
  -h, --help            show this help message and exit
  -d, --dev             whether to include dev dependencies
  -e ENGINE, --engine ENGINE
                        which engine to check (defaults to: "node")
  -f FILE, --file FILE  which file to analyse (defaults to: "package-lock.json")
  -v, --version         show the current version and exit
```
