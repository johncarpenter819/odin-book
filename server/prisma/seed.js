const { PrismaClient } = require("../generated/prisma");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const NUM_USERS = 20;
const NUM_POSTS_PER_USER = 5;
const NUM_FOLLOWS_PER_USER = 3;

async function main() {
  console.log("Start seeding...");

  const usersData = [];
  const hashedPassword = await bcrypt.hash("password123", 10);

  for (let i = 0; i < NUM_USERS; i++) {
    const sex = faker.helpers.arrayElement(["MALE", "FEMALE", "OTHER"]);
    usersData.push({
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: hashedPassword,
      bio: faker.lorem.sentence(),
      profilePhotoUrl: faker.image.avatar(),
      dateOfBirth: faker.date.past({ years: 30, refDate: "2000-01-01" }),
      city: faker.location.city(),
      state: faker.location.state(),
      phoneNumber: faker.phone.number(),
      sex,
    });
  }
  await prisma.user.createMany({ data: usersData, skipDuplicates: true });

  const allUsers = await prisma.user.findMany();
  if (allUsers.length === 0)
    return console.log("No users created. Exiting seed.");

  const postsToCreate = [];
  allUsers.forEach((user) => {
    for (let i = 0; i < NUM_POSTS_PER_USER; i++) {
      postsToCreate.push({
        title: faker.lorem.sentence(5),
        content: faker.lorem.paragraph(),
        authorId: user.id,
      });
    }
  });
  await prisma.post.createMany({ data: postsToCreate, skipDuplicates: true });

  const allPosts = await prisma.post.findMany();

  for (const user of allUsers) {
    const potentialFollows = allUsers.filter((u) => u.id !== user.id);
    faker.helpers
      .arrayElements(potentialFollows, NUM_FOLLOWS_PER_USER)
      .forEach((toFollow) => {
        prisma.follow
          .create({
            data: {
              followerId: user.id,
              followingId: toFollow.id,
            },
          })
          .catch(() => {});
      });

    faker.helpers.arrayElements(allPosts, 5).forEach((post) => {
      prisma.like
        .create({
          data: {
            authorId: user.id,
            postId: post.id,
          },
        })
        .catch(() => {});
    });

    faker.helpers.arrayElements(allPosts, 2).forEach((post) => {
      prisma.comment
        .create({
          data: {
            text: faker.lorem.sentence(),
            authorId: user.id,
            postId: post.id,
          },
        })
        .catch(() => {});
    });
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
