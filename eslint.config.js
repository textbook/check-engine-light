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
	},
	{
		ignores: ["packages/*/lib/"],
	},
);
