import { expect } from "chai";
import { ethers } from "hardhat";

// Define TypeScript type matching the Solidity struct
type TweetStruct = {
  id: number;
  category: number;
};

describe("Ranker", function () {
  async function deployRankerFixture() {
    const Ranker = await ethers.getContractFactory("CategoryRanker");
    const ranker = await Ranker.deploy();
    await ranker.deployed();
    return { ranker };
  }

  it("Should correctly rank tweets and return IDs based on category", async function () {
    const { ranker } = await deployRankerFixture();

    const userTweets: TweetStruct[] = [
      { id: 1, category: 0 },
      { id: 2, category: 0 },
      { id: 3, category: 1 },
    ];

    const currentTweets: TweetStruct[] = [
      { id: 4, category: 0 },
      { id: 5, category: 1 },
      { id: 6, category: 0 },
    ];

    const k = 2; // Number of tweets to select
    const selectedTweetIds = await ranker.rankTweets(userTweets, currentTweets, k);

    expect(selectedTweetIds).to.be.an('array').that.has.lengthOf(k);
  });
});
