import { Folder as _Folder } from "../Models/Folder";

export class Folder {

	public static async InsertRoot(name: string): Promise<_Folder> {
		try {
			const newFolder = new _Folder();

			newFolder.FolderName = name;

			return await newFolder.save();
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async GetFolders(uid?: string): Promise<_Folder[]> {
		try {
			const parent = await _Folder.findOne({ uid });

			// console.log(t[0]?.subFolders);

			// return t;
			// console.log(a);
			console.log(uid);
			return await _Folder.find({
				where: { ParentFolderID: (parent?.id ?? null) },
				relations: [
					"subFolders",
				],
				select: [
					"FolderName",
					"uid"
				]
			});
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async InsertSub(parentUID: string, name: string): Promise<_Folder> {
		try {
			const exists = await _Folder.findOne({ uid: parentUID });
			if (!exists) throw "parent folder does not exist";

			const newFolder = new _Folder();

			newFolder.ParentFolderID = exists.id;
			newFolder.FolderName = name;

			return await newFolder.save();
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Rename(uid: string, name: string): Promise<_Folder> {
		try {
			const folder = await _Folder.findOne({ uid });
			if (!folder) throw "folder not found";

			folder.FolderName = name;

			return await folder.save();
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Move(targetUID: string, parentUID?: string): Promise<_Folder> {
		try {
			const target = await _Folder.findOne({ uid: targetUID });
			if (!target) throw "target folder not found";

			if (parentUID) {
				const parent = await _Folder.findOne({ uid: parentUID });
				if (!parent) throw "parent folder not found";

				target.ParentFolderID = parent.id;
			}
			else
				target.ParentFolderID = null;

			return await target.save();
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Delete(uid: string): Promise<void> {
		try {
			const folder = await _Folder.findOne({ uid });
			if (!folder) throw "folder not found";

			await folder.remove();
		} catch (error) {
			throw new Error(error);
		}
	}
}