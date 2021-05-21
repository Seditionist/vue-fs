import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUidIndex1621622710063 implements MigrationInterface {
    name = 'AddUidIndex1621622710063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_622aae39fd3df3d49ca0d0a230" ON "Folders" ("uid") `);
        await queryRunner.query(`CREATE INDEX "IDX_08159903c9a4c5305fb65f312b" ON "Files" ("uid") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_08159903c9a4c5305fb65f312b"`);
        await queryRunner.query(`DROP INDEX "IDX_622aae39fd3df3d49ca0d0a230"`);
    }

}
