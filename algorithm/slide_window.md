# Slide Window

## Abstract

双指针技术可以解决很多问题，在面试中往往能成为加分项。

## Problems

### LC2024 考试的最大困扰度

>题目要求
>输入：answerKey = "TFFT", k = 1
>
>输出：3
>
>解释：我们可以将最前面的 'T' 换成 'F' ，得到 answerKey = "FFFT" 。
>或者，我们可以将第二个 'T' 换成 'F' ，得到 answerKey = "TFFF" 。
>两种情况下，都有三个连续的 'F' 。
>
>来源：力扣（LeetCode）链接：<https://leetcode-cn.com/problems/maximize-the-confusion-of-an-exam> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。




### 剑指offer 57 和为 S 的连续正数序列

遇到连续序列，应当要想到双指针。

>小明很喜欢数学,有一天他在做数学作业时,要求计算出 9~16 的和,他马上就写出了正确答案是 100。但是他并不满足于此,他在想究竟有多少种连续的正数序列的和为 100 (至少包括两个数)。没多久,他就得到另一组连续正数和为 100 的序列: 18,19,20,21,22。
>
>现在把问题交给你,你能不能也很快的找出所有和为S的连续正数序列? Good Luck!

这道题目在 leetcode 上也有类似的：

> 输入一个正整数 `target` ，输出所有和为 `target` 的连续正整数序列（至少含有两个数）。
>
> 序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。
>
> **示例 1：**
>
> 输入：target = 9
> 输出：[[2, 3, 4],[4, 5]]
>
> [剑指 Offer 57 - II. 和为s的连续正数序列](https://leetcode-cn.com/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/)

其解法如下：

```python
class Solution:
    def findContinuousSequence(self, target: int) -> List[List[int]]:
        left = 1
        right = 2
        res = []
        while left < right:
            sums = (left + right) * (right - left + 1) / 2
            if sums == target:
                res.append(list(range(left, right + 1)))
                right += 1
                sums += right
            elif sums < target:
                right += 1
                sums += right
            else:
                left += 1
                sums -= left
        return res
```

注意到一个细节：在相等判断以后应当右移，以免陷入死循环。

`sum1` 我们套入了区间求和公式：
$$
sum = (l + r) * (r - l + 1) / 2
$$
 公式的含义是，在 `[l, r]` 区间内的区间和，(首项 + 尾项) * 项数 / 2 的原理。

我们起始的 right 从 2 开始，当区间和的值比较小的时候，我们把 right 指针右移，如果区间和比较大的时候，我们把 left 指针左移。

来一个看不懂的解法，可以慢慢理解：

```python
class Solution:
    def findContinuousSequence(self, target: int) -> List[List[int]]:
        if target <= 2: # 最小的target应该是3 -> [1, 2]
            return []
        res = []
        for n in range(2, (target+1)//2): # 观察最大值为(target+1)//2，比如15最大值为8，
            temp = target - n*(n-1)//2
            if temp <= 0:
                break
            if not temp % n: # 胜哥强
                res.append([temp // n + i for i in range(n)])
        return res[::-1]
```



### 和为 S 的两个数



> 输入一个递增排序的数组和一个数字S，在数组中查找两个数，使得他们的和正好是S，如果有多对数字的和等于S，输出两个数的乘积最小的。

```python
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
```




### LC1513 仅含 1 的子串数

> 给你一个二进制字符串 s（仅由 '0' 和 '1' 组成的字符串）。
>
> 返回所有字符都为 1 的子字符串的数目。
>
> 由于答案可能很大，请你将它对 10^9 + 7 取模后返回。
>
> 示例 1：
>
> 输入：s = "0110111"
> 输出：9
> 解释：共有 9 个子字符串仅由 '1' 组成
> "1" -> 5 次
> "11" -> 3 次
> "111" -> 1 次
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/number-of-substrings-with-only-1s
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

这个题目可以用滑动窗口，但是也存在其他巧妙的方法。





### 面试题17.18 最短超串

> 假设你有两个数组，一个长一个短，短的元素均不相同。找到长数组中包含短数组所有的元素的最短子数组，其出现顺序无关紧要。
> 返回最短子数组的左端点和右端点，如有多个满足条件的子数组，返回左端点最小的一个。若不存在，返回空数组。
>
> 示例 1:
>
> 输入:
>
> big = [7, 5, 9, 0, 2, 1, 3, 5, 7, 9, 1, 1, 5, 8, 8, 9, 7]
>
> small = [1, 5, 9]
>
> 输出: [7, 10]
>
> 来源：力扣（LeetCode）
> 链接：<[https://leetcode-cn.com/problems/shortest-supersequence-lcci](https://leetcode-cn.com/problems/shortest-supersequence-lcci)>
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

求解思路：

1. 设置右指针，然后不停滑动右指针直到满足题目的条件，右指针滑动到最右边则不存在结果

2. 右指针位置确定后，滑动左指针，直到不满足要求

3. 使用一个 hash_map 来记录窗口中数字出现的次数

4. 

### LC905 按奇偶排序数组

>给你一个整数数组 `nums`，将 `nums` 中的的所有偶数元素移动到数组的前面，后跟所有奇数元素。
>
>返回满足此条件的 **任一数组** 作为答案。
>
>示例 1：
>
>输入：nums = [3, 1, 2, 4]
>输出：[2, 4, 3, 1]
>解释：[4, 2, 3, 1]、[2 ,4, 1, 3] 和 [4, 2, 1, 3] 也会被视作正确答案。
>
>来源：力扣（LeetCode）
>链接：<https://leetcode-cn.com/problems/sort-array-by-parity>
>著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

这道题目是需要我们把**所有的偶数移到奇数前面**， 很容易想到双指针的解法:

```python
class Solution:
    def sortArrayByParity(self, nums: List[int]) -> List[int]:
        left, right = 0, len(nums) - 1
        while left < right:
            while left < right and nums[left] % 2 == 0:
                left += 1
            while left < right and nums[right] % 2 != 0:
                right -= 1
            if left < right:
                nums[left], nums[right] = nums[right], nums[left]
                left += 1
                right -= 1
        return nums
```



在实现这个解法的时候，需要注意以下几点：

1. 考虑到边界条件，如果 `nums = [0]` 这种情况下，双指针的适用性。我们的条件是符合的。
2. 考虑到每次需要 `left +=1` 或者 `right -= 1`, 再加上 `while` 的判断，我们需要在每次判断的时候判断下是否越界，这点很容易忽视。
3. 在代码第 5 行，我们判断了 `nums[left] % 2 == 0`, 也就是说，`left` 指针指向的到第 9 行代码的时候已经必然是一个奇数了，我们可以放心交换！

