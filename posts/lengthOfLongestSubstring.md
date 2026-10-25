# 3. length Of Longest Substring

好久之前写的算法了，看到题目的时候发现自己没有思路，果断回顾。

这题我记得一开始我的思路就是，一个滑动窗口沿着字符串滑动，然后窗口是是递增的。我们返回最后的窗口长度即可。当然这个想法肯定是错误的，因为在一个大的窗口内，我们无法判断 subtring 的合法性。

所有肯定是要一个动态的窗口，然后每一轮都更新最长的窗口。这里我们用两个指针实现，都是从零开始。现在问题是如何移动的问题。

假设我们固定 left，移动 right。这个是最自然的想法。在完成一次移动前，我们需要判断 `right+1` 是否合法，`s[right+1]` 是否包含在 `s[left, right+1]` 中。也就是：

```python
if right+1 < len(s) and s[right+1] not in s[left, right+1]:
    right += 1
    更新长度
```

终止的条件也很自然，就是 right 越界了 `right < len(s)`。

那遇到非法字符了呢？`s[right+1]` 在 slice `s[left, right+1]` 内部。也就是内部有个字符和新加入的字符重复了。最自然的想法就是移动 `left` 到这个内部的重复字符下一个，则新加入的字符不会重复。注意这个时候 `right` 还没有更新，也就是 `left` 先更新。再看是否重复。

当然我们需要考虑 `left` 是否存在越界问题。首先它们都是从零开始的，我们的主线也是更新 `right`，只有出现重复的元素，才更新 `left`，也就是没有越界分享。

合并就是：

```python
def length_of_longest_subtring(s: str) -> int:
    if not s:
        return 0

    max_length = 1
    left = right = 0
    while right + 1 < len(s):
        if and s[right+1] not in s[left: right+1]:
            right += 1
            max_length = max(max_length, right+1-left)
        else:
            left += 1
    return max_length
```

当然我们需要总结一下 `while` 的行为，自己总是遗忘。

给定一个 `str s`，`while i < len(s)` 就是进行 `len(s)` 次操作，直到 `index` 后的越界。（假设内部 `i` 每一轮加一。）

`while i + k < len(s) + l`，这里加入两个参数。左边的 `k` 本身就会防止越界行为，如果是 `while i + 1 < len(s)`，这说明每次的访问都是合法的。
