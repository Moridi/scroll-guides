// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CosineRanker {
    uint constant VECTOR_SIZE = 768;

    function dotProduct(int256[VECTOR_SIZE] memory vecA,
                        int256[VECTOR_SIZE] memory vecB)
                        internal pure returns (int256) {
        int256 product = 0;
        for (uint i = 0; i < VECTOR_SIZE; i++) {
            product += vecA[i] * vecB[i];
        }
        return product;
    }

    function magnitudeSquared(int256[VECTOR_SIZE] memory vec)
                            internal pure returns (int256) {
        int256 sum = 0;
        for (uint i = 0; i < VECTOR_SIZE; i++) {
            sum += vec[i] * vec[i];
        }
        return sum;
    }

    function calculateCosineSimilarity(int256[VECTOR_SIZE] memory vecA,
                                        int256[VECTOR_SIZE] memory vecB)
                                        internal pure returns (int256) {
        int256 dot = dotProduct(vecA, vecB);
        int256 magASquared = magnitudeSquared(vecA);
        int256 magBSquared = magnitudeSquared(vecB);

        require(magASquared > 0 && magBSquared > 0, "Magnitude of vectors must be greater than zero");

        int256 denominator = sqrt(magASquared * magBSquared);
        return (dot * 1e18) / denominator; // Scale result to maintain precision
    }

    function sqrt(int256 x) internal pure returns (int256 y) {
        int256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    // Function to find the top k similar vectors from allTweets to userTweets
    function findTopKSimilar(int256[VECTOR_SIZE][] memory allTweets,
                            int256[VECTOR_SIZE][] memory userTweets,
                            uint k) public pure returns (uint[] memory) {

        require(allTweets.length > 0 && userTweets.length > 0, "Tweet arrays must not be empty");
        require(k > 0 && k <= allTweets.length, "Invalid k value");

        int256[] memory scores = new int256[](allTweets.length);
        uint[] memory indices = new uint[](allTweets.length);

        for (uint i = 0; i < allTweets.length; i++) {
            indices[i] = i;
        }

        for (uint i = 0; i < allTweets.length; i++) {
            int256 score = 0;
            for (uint j = 0; j < userTweets.length; j++) {
                score += calculateCosineSimilarity(allTweets[i], userTweets[j]);
            }
            scores[i] = score / int256(userTweets.length); // Average similarity
        }

        // Simplified selection sort to find top k scores
        for (uint i = 0; i < k; i++) {
            uint maxIdx = i;
            for (uint j = i + 1; j < allTweets.length; j++) {
                if (scores[j] > scores[maxIdx]) {
                    maxIdx = j;
                }
            }
            (scores[i], scores[maxIdx]) = (scores[maxIdx], scores[i]);
            (indices[i], indices[maxIdx]) = (indices[maxIdx], indices[i]);
        }

        // Return indices of top k similar tweets
        uint[] memory topKIndices = new uint[](k);
        for (uint i = 0; i < k; i++) {
            topKIndices[i] = indices[i];
        }

        return topKIndices;
    }
}
