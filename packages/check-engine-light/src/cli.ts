import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

import createDebug from "debug";

import type { LockFile, PackageFile } from "./index.js";
import checkEngineLight from "./index.js";

const enum ExitCode {
	SUCCESS = 0,
	FAILURE = 1,
}

const debug = createDebug("cel:cli");

const HELP = `
usage: ${(process.env.npm_lifecycle_script ?? "check-engine-light")} [-h] [-v] directory

positional arguments:
  directory      the directory containing the package{,-lock}.json to analyse

options:
  -h, --help     show this help message and exit
  -v, --version  show the current version and exit
`.trim();
const { INIT_CWD } = process.env;

const { positionals: [directory], values: { help, version } } = parseArgs({
	allowPositionals: true,
	options: {
		help: { default: false, short: "h", type: "boolean" },
		version: { default: false, short: "v", type: "boolean" },
	},
});

if (help) {
	console.log(HELP);
	process.exit(ExitCode.SUCCESS);
}

if (version) {
	const packageFile = resolve(import.meta.dirname, "..", "package.json");
	const { version } = await readJson<PackageFile>(packageFile);
	console.log(version);
	process.exit(ExitCode.SUCCESS);
}

if (!directory) {
	console.error("error: the following arguments are required: directory");
	process.exit(ExitCode.FAILURE);
}

if (!INIT_CWD) {
	console.error("error: missing required environment variable INIT_CWD");
	process.exit(ExitCode.FAILURE);
}

try {
	const baseDir = resolve(INIT_CWD, directory);

	debug("loading package{,-lock}.json from %s", baseDir);

	checkEngineLight(
		await readJson<PackageFile>(join(baseDir, "package.json")),
		await readJson<LockFile>(join(baseDir, "package-lock.json")),
	);
} catch (err) {
	console.error(err);
	process.exit(ExitCode.FAILURE);
}

async function readJson<T>(filename: string): Promise<T> {
	const data = await readFile(filename, { encoding: "utf-8" });
	return JSON.parse(data) as T;
}
