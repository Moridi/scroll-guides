import { ethers } from "hardhat";

async function main() {
    const CategoryRanker = await ethers.getContractFactory("CategoryRanker");
    const categoryRanker = await CategoryRanker.deploy();
    await categoryRanker.deployed();
    console.log(`CategoryRanker deployed to ${categoryRanker.address}`);
    console.log(`Block explorer URL: https://sepolia.scrollscan.com/address/${categoryRanker.address}`);

    const userTweets = [
        { id: 1, category: 0 }, // News
        { id: 2, category: 0 }, // News
        { id: 3, category: 2 }  // Humor
    ];

    const currentTweets = [
        { id: 4, category: 0 }, // News
        { id: 5, category: 2 }, // Humor
        { id: 6, category: 0 }  // News
    ];

    const k = 2;

    // Adjusting the event listener for potential structure of the event data
    categoryRanker.on("RankedTweets", (rankedTweetIds: number[]) => {
        console.log("Ranked Tweet IDs:", rankedTweetIds.map(id => id.toString()));
    });
    
    const tx = await categoryRanker.rankTweets(userTweets, currentTweets, k);
    const receipt = await tx.wait(); // Ensures the transaction is mined

    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`Transaction explorer URL: https://sepolia.scrollscan.com/tx/${receipt.transactionHash}`);

    // Optionally, directly access the event from the receipt if not captured
    console.log("Events:", receipt.events?.filter(e => e.event === "RankedTweets"));

    // This is crucial in scripts to avoid memory leaks in long-running applications
    categoryRanker.removeAllListeners("RankedTweets");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
