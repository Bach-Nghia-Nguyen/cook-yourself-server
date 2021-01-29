const mongoose = require("mongoose");

const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");
const Reaction = require("../models/Reaction");

const faker = require("faker");
const bcrypt = require("bcryptjs");
const { getRecipes } = require("../controllers/recipe.controller");

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is not lower than min (or the next integer greater than min
 * if min isn't an integer) and not greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const cleanData = async (startTime) => {
  try {
    await User.collection.drop();
    await Recipe.collection.drop();
    await Comment.collection.drop();
    await Reaction.collection.drop();
    // await mongoose.connection.dropDatabase();
    console.log("| Deleted all data");
    console.log("--------------------------------");
  } catch (error) {
    console.log(error);
  }
};

const generateData = async () => {
  try {
    await cleanData();
    let users = [];
    let recipes = [];

    console.log("| Create 10 users");
    console.log("---------------------------------");
    const userNum = 10;
    const otherNum = 3; // num of recipe each user, comments ore reactions each recipe
    for (let i = 0; i < userNum; i++) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("123", salt);
      await User.create({
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        avatarUrl: faker.image.avatar(),
        password,
        emailVerified: true,
      }).then(function (user) {
        console.log("Created new user: " + user.name);
        users.push(user);
      });
    }

    console.log(`| Each user writes ${otherNum} recipes`);
    console.log("--------------------------------------");
    for (let i = 0; i < userNum; i++) {
      for (let j = 0; j < otherNum; j++) {
        await Recipe.create({
          name: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          images: [
            faker.image.imageUrl(400, 300),
            faker.image.imageUrl(400, 300),
          ],
          author: users[i]._id,
        }).then(async (recipe) => {
          console.log("Created recipe: " + recipe.name);
          recipes.push(recipe);

          console.log(
            `| Each recipe has ${otherNum} comments from ${otherNum} random users`
          );
          console.log("------------------------------------------");
          for (let k = 0; k < otherNum; k++) {
            await Comment.create({
              content: faker.lorem.sentence(),
              user: users[getRandomInt(0, userNum - 1)]._id,
              recipe: recipe._id,
            });
          }

          console.log(
            `| Each recipe has ${otherNum} reactions from ${otherNum} random users`
          );
          console.log("---------------------------------------------------");
          const emojis = ["like"];
          for (let k = 0; k < otherNum; k++) {
            await Reaction.create({
              content: faker.loren.sentence(),
              user: users[getRandomInt(0, userNum - 1)]._id,
              targetType: "Recipe",
              targetId: recipe._id,
              emoji: emojis[getRandomInt(0, 0)],
            });
          }
        });
      }
    }

    console.log("| Generate Data Done");
    console.log("-----------------------------------");
  } catch (error) {
    console.log(error);
  }
};

const getRandomRecipes = async (recipeNum) => {
  console.log(`Get ${recipeNum} random recipes`);
  const totalRecipeNum = await Recipe.countDocuments();
  for (let i = 0; i < recipeNum; i++) {
    const recipe = await Recipe.findOne()
      .skip(getRandomInt(0, totalRecipeNum - 1))
      .populate("author");
    console.log(recipe);
  }
};

const main = async (resetDB = false) => {
  if (resetDB) await generateData();
  getRandomRecipes(1);
};

main(true);
