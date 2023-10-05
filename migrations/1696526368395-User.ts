import { MigrationInterface, QueryRunner } from "typeorm";

export class User1696526368395 implements MigrationInterface {
    name = 'User1696526368395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY NOT NULL,
                "username" varchar,
                "secret" varchar
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}
