
总的来说, 我们需要解决一个问题: **最短路径**. 这个问题可抽象到图论上的两个节点的最短路径问题, 我们略过一些图论的基本结论,只在必要的时候提及它们.

直接解决这个问题还是太复杂了, 就像我们做算法题一样, 先不考虑时间复杂度, 直接暴力枚举, 其中总有我们需要的答案.

假设我们有对图论最基本的认知: graph, vertex and edge.

对于给定的 graph 和 vertex `s`, 如何找到 `s` 通往其他 vertex 的 path 呢?

一个很自然的想法就是从 `s` 出发, 然后前往 `s` 的邻点, 然后从 `s` 的邻点再出发, 前往 `s` 邻点的邻点. pseudocode 如下:

```pseudocode
fun find_path(s):
    s.isVisited = true;
    for neighbor in s.neighbor():
        if !neighbor.isVisited():
            find_path(neighbor);
```
当然现在还没有讨论如何记录我们寻找的 path, 现在暂且视为访问了,就是记录了吧.

注意到,按这种方式搜索,我们实际用到的边的数量总是比节点数量少一.基于一个图论的基本定理,这种搜索方式经过的节点和边,实际上形成了一棵树.

基于树的良好的性质:一个节点到另一个节点的路径唯一.我们只需与记录我们的搜索过程,很容易恢复为我们需要的路径.

我们选择用 edgeTo int[] 来记录. 当然按照课程的思路,我们还是采取简化的思路,用 index 作为 node.那 edgeTo[v] = w 的含义就是可以从 w 出发前往 v.

补充后的 pseudocode 如下:

```pseudocode
fun find_path(s):
    s.isVisited = true;
    for w in s.neighbor():
        if !w.isVisited:
            edgeTo[w] = s
            find_path(w)
```


我们实际上已经完成了基本的 `DFS`. 

## BFS: 寻找无权图的最短路径

接下来我们讨论如何找到最小的问题. 假设我们需要找到 `s` 到 `v` 的最短的 path. 很自然的. 它可以归结于 `s` 的邻点到 `v` 的最短 path 问题. 最后基于 tree 的 path 唯一性, 我们就可以找到这条路径.

因为 edge 没有权重, 所以两个点之间我们可以看成单位距离. 我们的搜索策略就是沿着一个同心圆, 往同心圆半径扩大的方向搜索. 什么意思, 就是从 `s` 出发, 搜索离 `s` 距离单位距离为 1 的点. 然后再从 `s` 出发, 搜索离 `s` 距离单位距离为 2 的点. 按这种搜索方式, 我们总是可以找到的 `s` 到 `v` 的最短路径. 

既然我们讨论的是最短的 path, 我们自然需要一个计数器, 来记录路径长度. 这里我们用 `distTo int[]`, 如 `distTo[v] =1` 就表示 `s` 到 `v` 的长度为 1.


然后需要开始区分"发现"与"探索". 可以把 `s.neighbor()` 视为发现, 我们在这一步这是找到了可以探索的节点, 实际上还没有探索. `edgeTo[w] = s` 我们记录了如果到达后, 可以理解为探索完成了. 所以现在的逻辑就是: 

1. 先找出待探索名单 —— 发现
2. 探索名单

这时候出现了一个问题, 就是我们只探索了名单中的其中一个, 但是我们需要 `find_path(w)`. 也就是按我们刚讨论的"同心圆"式的搜索方式, 我们在搜索距离为 `k` 的节点的时候, 确更新了距离为 `k+1` 的节点名单. 也就是我们需要一个容器, 用来存放探索名单, 先放进的去, 需要先探索. (FIFO) 很自然地我们就需要一个 **queue**. 

也就是我们的元素需要从 queue 里面取出来, 然后发现的内容需要放入 queue.

我们写出 pseudocode:

