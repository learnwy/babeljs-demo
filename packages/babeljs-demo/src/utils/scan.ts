import { parse, ParseResult } from "@babel/core";
import chalk from "chalk";
import ora from "ora";
import { existsSync, glob, readFileAsync } from "./fs";
import { join } from "./path";
import { travelUserSelectProjects } from "./project";
import { SimpleTask } from "./simple-task";
type ScanFN = (ast: ParseResult | null, file: string) => void;

async function scanFile(file: string, scanFn: ScanFN): Promise<void> {
	const fileContent = (await readFileAsync(file)).toString();
	const ast = parse(fileContent, {
		presets: [
			require.resolve("@babel/preset-env"),
			require.resolve("@babel/preset-react"),
			require.resolve("@babel/preset-typescript"),
		],
		filename: file,
	});
	scanFn(ast, file);
}

async function scan(taskName: string, scanFn: ScanFN) {
	const file = process.argv[2];
	const projectOra = ora(taskName);
	projectOra.spinner = "dots";
	if (file && existsSync(file)) {
		await scanFile(file, scanFn);
	} else {
		await travelUserSelectProjects(async (name, projectPath) => {
			projectOra.text = `scan[${chalk.green(name)}]`;
			projectOra.start(); // 认为文件路径是 项目路径/src

			const rootDir = join(projectPath, "src");
			const files = await glob(rootDir + "/**/*.@(ts|js|tsx|jsx)", {});
			const task = new SimpleTask(3);
			task.addAll(
				files.map((file) => () => {
					return file.endsWith(".d.ts")
						? Promise.resolve()
						: scanFile(file, scanFn);
				}),
			);
			await task.run();
			projectOra.succeed(chalk.green(`scan[${name}]success`));
		});
	}
}

export { scanFile, scan };
