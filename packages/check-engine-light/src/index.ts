import createDebug from "debug";

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
	packages: Record<string, {
		version: string;
		resolved: string;
		integrity: string;
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
	}>;
}

export default function checkEngineLight(
	_: Pick<PackageFile, "engines">,
	{ lockfileVersion }: Pick<LockFile, "lockfileVersion" | "packages">,
): void {
	if (![2, 3].includes(lockfileVersion)) {
		throw new Error(`unsupported lockfile version: ${lockfileVersion.toFixed(0)}`);
	}
	debug("processing lockfile version %d", lockfileVersion);
}
