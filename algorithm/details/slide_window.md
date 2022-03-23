---
title: Slide Window
date: 2019-9-6
tag:
 - algorithm
 - leetcode
 - slide_window
category:
 - Algorithm
---

双指针技术可以解决很多问题，在面试中往往能成为加分项。

## Problems


### 和为 S 的连续正数序列

遇到连续序列，应当要想到双指针。

::: tip

小明很喜欢数学,有一天他在做数学作业时,要求计算出9~16的和,他马上就写出了正确答案是100。但是他并不满足于此,他在想究竟有多少种连续的正数序列的和为100(至少包括两个数)。没多久,他就得到另一组连续正数和为100的序列:18,19,20,21,22。

现在把问题交给你,你能不能也很快的找出所有和为S的连续正数序列? Good Luck!

:::

  <<< @/docs/.vuepress/code/algorithm/slide_window_1.py

注意到一个细节：在相等判断以后应当右移，以免陷入死循环。

### 和为 S 的两个数

:::tip
输入一个递增排序的数组和一个数字S，在数组中查找两个数，使得他们的和正好是S，如果有多对数字的和等于S，输出两个数的乘积最小的。
:::

  <<< @/docs/.vuepress/code/algorithm/slide_window_2.py


### Number of Substrings With Only 1s

[link](https://leetcode.com/problems/number-of-substrings-with-only-1s/)

这个题目可以用滑动窗口，但是也存在其他巧妙的方法。

### 最短超串

::: tip
假设你有两个数组，一个长一个短，短的元素均不相同。找到长数组中包含短数组所有的元素的最短子数组，其出现顺序无关紧要。
返回最短子数组的左端点和右端点，如有多个满足条件的子数组，返回左端点最小的一个。若不存在，返回空数组。

示例 1:

输入:

big = [7,5,9,0,2,1,3,5,7,9,1,1,5,8,8,9,7]

small = [1,5,9]

输出: [7,10]

来源：力扣（LeetCode）
链接：[https://leetcode-cn.com/problems/shortest-supersequence-lcci](https://leetcode-cn.com/problems/shortest-supersequence-lcci)
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
:::

求解思路：

1. 设置右指针，然后不停滑动右指针直到满足题目的条件，右指针滑动到最右边则不存在结果

2. 右指针位置确定后，滑动左指针，直到不满足要求

3. 使用一个 hash_map 来记录窗口中数字出现的次数

4. 

