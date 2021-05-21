import fs from "fs";

export class Path {

	public static isDir(path: fs.PathLike): boolean {
		try {
			const stat = fs.lstatSync(path);
			return stat.isDirectory();
		} catch (e) {
			return false;
		}
	}
}