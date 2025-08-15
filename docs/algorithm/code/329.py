from re import M
from typing import List


class Solution:
    def __init__(self):
        self.directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0]
        ]
        
    
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        res = 0

        memo = [[0] * len(matrix[0]) for _ in range(len(matrix))]

        def dfs(i, j):
            # 这一步很重要，在缓存里面有的话，直接返回
            if memo[i][j] != 0:
                return memo[i][j]

            memo[i][j] = 1
            for d in self.directions:
                x, y = i + d[0], j + d[1]
                if 0 <= x < len(matrix) and 0 <= y < len(matrix[0]) and matrix[x][y] > matrix[i][j]:
                    memo[i][j] = max(memo[i][j], dfs(x, y) + 1)

            return memo[i][j]

        if not matrix:
            return 0

        for i in range(len(matrix)):
            for j in range(len(matrix[0])):
                if memo[i][j] != 0:
                    res = max(res, memo[i][j])
                else:
                    res = max(res, dfs(i, j))

        return res
