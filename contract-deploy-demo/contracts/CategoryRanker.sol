// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CategoryRanker {
    event RankedTweets(uint256[] rankedTweetIds);
    
    enum Category { 
        News, Personal, Humor, Promotions,
        Celebrity, Sports, Science, Activism, Art
     }

    struct Tweet {
        uint256 id;
        Category category;
    }
    
    // Function to rank tweets based on user's tweet categories and select 'k' tweets
    function rankTweets(Tweet[] calldata userTweets,
                        Tweet[] calldata currentTweets,
                        uint k) external {
        Category mostUsedCategory = findMostUsedCategory(userTweets);
        uint256[] memory selectedTweetIds = filterAndSelectTweets(currentTweets, mostUsedCategory, k);
        emit RankedTweets(selectedTweetIds);
    }

    // Simplified function to find the most used category
    function findMostUsedCategory(Tweet[] calldata tweets) private pure returns (Category) {
        uint[] memory count = new uint[](uint(Category.Art) + 1); // Assuming Art is the last in the enum
        for (uint i = 0; i < tweets.length; i++) {
            uint index = uint(tweets[i].category);
            count[index]++;
        }
        uint maxIndex = 0;
        for (uint i = 1; i < count.length; i++) {
            if (count[i] > count[maxIndex]) {
                maxIndex = i;
            }
        }
        return Category(maxIndex);
    }

    // Filter and select up to 'k' tweets with the most used category
    function filterAndSelectTweets(Tweet[] calldata tweets, Category category, uint k) private pure returns (uint256[] memory) {
        uint256[] memory tempSelectedTweetIds = new uint256[](tweets.length);
        uint count = 0;
        for (uint i = 0; i < tweets.length && count < k; i++) {
            if (tweets[i].category == category) {
                tempSelectedTweetIds[count] = tweets[i].id;
                count++;
            }
        }

        uint256[] memory selectedTweetIds = new uint256[](count);
        for (uint i = 0; i < count; i++) {
            selectedTweetIds[i] = tempSelectedTweetIds[i];
        }
        return selectedTweetIds;
    }
}
