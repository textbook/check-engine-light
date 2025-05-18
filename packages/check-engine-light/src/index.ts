import createDebug from "debug";

import { compatible, getEngine } from "./compare.ts";

const debug = createDebug("cel:idx");

/**
 * @link https://docs.npmjs.com/cli/v10/configuring-npm/package-json
 */
export interface PackageFile {
	version: string;
	engines?: Record<string, string>;
}

/**
 * @link https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json#file-format
 */
export interface LockFile {
	name: string;
	version: string;
	lockfileVersion: number;
	packages: Record<string, Descriptor>;
}

export interface Descriptor {
	version: string;
	resolved: string;
	integrity: string;
	name?: string;
	link?: boolean;
	dev?: boolean;
	optional?: boolean;
	devOptional?: boolean;
	inBundle?: boolean;
	hasInstallScript?: boolean;
	hasShrinkwrap?: boolean;
	bin?: string | Record<string, string>;
	license?: string;
	engines?: Record<string, string>;
	dependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;
}

export interface Options {
	dev: boolean;
	engine: string;
}

export default function checkEngineLight(
	{ lockfileVersion, packages }: Pick<LockFile, "lockfileVersion" | "packages">,
	{ dev = false, engine = "node" }: Partial<Options> = {},
): void {
	debug("checking with options %o", { dev, engine });
	if (![2, 3].includes(lockfileVersion)) {
		throw new Error(`unsupported lockfile version: ${lockfileVersion.toFixed(0)}`);
	}
	debug("processing lockfile version %d", lockfileVersion);

	const targetEngine = getEngine(engine, packages[""]);
	debug('using engine specification "%s" (minimum %s)', targetEngine);

	const mismatches = Object
		.entries(packages)
		.filter(([path]) => path !== "")
		.map(([path, descriptor]): [string, Descriptor] => {
			return [getName(path), descriptor];
		})
		.filter(([name, descriptor]): boolean => compatible([name, descriptor], targetEngine, { dev, engine }));

	if (mismatches.length > 0) {
		throw new Error(`incompatible dependencies: ${mismatches.map(([name]): string => name).join(", ")}`);
	}
}

function getName(path: string): string {
	const parts = path.split("/");
	if (parts.length < 2) {
		return parts[0];
	}
	const [scope, pkg] = parts.slice(-2);
	if (scope.startsWith("@")) {
		return `${scope}/${pkg}`;
	}
	return pkg;
}
