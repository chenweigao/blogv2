# 暴力求解
class Solution:
    def findPeakElement(self, nums: 'List[int]') -> int:
        for i in range(1, len(nums)):
            if nums[i] < nums[i-1]:
                return i-1
        return len(nums)-1

# 二分查找
class SolutionBinarySearch:
    def findPeakElement(self, nums: 'List[int]') -> int:
        n = len(nums)
        if n == 0:
            return 0
        l = 0
        r = len(nums) - 1
        while l + 1 < r:
            mid = l + (r - l) // 2
            if nums[mid] < nums[mid + 1]:
                l = mid + 1
            else:
                r = mid
        if l == n - 1 or nums[l] > nums[l + 1]:
            return l
        else:
            return r