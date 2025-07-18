#!/usr/bin/env bash

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: ./bin/version.sh <version>"
  echo "This will update the version for all packages"
  exit 1
fi

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo 'Git working directory not clean.'
  exit 1
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$HERE/.."

commitAndTag() {
  git add \
    "$ROOT/package-lock.json" \
    "$ROOT/packages/check-engine-light/package.json"
  git commit --message "$1"
  git tag "$1"
}

useNpm() {
  npm --prefix="$ROOT" "$@"
}

VERSION="$(useNpm version --workspace 'packages/check-engine-light' "$1" | sed -n '2p')"
commitAndTag "$VERSION"