```pseudocode
fun find_shortest_path(s):

    fringe = new queue()
    s.isVisited = true
    fringe.add(s)

    while fringe !empty:
        v = fringe.pop()

        for w in v.neighbor():
            if !w.isVisited:
                edgeTo[v] = w
                distTo[w] = distTo[v] + 1
                w.isVisited = true
                fringe.add(true)
```

## Priority Queue 与 Dijkstra

接下来我们讨论, 如果 edge 存在权重(正), 那这个方法可以处理么? 假设 edge `E(s,v)` 的权重为 3, 我们可以理解为 `s` 和 `v` 中间存在两个虚拟节点(产生 3 条单位 edge). 然后我们的算法就可以生效了. 但是这会出现一个问题: 就是如果权重的极差非常大, 那我们用来记录的 `list` 就会非常大. 比如 `E(s, v)` 权重 为 1000000, 难道我们需要这么多虚拟节点和额外进行这么多操作么? 这当然不现实. 还有一个问题就是: `s` 到 `t` 有两条路, 我们需要短的那一条. 假设中间节点都只有一个, 那我们如何控制探索的顺序, 保证可以找到最短的路径呢?

接下来我们引入一种的新的数据结构, 可以很好的处理我们的探索顺序问题. 一个非常自然的写想法就是给数据加上优先级,优先级高的优先探索. 这需要我们的数据可以比较, 因为我们需要找出优先级最高的元素. 这就是接下来我们要讨论的 **Priority Queue**. 可以把它理解为一个盒子, 我们可以放入很多东西, 但是取或者查看的时候只能拿出"最小"的元素.

实现这个 ADT, 一个比较好的方式就是使用 **mini heap**. 它是一种特殊的 BStree. 一个 mini heap 满足一下条件:

1. 每个 parent 都小于等于其 child(children)
2. 叶子的缺失只能出现在底部.

我们需要实现的方法:

1. `add` 添加一个元素
2. `get` 查看最小的元素
3. `remove` 删除最小的元素然后返回.



我们整体的探索思路就变成:

1. 初始化一个 PQ, 源点 `s` priority 设置为 0, 其余的点设置为 `inf`(也就是初始都是不可达的状态. distTo 也需要初始化.)
2. 探索 PQ, 然后 relax 当前探索 node 的边.

relax 是啥?  就是基于当前最佳的距离,更新需要探索的名单的权重.

整体的思路就是: 从 `s` 出发, 先去近的邻点; 然后从邻点出发, 再去最近的邻点... 最后我们的探索路线会形成一棵 SPT, 就是 源点到各个节点最短 path 做成的 tree.

这种算法就是经典的 **Dijkstra's Algorithm**, pseudocode 如下:

```pseudocode
fun find_shortest_path_by_dijkstra(s):
    pq = new PQ()
    pq.add(s, 0)
    pd.add(others, inf)

    while pq !empty:
        v = pq.pop()
        relax(v)

    fun relax(v):
        for w in v.neighbor():
            if w.isVisited:
                return
            if distTo[v] + weight(v, w) <= distTo[w]:
                distTo[w] = distTo[v] + weight[v, w]
                edgeTo[w] = v
                pq.setPriority(w, distTo[w])

```
## Dijkstra 的限制与 A*

接下来我们讨论这个算法的一些限制. 首先它没办法处理负数权重的边. 我们更新时间priority的策略就是基于一个更优的路径.也就是我们探索到某个点的时候.从源点到这个点的最短路径以及被找到了.如果含有负权重的 edge, 我们想象一个环形图:从而`s`出发到`t`沿着环路,然后`w`到另一边每经过的邻点是负权重的.这种情况下,从另外一边额外的探索,反而会更新到`w`的最短路径,它完全破坏了算法.

其次是, 我们如果只需要到特定节点的最短路径,我们也不得不搜索中间的路径.这一点比较容易改进, 我们可以估计这个最短距离. 也就是我们直接从估计值开始搜索, 这就是 **A*** 算法的思路.
