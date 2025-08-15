class Solution:
    def numIdenticalPairs(self, nums: 'List[int]') -> int:
        # 先构建 hash map
        res = 0
        hash_map = dict()
        for num in nums:
            res += hash_map.get(num, 0)
            hash_map[num] = hash_map.get(num, 0) + 1
        # hash_map = {1: 3, 2: 1, 3: 2}
        # 这是构造了一个hash_map
        return res