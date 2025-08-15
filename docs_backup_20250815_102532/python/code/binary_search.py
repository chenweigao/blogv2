class MyClass:
    # 找到第一个大于等于5的元素
    def binary_search(self, nums, target):
        l = -1
        r = len(nums)
        while l + 1 != r:
            m = (l + r) // 2
            if m < target:
                l = m
            else:
                r = m
        return r


if __name__ == '__main__':
    nums = [1, 2, 3, 5, 5, 5, 8, 9]
    target = 5
    so = MyClass()
    print(so.binary_search(nums, target))
