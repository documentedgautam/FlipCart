const request = require("supertest");
const httpStatus = require("http-status");
const app = require("../../src/app");
const setupTestDB = require("../utils/setupTestDB");
const { User } = require("../../src/models");
const { userOne, userTwo, insertUsers } = require("../fixtures/user.fixture");

setupTestDB();

describe("User routes", () => {
  describe("GET user data", () => {
    describe("GET specific user", () => {
      test("should return 200 and the user object if data is ok", async () => {
        console.log("here 0");
        await insertUsers([userOne]);
        console.log("here 1", userOne._id);
        const res = await request(app)
          .get(`/v1/users/${userOne._id}`)
          .send();
        console.log("here 2");
        expect(res.status).toEqual(httpStatus.OK);
        console.log("here 3");
        expect(res.body).toEqual(
          expect.objectContaining({
            _id: userOne._id.toString(),
            email: userOne.email,
            name: userOne.name,
            walletMoney: userOne.walletMoney,
          })
        );
      });

      test("should return 400 if userId isn't a valid MongoID", async () => {
        await insertUsers([userOne]);
        const res = await request(app)
          .get(`/v1/users/invalidMongoID`)
          .send();

        expect(res.status).toEqual(httpStatus.BAD_REQUEST);
      });

    });

  });
});
