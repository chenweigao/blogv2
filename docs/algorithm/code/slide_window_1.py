class Solution:
    def FindContinuousSequence(self, tsum):
        # write code here
        l = 1
        r = 2
        res = []
        while l < r:
            sum1 = (l + r) * (r - l + 1) / 2
            if  sum1 == tsum:
                res.append(range(l, r + 1))
                r += 1
                sum1 += r
            elif sum1 < tsum:
                r += 1
                sum1 += r
            else:
                l += 1
                sum1 -= l
        return res