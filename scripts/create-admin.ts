import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "crypto";
import readline from "readline";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  const email = "stsllc034@gmail.com";

  const password = await ask("Enter the Administrator password: ");

  if (!password) {
    console.log("Password cannot be empty.");
    return;
  }

  const salt = randomBytes(16).toString("hex");

  const passwordHash =
    `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;

  const admin = await prisma.administrator.upsert({
    where: { email },
    update: {
      passwordHash,
      active: true,
    },
    create: {
      email,
      passwordHash,
      active: true,
    },
  });

  console.log(`Administrator account created: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error("Error creating Administrator:", error);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });