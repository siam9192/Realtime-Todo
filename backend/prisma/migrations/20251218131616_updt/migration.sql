/*
  Warnings:

  - The values [Task,System,Message,Reminder] on the enum `NotificationCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `visitId` on the `notifications` table. All the data in the column will be lost.
  - You are about to alter the column `message` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(200)`.
  - You are about to drop the `active_sessions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationCategory_new" AS ENUM ('TASK_ASSIGNED', 'TASK_UPDATED', 'TASK_UNASSIGNED', 'TASK_COMPLETED', 'SYSTEM');
ALTER TABLE "notifications" ALTER COLUMN "category" TYPE "NotificationCategory_new" USING ("category"::text::"NotificationCategory_new");
ALTER TYPE "NotificationCategory" RENAME TO "NotificationCategory_old";
ALTER TYPE "NotificationCategory_new" RENAME TO "NotificationCategory";
DROP TYPE "public"."NotificationCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "active_sessions" DROP CONSTRAINT "active_sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "task_status_audit_logs" DROP CONSTRAINT "task_status_audit_logs_taskId_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "visitId",
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" CHAR(100) NOT NULL,
ALTER COLUMN "message" SET DATA TYPE CHAR(200);

-- DropTable
DROP TABLE "active_sessions";

-- AddForeignKey
ALTER TABLE "task_status_audit_logs" ADD CONSTRAINT "task_status_audit_logs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
