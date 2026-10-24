# cs61b lab08

其实整体不是很难，但是太久没学，一些 java 的基础有点忘记了。

首先是 java 的 generic 的 type erasure。 

也就是为啥不可以直接 `Collection<Node>[] result = new Collection<Node> [10]`。 直接建立一个带有初始化长度的数组呢？ 而是需要 `new Collection[10]`。

这是因为 static check 会检查合法性， 但是实际上 Collection<Node> 的类型会被擦除， 也就是无法确定数组内部放的一定是 `Collection<Node>`， 因为它和 `Collection<String>` 一样， 在运行的时候会被视为一个 class。

代码最难的部分就是 iterator 的实现，我们需要维护两个状态，一个是所在的 bucket， 一个是所在位置的自带 iterator 实现的状态。总结它的实现就是：
```java
public boolean hasNext() {
    while (位置索引合法) {
        检查当前位置的 iterator hasNext()
        true:
            return true;
        false:
            更新位置索引
            如果位置索引合法
                更新迭代器为目前位置的迭代器
    }
    都检查了一遍, 没有合法的 return false
}
```

抽象一点，这个方法就是复合数据结构下，位置编码+已有实现作为状态的一个例子。

更一般地，假设数据结构由多个子容器组成：
$D=(C_0,C_1,\ldots,C_{m-1})$

那么全局迭代状态可以表示为：
$S=(i,s_i)$

其中 $i$ 表示当前子容器的位置，$s_{i}$ 表示该子容器内部的迭代状态。

更多的例子：

**251. Flatten 2D Vector**
题目描述：

请设计并实现一个能够展开二维向量的迭代器。该迭代器需要支持 next 和 hasNext 两种操作。

实现 Vector2D 类：
    `Vector2D(int[][] vec)`：使用二维向量 vec 初始化对象。
    next()：返回二维向量中的下一个元素，并将指针向前移动一步。你可以假设所有对 `next` 的调用都是合法的，即当 `next` 被调用时，二维向量中至少存在一个后续元素。
    `hasNext()`：如果向量中仍有元素，返回 true；否则，返回 false。

这个是简化版本， 内部的状态不需要 `iterator` 维护， 而是直接用 index 维护即可。 内部的 index 在合法访问内， 这说明有下一个元素。

`hasNext()` 检查的就是 index 长度是否大于零(非空)， 是否在合法区间：
`index > 0 && index < vec[i].length`

更新 `iterator` 就是 index 重新初始化为 0。


```java
public class Vector2D:

private int row = 0;
private int col = 0;
private int[][] vec;

public Vector2D(int[][] vec) {
    this.vec = vec;
}

public boolean hasNext() {
    while (row < vec.length) {
        if (col < vec[row].length) {
            return true;
        } else {
            row += 1;
            if (row < vec.length) {
                col = 0;
            }
        }
    }
    return false;
}

public int next() {
    if (! this.hasNext()) {
        return null;
    } else {
        return this.vec[row][col++];
    }
}

```

难度升级： **当嵌套层数不固定时，原先的两个状态应该如何推广？**

还是从一个具体的例子出发开始推理吧， 假设我们有 `[1, [2,3], [[4,5],[6,7]]]`

首先最外层的位置编码我感觉不能动。 问题就变成了一个判断一个元素是否存在嵌套结构。 问题是对于一个有静态检查的语言， 都不清楚嵌套的结构， 这个可以实现么？ 我先试试我能不能 flatten 它们。 需要实现 flatten， 我的想法是我需要一个方法判断一个对象能不能被扁平化， 也就是是否包含数组这样的结构。

还真有这样的函数 `isInteger()`， 还有 `getList()` 可以消除一层嵌套。

那就非常简单了， 先找到一个位置的嵌套次数， 嵌套次数为 0 就是直接访问; 嵌套次数为 1 就是可以遍历; 嵌套次数更多， 就先访问元素。 然后基于嵌套深度， 控制访问元素的深度。

**询问AI后**： 还是我想复杂了， 也没有迁移 **DFS** 学到的知识; 其实处理一个位置的嵌套， 就是找到最深的元素， 然后先输入这个层级的元素。 也就是后面找到的层级先输出， 典型的 LIFO， stack 的行为。 而递归天然就有这个特性， 这个任务就是在每个位置上进行 DFS。
