import { IllegalArgsError } from "./errors";
import { once } from "./fn";
import { mkdirpAsync } from "./fs";
import { StringFactory } from "./string";
import { dirname, resolve, sep } from "path";
import { existsSync } from "fs";

export interface ProjectInfo {
	type: "module" | "integration";
	path: string;
	relativePath: string;
}

function getRunDir() {
	return process.cwd();
}

function findRootProject(curPath: string, depth = 0): ProjectInfo {
	if (depth > 3) {
		throw new IllegalArgsError(
			"can't found root project, please sure you are in your root project execute this",
		);
	}

	const parentPath = dirname(curPath);

	if (existsSync(resolve(curPath, "package.json"))) {
		if (existsSync(resolve(curPath, "lerna.json"))) {
			return {
				type: "integration",
				path: curPath,
				relativePath: curPath.substr(parentPath.length + 1),
			};
		}

		if (existsSync(resolve(parentPath, "lerna.json"))) {
			return {
				type: "integration",
				path: parentPath,
				relativePath: curPath.substr(parentPath.length + 1),
			};
		}

		return {
			type: "module",
			path: curPath,
			relativePath: curPath,
		};
	}

	return findRootProject(parentPath, depth + 1);
}

export const getProjectInfo = once(() => findRootProject(getRunDir()));

/**
 * 从根项目查找路径
 * @param {string[]} paths
 */
export function resolveBase(...paths: string[]) {
	return resolve(getProjectInfo().path, ...paths);
}

/**
 * hzero-front-util 的输出位置
 * @param {string} paths
 * @return {string}
 */
export function resolveDist(...paths: string[]) {
	return resolveBase("hzero-front-util", ...paths);
}

/**
 * 自身的路径 node_modules/hzero-front-util/bin
 * @param paths
 */
export function resolveUtilBasePath(...paths: string[]) {
	return resolve(__dirname, "..", ...paths);
}

/**
 * 自身的所在的路径 node_modules/hzero-front-util
 * @param paths
 */
export function resolveUtilPath(...paths: string[]) {
	return resolve(__dirname, "../../", ...paths);
}

let uniqId = 0;
const uniqPathStringFc = new StringFactory(resolveUtilPath("tmp"));

export function requestDatePath() {
	const d = new Date();
	const year = d.getFullYear();
	const month = `${d.getMonth() + 1}`.padStart(2, "0");
	const day = `${d.getDate()}`.padStart(2, "0");
	const hour = `${d.getHours()}`.padStart(2, "0");
	const minute = `${d.getMinutes()}`.padStart(2, "0");
	const second = `${d.getSeconds()}`.padStart(2, "0");
	return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

/**
 * 获取单独的独享的文件夹
 * node_modules/hzero-front-cli/tmp/{id}-{Date("yyyy-MM-dd_HH-mm-ss")}/
 * @param {string} command - 执行的命令
 */
export async function requestUniqPath(command: string) {
	uniqId += 1;
	const dt = requestDatePath();
	const uniqPath = uniqPathStringFc
		.append(sep, command ? "" : command + sep, String(uniqId), "-", dt)
		.toString();
	await mkdirpAsync(uniqPath);
	return uniqPath;
}

/**
 * 如果以 path.sep 开头则去掉开头的 path.sep, 其他情况下原值返回
 * @param {string} path
 * @return {string}
 */
export function getNoSlashPath(path: string) {
	return path.startsWith(sep) ? path.substr(1) : path;
}

export { dirname, resolve, extname, join } from "path";
