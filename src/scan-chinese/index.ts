import { join } from "../utils/path";
import { travelUserSelectProjects } from "../utils/project";
import { parse } from "@babel/core";
import ora from "ora";
import chalk from "chalk";
import { glob, readFileAsync } from "../utils/fs";
import { SimpleTask } from "../utils/simple-task";
import { traverseScanChinese } from "./traverse-scan-chinese";

async function scanFile(file: string): Promise<void> {
	const fileContent = (await readFileAsync(file)).toString();
	const ast = parse(fileContent, {
		presets: [
			require.resolve("@babel/preset-typescript"),
			require.resolve("@babel/preset-react"),
			require.resolve("@babel/preset-env"),
		],
		filename: "tmp.ts",
	});
	traverseScanChinese(ast);
}

async function scanChinese() {
	const projectOra = ora("scan chinese");
	projectOra.spinner = "dots";
	await travelUserSelectProjects(async (name, projectPath) => {
		projectOra.text = `scan[${chalk.green(name)}]`;
		projectOra.start();
		// 认为文件路径是 项目路径/src
		const rootDir = join(projectPath, "src");
		const files = await glob(rootDir + "/**/*.@(ts|js|tsx|jsx)", {});
		const task = new SimpleTask(3);
		task.addAll(files.map((file) => () => scanFile(file)));
		await task.run();
		projectOra.succeed(chalk.green(`scan[${name}]success`));
	});
}

export { scanChinese };
