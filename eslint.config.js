import cyf from "@codeyourfuture/eslint-config-standard";
import { config, configs as ts } from "typescript-eslint";

export default config(
	cyf.configs.standard,
	ts.strict,
	ts.stylistic,
	{
		files: ["**/*.ts"],
		extends: [
			ts.strictTypeCheckedOnly,
			ts.stylisticTypeCheckedOnly,
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"@typescript-eslint/no-floating-promises": [
				"error",
				{
					allowForKnownSafeCalls: [
						{ from: "package", name: ["describe", "it"], package: "node:test" },
					],
				},
			],
			"@typescript-eslint/no-confusing-void-expression": [
				"off",
				{ ignoreArrowShorthand: true },
			],
		},
	},
	{
		ignores: ["packages/*/lib/"],
	},
);
