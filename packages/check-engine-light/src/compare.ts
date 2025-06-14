import createDebug from "debug";
import { subset } from "semver";

import type { Descriptor, Options } from "./index.ts";

const debug = createDebug("cel:cmp");

export function compatible(
	[name, descriptor]: [string, Descriptor],
	spec: string,
	{ engine, dev }: Pick<Options, "dev" | "engine">,
) {
	let pkgEngine: string;

	if (descriptor.dev === true && !dev) {
		debug("skipping %s (dev dependency)", name);
		return false;
	}

	try {
		pkgEngine = getEngine(engine, descriptor);
	} catch {
		debug("skipping %s (no engine requirement)", name);
		return false;
	}

	if (subset(spec, pkgEngine)) {
		debug("%s %o compatible", name, { [engine]: pkgEngine });
		return false;
	} else {
		console.error(
			"%s %o incompatible with %o",
			name,
			{ [engine]: pkgEngine },
			{ [engine]: spec },
		);
		return true;
	}
}

export function getEngine(
	engine: string,
	{ engines }: { engines?: Record<string, string> },
): string {
	if (!engines) {
		throw new Error("missing field: $.engines");
	}
	if (!engines[engine]) {
		throw new Error(`missing field: $.engines.${engine}`);
	}
	return engines[engine];
}
