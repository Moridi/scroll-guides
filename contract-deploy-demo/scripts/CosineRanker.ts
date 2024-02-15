import { ethers } from "hardhat";

async function main() {
    const CosineRanker = await ethers.getContractFactory("CosineRanker");
    const cosineRanker = await CosineRanker.deploy();
    await cosineRanker.deployed();
    console.log(`CosineRanker deployed to ${cosineRanker.address}`);
    console.log(`Block explorer URL: https://sepolia.scrollscan.com/address/${cosineRanker.address}`);

    // Prepare dummy 768-dimensional vectors for demonstration
    // In practice, these should be replaced with real data
    const allTweetsVectors = [
        // Example vector with non-zero values
        Array(768).fill(0).map((_, index) => 1),
    ];
    
    const userTweetsVectors = [
        // Another example vector with non-zero values
        Array(768).fill(0).map((_, index) => 2),
    ];
    
    const k = 1;
    const topKIndices = await cosineRanker.findTopKSimilar(allTweetsVectors, userTweetsVectors, k);

    console.log("Ranked Tweet IDs from receipt:", topKIndices);

    // // Event listener adjustment with explicit type for event parameters
    // cosineRanker.on("RankedTweets", (rankedTweetIds: number[]) => {
    //     console.log("Ranked Tweet IDs:", rankedTweetIds.map(id => id.toString()));
    // });

    // // Assuming findTopKSimilar is a transaction that changes the state
    // const txResponse = await cosineRanker.findTopKSimilar(allTweetsVectors, userTweetsVectors, k);
    // const receipt = await txResponse.wait(); // Correct usage of wait

    // console.log(`Transaction hash: ${receipt.transactionHash}`);
    // console.log(`Transaction explorer URL: https://sepolia.scrollscan.com/tx/${receipt.transactionHash}`);

    // // Accessing the events from the transaction receipt
    // const rankedTweetsEvent = receipt.events?.find(e => e.event === "RankedTweets");
    // if (rankedTweetsEvent && rankedTweetsEvent.args) {
    //     // Assuming the event emits a single parameter that is an array of numbers (rankedTweetIds)
    //     const rankedTweetIds = rankedTweetsEvent.args.rankedTweetIds as number[];
    //     console.log("Ranked Tweet IDs from receipt:", rankedTweetIds.map(id => id.toString()));
    // }

    // // Remove the listener to avoid memory leaks
    // cosineRanker.removeAllListeners("RankedTweets");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
