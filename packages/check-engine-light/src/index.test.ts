import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, it } from "node:test";

import type { LockFile } from "./index.ts";
import checkEngineLight from "./index.ts";

describe("checkEngineLight", () => {
	it("errors if lockfile version is wrong", () => {
		assert.throws(
			() => checkEngineLight({ lockfileVersion: 1, packages: {} }),
			{ message: "unsupported lockfile version: 1" },
		);
	});

	it("errors if no engines specification to meet", () => {
		const name = "test-package";
		assert.throws(
			() =>
				checkEngineLight({
					lockfileVersion: 2,
					packages: { "": createPackage({ name: name }) },
				}),
			{ message: "missing field: $.engines" },
		);
	});

	it("returns if no mismatched packages", () => {
		assert.doesNotThrow(() =>
			checkEngineLight({
				lockfileVersion: 3,
				packages: { "": createPackage({ engines: { node: "*" } }) },
			}),
		);
	});

	it("errors if mismatched packages", () => {
		assert.throws(
			() =>
				checkEngineLight({
					lockfileVersion: 2,
					packages: {
						"": createPackage({ engines: { node: "^20.9" } }),
						"node_modules/matching": createPackage({
							engines: { node: ">=18" },
						}),
						"node_modules/not-matching": createPackage({
							engines: { node: "^22" },
						}),
					},
				}),
			{ message: "incompatible dependencies: not-matching" },
		);
	});

	it("works with example lockfile", async () => {
		const lockfile = await getFixture("starter-kit.json");
		assert.doesNotThrow(() => checkEngineLight(lockfile));
	});

	it("works with modified example lockfile", async () => {
		const lockfile = await getFixture("starter-kit.json");
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		lockfile.packages[""].engines!.node = "^20.9";
		assert.throws(() => checkEngineLight(lockfile, { dev: true }));
	});

	it("works with workspace packages", () => {
		const workspace = "test/package";
		assert.doesNotThrow(() =>
			checkEngineLight(
				{
					lockfileVersion: 3,
					packages: { [workspace]: createPackage({ engines: { node: "*" } }) },
				},
				{ workspace },
			),
		);
	});
});

function createPackage(
	overrides: Partial<LockFile["packages"][string]> = {},
): LockFile["packages"][string] {
	return {
		link: false,
		resolved: "",
		integrity: "",
		version: "",
		...overrides,
	};
}

async function getFixture(name: string): Promise<LockFile> {
	const path = resolve(import.meta.dirname, "..", "..", "..", "examples", name);
	return JSON.parse(await readFile(path, "utf-8")) as LockFile;
}
