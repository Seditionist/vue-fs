import { BaseEntity, BeforeInsert, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { classToPlain, Exclude } from "class-transformer";

import { Generic } from "../Utilities/Generic";

export abstract class Base extends BaseEntity {

	@Exclude()
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: true })
	uid: string

	@CreateDateColumn()
	createdAt: Date

	@BeforeInsert()
	seed(): void {
		this.uid = Generic.CreateUUID();
	}

	toJSON(): Record<string, unknown> {
		return classToPlain(this);
	}
}