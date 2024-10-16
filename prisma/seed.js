import prismaClient from "../utils/prismaClient.js";
import { user, card } from "./mockData.js";

async function main() {
  // 사용자 데이터 시딩
  // await prismaClient.user.deleteMany();
  // await prismaClient.user.createMany({
  //   data: user,
  //   skipDuplicates: true,
  // });

  // 카드 데이터 시딩
  await prismaClient.card.deleteMany();
  await prismaClient.card.createMany({
    data: card,
    skipDuplicates: true,
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
