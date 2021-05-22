import { Column, OneToMany, ManyToOne, Entity, Index } from "typeorm";

import { Base } from "./Base";
import { File } from "./File";

@Entity("Folders")
@Index(["ParentFolderID", "FolderName"], { unique: true })
export class Folder extends Base {

	@Index()
	@ManyToOne(() => Folder)
	@Column({ type: "int", name: "ParentFolderID", nullable: true })
	ParentFolderID: number | null


	@Column({ type: "nvarchar", name: "FolderName", nullable: false, length: "50" })
	FolderName: string

	@OneToMany(() => File, file => file.FolderID)
	files: File[]

	@OneToMany(() => Folder, folder => folder.ParentFolderID)
	subFolders: Folder[]
}