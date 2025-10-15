import { defineConfig, globalIgnores } from "eslint/config";
import cyf from "@codeyourfuture/eslint-config-standard";
import prettier from "eslint-config-prettier";
import { configs as ts } from "typescript-eslint";

export default defineConfig(
	{
		linterOptions: { reportUnusedDisableDirectives: "error" },
	},
	cyf.configs.standard,
	ts.strict,
	ts.stylistic,
	{
		files: ["**/*.ts"],
		extends: [ts.strictTypeCheckedOnly, ts.stylisticTypeCheckedOnly],
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
	prettier,
	globalIgnores(["packages/*/lib/"]),
);
