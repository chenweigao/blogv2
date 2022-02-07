class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        l, r = 1, max(piles)
        while l < r:
            mid = l + (r - l) // 2
            cost = self.check(mid, piles)
            # 耗时太多，说明速度太慢了
            if cost > h:
                l = mid + 1
            else:
                r = mid
        return l

    def check(self, mid, piles):
        cost = 0
        for pile in piles:
            if mid >= pile:
                cost += 1
            else:
                # 向上取整
                cost += ceil(pile / mid)
                # cost += (pile + mid - 1) // mid
        return cost

class Test(unittest.TestCase):
    def setUp(self) -> None:
        self.s = Solution()

    def test_1(self):
        piles = [3, 6, 7, 11]
        H = 8
        res = self.s.minEatingSpeed(piles, H)
        self.assertEqual(4, res)

    def test_2(self):
        piles = [30, 11, 23, 4, 20]
        H = 6
        res = self.s.minEatingSpeed(piles, H)
        self.assertEqual(23, res)

    def test_3(self):
        piles = [312884470]
        H = 312884469
        res = self.s.minEatingSpeed(piles, H)
        self.assertEqual(2, res)

    def test_4(self):
        piles = [1000000000]
        H = 2
        res = self.s.minEatingSpeed(piles, H)
        self.assertEqual(500000000, res)


if __name__ == '__main__':
    unittest.main()