class Solution:
    def FindNumbersWithSum(self, array, tsum):
        l = 0
        r = len(array) - 1
        while l < r:
            sum1 = array[l] + array[r]
            if sum1 == tsum:
                break
            elif sum1 > tsum:
                r -= 1
            else:
                l += 1
        if l >= r:
            return []
        return [array[l], array[r]]