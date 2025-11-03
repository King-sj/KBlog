# go 通用 heap 实现
Go 标准库中提供了 container/heap 包来实现堆结构，但是它并没有提供现成的堆类型，而是需要用户自己实现 heap.Interface 接口，然后通过 heap 包中的函数来操作堆。
```go
package main

import (
	"container/heap"
	"fmt"
)

// 泛型堆结构：支持任意类型T，通过compare函数定义优先级
type Heap[T any] struct {
	elements []T               // 存储堆元素的切片
	compare  func(a, b T) bool // 比较函数：a是否应该排在b前面（决定小顶/大顶）
}

// 实现heap.Interface接口的方法
func (h *Heap[T]) Len() int { return len(h.elements) }

func (h *Heap[T]) Swap(i, j int) {
	h.elements[i], h.elements[j] = h.elements[j], h.elements[i]
}

// Less方法通过compare函数判断，实现小顶/大顶的切换
func (h *Heap[T]) Less(i, j int) bool {
	return h.compare(h.elements[i], h.elements[j])
}

// Push：添加元素到堆尾
func (h *Heap[T]) Push(x interface{}) {
	h.elements = append(h.elements, x.(T))
}

// Pop：移除并返回堆尾元素（由heap包调整堆结构）
func (h *Heap[T]) Pop() interface{} {
	old := h.elements
	n := len(old)
	x := old[n-1]
	h.elements = old[:n-1]
	return x
}

// Top：返回堆顶元素但不移除
func (h *Heap[T]) top() T {
	if len(h.elements) == 0 {
		panic("heap is empty")
	}
	return h.elements[0]
}

// push 使用更直观的方法签名，让调用方使用 h.push(v)
func (h *Heap[T]) push(x T) {
	heap.Push(h, x)
}

// pop 使用更直观的方法签名，让调用方使用 h.pop()
func (h *Heap[T]) pop() T {
	if h.Len() == 0 {
		panic("heap is empty")
	}
	v := heap.Pop(h).(T)
	return v
}

type Ordered interface {
	~float32 | ~float64 | ~string | ~int | ~int8 | ~int16 | ~int32 | ~int64 |
		~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr
}

// 辅助函数：创建小顶堆（a < b时，a优先级更高）
func newMinHeap[T Ordered]() *Heap[T] {
	return &Heap[T]{
		compare: func(a, b T) bool {
			return a < b
		},
	}
}

// 辅助函数：创建大顶堆（a > b时，a优先级更高）
func newMaxHeap[T Ordered]() *Heap[T] {
	return &Heap[T]{
		compare: func(a, b T) bool {
			return a > b
		},
	}
}

func main() {
	// 示例1：int类型的小顶堆和大顶堆
	fmt.Println("=== int类型测试 ===")
	// 小顶堆：比较函数为 a < b（小元素优先级高）
	minHeap := newMinHeap[int]()
	heap.Init(minHeap)
	minHeap.push(3)
	minHeap.push(1)
	minHeap.push(4)
	fmt.Print("小顶堆弹出顺序：")
	for minHeap.Len() > 0 {
		fmt.Printf("%d ", minHeap.pop()) // 输出：1 3 4
	}
	fmt.Println()

	// 大顶堆：比较函数为 a > b（大元素优先级高）
	maxHeap := newMaxHeap[int]()
	heap.Init(maxHeap)
	maxHeap.push(3)
	maxHeap.push(1)
	maxHeap.push(4)
	fmt.Print("大顶堆弹出顺序：")
	for maxHeap.Len() > 0 {
		fmt.Printf("%d ", maxHeap.pop()) // 输出：4 3 1
	}
	fmt.Println()

	// 示例2：自定义结构体（如Node）的小顶堆和大顶堆
	type Node struct {
		u, v int
	}
	fmt.Println("\n=== 自定义Node类型测试 ===")
	// 小顶堆：按u+v的和从小到大排序
	nodeMinHeap := &Heap[Node]{
		compare: func(a, b Node) bool {
			return a.u+a.v < b.u+b.v
		},
	}
	heap.Init(nodeMinHeap)
	nodeMinHeap.push(Node{2, 3}) // 和为5
	nodeMinHeap.push(Node{1, 2}) // 和为3
	nodeMinHeap.push(Node{3, 4}) // 和为7
	fmt.Print("Node小顶堆弹出顺序（按和从小到大）：")
	for nodeMinHeap.Len() > 0 {
		n := nodeMinHeap.pop()
		fmt.Printf("(%d,%d) ", n.u, n.v) // 输出：(1,2) (2,3) (3,4)
	}
	fmt.Println()

	// 大顶堆：按u+v的和从大到小排序
	nodeMaxHeap := &Heap[Node]{
		compare: func(a, b Node) bool {
			return a.u+a.v > b.u+b.v
		},
	}
	heap.Init(nodeMaxHeap)
	nodeMaxHeap.push(Node{2, 3}) // 和为5
	nodeMaxHeap.push(Node{1, 2}) // 和为3
	nodeMaxHeap.push(Node{3, 4}) // 和为7
	fmt.Print("Node大顶堆弹出顺序（按和从大到小）：")
	for nodeMaxHeap.Len() > 0 {
		n := nodeMaxHeap.pop()
		fmt.Printf("(%d,%d) ", n.u, n.v) // 输出：(3,4) (2,3) (1,2)
	}
}

```

