import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

interface PackageFile {
	version: string;
}

const enum ExitCode {
	SUCCESS = 0,
	FAILURE = 1
}

const { positionals: [target], values: { version } } = parseArgs({
	allowPositionals: true,
	options: { version: { type: "boolean", default: false, short: "v" } },
});

if (version) {
	const packageFile = resolve(import.meta.dirname, "..", "package.json");
	const { version } = JSON.parse(await readFile(packageFile, { encoding: "utf-8" })) as PackageFile;
	console.log(version);
	process.exit(ExitCode.SUCCESS);
}
