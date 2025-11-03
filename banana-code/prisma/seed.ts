import { PrismaClient } from "@prisma/client";
import { seedAccounts } from "./seeders/AccountSeeder";
import { seedCourses } from "./seeders/CourseSeeder";
import { seedEnrollments } from "./seeders/EnrollmentSeeder";

const prisma = new PrismaClient();

async function main() {
  console.log(`Iniciando la siembra de datos...`);
  await seedAccounts(prisma);
  await seedCourses(prisma);
  await seedEnrollments(prisma);
  console.log(`Siembra de datos finalizada.`);
}

main()
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error("Error durante la siembra:", error);
      process.exit(1);
    }
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
