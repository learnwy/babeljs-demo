import { readdirAsync, existsSync } from "./fs";
import { getProjectInfo, resolveBase } from "./path";
import { prompt } from "inquirer";

type IterProjectCallback = (
	projectName: string,
	absolutePath: string,
) => Promise<void>;

async function travelUserSelectProjectsInner(callback: IterProjectCallback) {
	const projectNames = await readdirAsync(resolveBase("packages"));
	const { selectProjectNames } = await prompt([
		{
			name: "selectProjectNames",
			type: "checkbox",
			message: "please select transpile dirs",
			choices: projectNames
				.filter((projectDir) =>
					existsSync(resolveBase("packages", projectDir, "package.json")),
				)
				.map((projectName) => ({
					name: projectName,
					value: projectName,
					checked: false,
				})),
		},
	]);
	for (let index = 0; index < selectProjectNames.length; index += 1) {
		const projectName = selectProjectNames[index]; // eslint-disable-next-line no-await-in-loop
		await callback(projectName, resolveBase("packages", projectName));
	}
}

async function travelModuleProject(callback: IterProjectCallback) {
	const projectInfo = getProjectInfo();
	await callback(projectInfo.relativePath, projectInfo.path);
}

export async function travelUserSelectProjects(
	callback: IterProjectCallback,
): Promise<void> {
	const projectInfo = getProjectInfo();
	if (projectInfo.type === "module") {
		await travelModuleProject(callback);
	} else if (projectInfo.type === "integration") {
		await travelUserSelectProjectsInner(callback);
	}
}

export async function travelAllProjects(
	callback: IterProjectCallback,
): Promise<void> {
	const projectInfo = getProjectInfo();
	if (projectInfo.type === "module") {
		await travelModuleProject(callback);
	} else if (projectInfo.type === "integration") {
		const projectNames = await readdirAsync(resolveBase("packages"));
		for (const projectName of projectNames) {
			if (existsSync(resolveBase("packages", projectName, "package.json"))) {
				// eslint-disable-next-line no-await-in-loop
				await callback(projectName, resolveBase("packages", projectName));
			}
		}
	}
}
