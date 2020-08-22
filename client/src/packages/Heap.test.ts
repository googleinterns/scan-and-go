import { Heap } from "src/packages/Heap";

describe("Test all public functions of the Heap class", () => {
  const minHeapCompareFn = (a: number, b: number) => b - a;
  const verifyHeap = (heap: Heap<any>) => {
    if (heap.data.length < 2) {
      return true;
    }
    const queue = [0];
    while (queue.length > 0) {
      const i = queue[0];
      queue.shift();

      const l = heap._child(i, 0);
      if (l < heap.data.length) {
        if (heap.compareFn(heap.data[i], heap.data[l]) < 0) {
          return false;
        }
        queue.push(l);
      }

      const r = heap._child(i, 1);
      if (r < heap.data.length) {
        if (heap.compareFn(heap.data[i], heap.data[r]) < 0) {
          return false;
        }
        queue.push(r);
      }
    }
    return true;
  };

  it("creates a simple min Heap", () => {
    const heap = new Heap<number>(minHeapCompareFn);
    expect(heap.data).toStrictEqual([]);
    expect(heap.compareFn).toStrictEqual(minHeapCompareFn);
  });

  it("inserts elements into the correct positions", () => {
    const heap = new Heap<number>(minHeapCompareFn);
    heap.insert(2);
    heap.insert(1);
    heap.insert(3);
    heap.insert(1);
    expect(heap.data.length).toStrictEqual(4);
    expect(verifyHeap(heap)).toEqual(true);
  });

  it("peeks the root element", () => {
    const heap = new Heap<number>(minHeapCompareFn);
    heap.insert(2);
    heap.insert(1);
    heap.insert(3);
    expect(heap.peek()).toStrictEqual(1);
  });

  it("removes the root element and rebalances the heap", () => {
    const heap = new Heap<number>(minHeapCompareFn);
    heap.insert(2);
    heap.insert(1);
    heap.insert(3);
    heap.insert(1);
    heap.remove();
    expect(heap.data.length).toStrictEqual(3);
    expect(verifyHeap(heap)).toStrictEqual(true);
  });
});
