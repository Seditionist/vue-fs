import { Column, OneToMany, ManyToOne, Entity } from "typeorm";

import { Base } from "./Base";
import { File } from "./File";

@Entity("Folders")
export class Folder extends Base {

	@ManyToOne(() => Folder)
	@Column({ type: "int", name: "ParentFolderID", nullable: true })
	ParentFolderID: number

	@Column({ type: "nvarchar", name: "FolderName", nullable: false, length: "50" })
	FolderName: string

	@OneToMany(() => File, file => file.FolderID)
	files: File[]

	@OneToMany(() => Folder, folder => folder.ParentFolderID)
	subFolders: Folder[]
}