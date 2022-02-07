class Solution:
    def GetNumberOfK(self, data, k):
        start = self.get_start(data, k)
        end = self.get_end(data, k)
        return end - start

    def get_start(self, data, k):
        l, r = 0, len(data) - 1
        while l <= r:
            mid = (l + r) // 2
            if data[mid] < k:
                l = mid + 1
            else:
                r = mid - 1
        return l

    def get_end(self, data, k):
        l, r = 0, len(data) - 1
        while l <= r:
            mid = (l + r) // 2
            if data[mid] <= k:
                l = mid + 1
            else:
                r = mid - 1
        return l