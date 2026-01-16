# LC 1207
# algorithm/hash_map_2.py
class Solution:
    def uniqueOccurrences(self, arr: 'List[int]') -> bool:
        arr_dict = {}
        for n in arr:
            arr_dict[n] = arr_dict.get(n, 0) + 1
        values = list(arr_dict.values())
        return len(values) == len(set(values))

import collections
class Solution2:
    def uniqueOccurrences(self, arr: 'List[int]') -> bool:
        arr_dict = collections.Counter(arr)
        print(arr_dict.values()) # dict_values([3, 2, 1])
        return len(set(arr_dict.values())) == len(arr_dict)

arr = [1,2,2,1,1,3]
print(Solution().uniqueOccurrences(arr))
print(Solution2().uniqueOccurrences(arr))
