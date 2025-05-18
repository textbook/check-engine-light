import assert from "node:assert/strict";
import { describe, it } from "node:test";

import checkEngineLight from "./index.ts";

describe("checkEngineLight", () => {
	it("errors if lockfile version is wrong", () => {
		assert.throws(
			() => checkEngineLight({ engines: {} }, { lockfileVersion: 1, packages: {} }),
			{ message: "unsupported lockfile version: 1" },
		);
	});
});
