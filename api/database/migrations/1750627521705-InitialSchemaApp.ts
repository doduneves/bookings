import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchemaApp1750627521705 implements MigrationInterface {
  name = 'InitialSchemaApp1750627521705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("userId" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roominglists" ("roomingListId" character varying NOT NULL, "eventId" character varying NOT NULL, "hotelId" character varying NOT NULL, "rfpName" character varying NOT NULL, "cutOffDate" date NOT NULL, "status" character varying NOT NULL DEFAULT 'Active', "agreement_type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7b683a825151e382d022977a04d" PRIMARY KEY ("roomingListId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("bookingId" character varying NOT NULL, "hotelId" character varying NOT NULL, "eventId" character varying NOT NULL, "guestName" character varying NOT NULL, "guestPhoneNumber" character varying NOT NULL, "checkInDate" date NOT NULL, "checkOutDate" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_35a5c2c23622676b102ccc3b113" PRIMARY KEY ("bookingId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rooming_list_bookings" ("booking_id" character varying NOT NULL, "rooming_list_id" character varying NOT NULL, CONSTRAINT "PK_d8ecc50f452e2fa849d125d3c04" PRIMARY KEY ("booking_id", "rooming_list_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9426de889543faa821e07e2bcc" ON "rooming_list_bookings" ("booking_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f551bf98a1ae9fd3f9aa770aa" ON "rooming_list_bookings" ("rooming_list_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rooming_list_bookings" ADD CONSTRAINT "FK_9426de889543faa821e07e2bccb" FOREIGN KEY ("booking_id") REFERENCES "bookings"("bookingId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooming_list_bookings" ADD CONSTRAINT "FK_4f551bf98a1ae9fd3f9aa770aa5" FOREIGN KEY ("rooming_list_id") REFERENCES "roominglists"("roomingListId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooming_list_bookings" DROP CONSTRAINT "FK_4f551bf98a1ae9fd3f9aa770aa5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooming_list_bookings" DROP CONSTRAINT "FK_9426de889543faa821e07e2bccb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4f551bf98a1ae9fd3f9aa770aa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9426de889543faa821e07e2bcc"`,
    );
    await queryRunner.query(`DROP TABLE "rooming_list_bookings"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "roominglists"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
