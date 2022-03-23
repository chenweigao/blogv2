<template><p>双指针技术可以解决很多问题，在面试中往往能成为加分项。</p>
<h2 id="problems" tabindex="-1"><a class="header-anchor" href="#problems" aria-hidden="true">#</a> Problems</h2>
<h3 id="和为-s-的连续正数序列" tabindex="-1"><a class="header-anchor" href="#和为-s-的连续正数序列" aria-hidden="true">#</a> 和为 S 的连续正数序列</h3>
<p>遇到连续序列，应当要想到双指针。</p>
<div class="custom-container tip"><p class="custom-container-title">Tips</p>
<p>小明很喜欢数学,有一天他在做数学作业时,要求计算出9~16的和,他马上就写出了正确答案是100。但是他并不满足于此,他在想究竟有多少种连续的正数序列的和为100(至少包括两个数)。没多久,他就得到另一组连续正数和为100的序列:18,19,20,21,22。</p>
<p>现在把问题交给你,你能不能也很快的找出所有和为S的连续正数序列? Good Luck!</p>
</div>
<p>&lt;&lt;&lt; @/docs/.vuepress/code/algorithm/slide_window_1.py</p>
<p>注意到一个细节：在相等判断以后应当右移，以免陷入死循环。</p>
<h3 id="和为-s-的两个数" tabindex="-1"><a class="header-anchor" href="#和为-s-的两个数" aria-hidden="true">#</a> 和为 S 的两个数</h3>
<div class="custom-container tip"><p class="custom-container-title">Tips</p>
<p>输入一个递增排序的数组和一个数字S，在数组中查找两个数，使得他们的和正好是S，如果有多对数字的和等于S，输出两个数的乘积最小的。</p>
</div>
<p>&lt;&lt;&lt; @/docs/.vuepress/code/algorithm/slide_window_2.py</p>
<h3 id="number-of-substrings-with-only-1s" tabindex="-1"><a class="header-anchor" href="#number-of-substrings-with-only-1s" aria-hidden="true">#</a> Number of Substrings With Only 1s</h3>
<p><a href="https://leetcode.com/problems/number-of-substrings-with-only-1s/" target="_blank" rel="noopener noreferrer">link<ExternalLinkIcon/></a></p>
<p>这个题目可以用滑动窗口，但是也存在其他巧妙的方法。</p>
<h3 id="最短超串" tabindex="-1"><a class="header-anchor" href="#最短超串" aria-hidden="true">#</a> 最短超串</h3>
<div class="custom-container tip"><p class="custom-container-title">Tips</p>
<p>假设你有两个数组，一个长一个短，短的元素均不相同。找到长数组中包含短数组所有的元素的最短子数组，其出现顺序无关紧要。
返回最短子数组的左端点和右端点，如有多个满足条件的子数组，返回左端点最小的一个。若不存在，返回空数组。</p>
<p>示例 1:</p>
<p>输入:</p>
<p>big = [7,5,9,0,2,1,3,5,7,9,1,1,5,8,8,9,7]</p>
<p>small = [1,5,9]</p>
<p>输出: [7,10]</p>
<p>来源：力扣（LeetCode）
链接：<a href="https://leetcode-cn.com/problems/shortest-supersequence-lcci" target="_blank" rel="noopener noreferrer">https://leetcode-cn.com/problems/shortest-supersequence-lcci<ExternalLinkIcon/></a>
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</div>
<p>求解思路：</p>
<ol>
<li>
<p>设置右指针，然后不停滑动右指针直到满足题目的条件，右指针滑动到最右边则不存在结果</p>
</li>
<li>
<p>右指针位置确定后，滑动左指针，直到不满足要求</p>
</li>
<li>
<p>使用一个 hash_map 来记录窗口中数字出现的次数</p>
</li>
<li></li>
</ol>
</template>
