import { promisify } from "util";
import {
	stat,
	readdir,
	readFile,
	writeFile,
	mkdir,
	copyFile,
	existsSync,
} from "fs";
import fse from "fs-extra";
import globLib from "glob";

export const statAsync = promisify(stat);
export const readdirAsync = promisify(readdir);
export const readFileAsync = promisify(readFile);
export const writeFileAsync = promisify(writeFile);
export const mkdirAsync = promisify(mkdir);
export const copyFileAsync = promisify(copyFile);

/**
 * 逐级创建文件夹
 * @param dirPath
 */
export async function mkdirpAsync(dirPath: string) {
	return fse.mkdirp(dirPath);
}

/**
 * 将文件夹复制到目标文件夹
 * @return {Promise<void>}
 */
export async function copyDirAsync(source: string, dest: string) {
	if (existsSync(dest)) {
		throw new Error(
			`[error in copyDirAsync]: dest: [${dest}] dir is already exists`,
		);
	}

	if (!existsSync(source)) {
		throw new Error(
			`[error in copyDirAsync]: source: [${source}] dir not exists`,
		);
	}

	const sourceStat = await statAsync(source);

	if (!sourceStat.isDirectory()) {
		throw new Error(`[error in copyDirAsync]: source: [${source}] is not dir`);
	}
	return fse.copy(source, dest, { recursive: true });
}

export async function glob(pattern: string, options: globLib.IOptions) {
	return new Promise<string[]>((resolve, reject) => {
		globLib.glob(pattern, options, (error, matches) => {
			if (error) {
				reject(error);
			} else {
				resolve(matches);
			}
		});
	});
}

export { existsSync } from "fs";
