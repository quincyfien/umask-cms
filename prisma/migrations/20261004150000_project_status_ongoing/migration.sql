-- AlterEnum
BEGIN;
CREATE TYPE "ProjectStatus_new" AS ENUM ('PLANNED', 'ONGOING', 'COMPLETED');
ALTER TABLE "ContentItem" ALTER COLUMN "projectStatus" TYPE "ProjectStatus_new" USING ("projectStatus"::text::"ProjectStatus_new");
ALTER TYPE "ProjectStatus" RENAME TO "ProjectStatus_old";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";
DROP TYPE "public"."ProjectStatus_old";
COMMIT;
