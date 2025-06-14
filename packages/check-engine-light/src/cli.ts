#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

import createDebug from "debug";

import type { LockFile } from "./index.js";
import checkEngineLight from "./index.js";

const enum ExitCode {
	SUCCESS = 0,
	FAILURE = 1,
}

const debug = createDebug("cel:cli");

const HELP = `
usage: check-engine-light [-h] [-d] [-e ENGINE] [-f FILE] [-v] [-w WORKSPACE] directory

positional arguments:
  directory             the directory containing the lock file to analyse

options:
  -h, --help            show this help message and exit
  -d, --dev             whether to include dev dependencies
  -e ENGINE, --engine ENGINE
                        which engine to check (defaults to: "node")
  -f FILE, --file FILE  which file to analyse (defaults to: "package-lock.json")
  -v, --version         show the current version and exit
  -w WORKSPACE, --workspace WORKSPACE
                        which workspace package to analyse (defaults to: "", the root package)
`.trim();

const { positionals: [directory], values: { dev, engine, file, help, version, workspace } } = parseArgs({
	allowPositionals: true,
	options: {
		dev: { default: false, short: "d", type: "boolean" },
		engine: { default: "node", short: "e", type: "string" },
		file: { default: "package-lock.json", short: "f", type: "string" },
		help: { default: false, short: "h", type: "boolean" },
		version: { default: false, short: "v", type: "boolean" },
		workspace: { default: "", short: "w", type: "string" },
	},
});

if (help) {
	console.log(HELP);
	process.exit(ExitCode.SUCCESS);
}

if (version) {
	const packageFile = resolve(import.meta.dirname, "..", "package.json");
	const { version } = await readJson<{ version: string }>(packageFile);
	console.log(version);
	process.exit(ExitCode.SUCCESS);
}

if (!directory) {
	console.error("error: the following arguments are required: directory");
	process.exit(ExitCode.FAILURE);
}

try {
	const baseDir = resolve(process.env.INIT_CWD ?? "", directory);
	debug("loading %s from %s", file, baseDir);
	checkEngineLight(await readJson<LockFile>(join(baseDir, file)), { dev, engine, workspace });
} catch (err) {
	console.error(err);
	process.exit(ExitCode.FAILURE);
}

async function readJson<T>(filename: string): Promise<T> {
	const data = await readFile(filename, { encoding: "utf-8" });
	return JSON.parse(data) as T;
}
