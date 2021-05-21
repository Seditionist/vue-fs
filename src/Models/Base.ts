import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Index, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

import { Generic } from "../Utilities/Generic";

export abstract class Base extends BaseEntity {

	@Exclude()
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({ unique: true, nullable: true })
	uid: string

	@CreateDateColumn()
	createdAt: Date

	@BeforeInsert()
	sed(): void {
		this.uid = Generic.CreateUUID();
	}
}