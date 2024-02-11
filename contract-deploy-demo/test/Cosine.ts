import { expect } from "chai";
import { ethers } from "hardhat";

describe("CosineRanker", function () {
  async function deployCosineRankerFixture() {
    const CosineRanker = await ethers.getContractFactory("CosineRanker");
    const cosineRanker = await CosineRanker.deploy();
    await cosineRanker.deployed();
    return { cosineRanker };
  }

  it("Should correctly find top K similar vectors", async function () {
    const { cosineRanker } = await deployCosineRankerFixture();

    const allTweetsVectors = [
      Array(768).fill(0).map(() => ethers.BigNumber.from(1)),
      Array(768).fill(0).map(() => ethers.BigNumber.from(2)),
    ];

    const userTweetsVectors = [
      Array(768).fill(0).map(() => ethers.BigNumber.from(1)),
    ];

    const k = 1;
    const topKIndices = await cosineRanker.findTopKSimilar(allTweetsVectors, userTweetsVectors, k);

    expect(topKIndices).to.be.an('array').that.has.lengthOf(k);
  });
});
