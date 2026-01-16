"""
利用二分查找的思想：
需要遍历每一行得到最后的答案，这个操作顺便复习一下二分查找
"""

def find_in_array_binary_search(self, alist, target) -> bool:
    for i in range(len(alist)):
        l = 0
        r = len(alist[i]) - 1
        while l <= r:
            mid = (l + r) // 2
            # mid = l + (r - l) // 2
            if target < alist[i][mid]:
                l = mid + 1
            elif target > alist[i][mid]:
                r = mid - 1
            else:
                return True
    return False