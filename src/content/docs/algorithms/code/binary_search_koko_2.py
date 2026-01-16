from ast import List
from math import ceil


class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        l, r = 1, max(piles)
        while l <= r:
            mid = l + (r - l) // 2
            cost = self.check(mid, piles)
            if cost > h:
                l = mid + 1
            else:
                r = mid - 1
        return l

    def check(self, mid, piles):
        cost = 0
        for pile in piles:
            if mid >= pile:
                cost += 1
            else:
                cost += ceil(pile / mid)
        return cost