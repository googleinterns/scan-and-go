/* Swap two elements of an array */
const swap = (arr: any[], i: number, j: number) => {
  if (i < arr.length && j < arr.length) {
    [arr[i], arr[j]] = [arr[j], arr[i]]; // using ES6 destructuring syntax
  }
};

export class Heap<T> {
  data: T[];

  /** The comparator function that returns > 0 if a should be a parent
   * of b, returns < 0 if b should be a parent of a, and returns 0 if a
   * and b should be left unchanged with respect to each other.
   */
  compareFn: (a: T, b: T) => number;

  /* Constructor to initialize a heap */
  constructor(compareFn: (a: T, b: T) => number) {
    this.data = [];
    this.compareFn = compareFn;
  }

  /* Get the index of the parent of a node at position i */
  _parent(i: number) {
    return Math.trunc((i - 1) / 2);
  }

  /* Get the index of the left or right child of a node at position i */
  _child(i: number, dir: number) {
    return 2 * i + 1 + dir;
  }

  /* Access the min element at index 0 in the heap array */
  peek() {
    return this.data ? this.data[0] : null;
  }

  /* Return true if the heap array is empty */
  empty() {
    return this.data.length == 0;
  }

  /* Insert a new node */
  insert(node: T) {
    // Insert the new node at the end of the heap array
    this.data.push(node);

    // Bubble up the new node until it is in a correct position
    let i = this.data.length - 1;
    while (
      i > 0 &&
      this.compareFn(this.data[this._parent(i)], this.data[i]) < 0
    ) {
      swap(this.data, i, this._parent(i));
      i = this._parent(i);
    }
  }

  /* A recursive method to heapify a subtree with the root at given index */
  _heapify(i: number) {
    const l = this._child(i, 0);
    const r = this._child(i, 1);
    const n = this.data.length;
    let nextIdx = i;

    if (l < n && this.compareFn(this.data[l], this.data[nextIdx]) > 0) {
      nextIdx = l;
    }
    if (r < n && this.compareFn(this.data[r], this.data[nextIdx]) > 0) {
      nextIdx = r;
    }
    if (nextIdx != i) {
      swap(this.data, i, nextIdx);
      this._heapify(nextIdx);
    }
  }

  /* Remove the root from the heap and return it */
  remove() {
    if (this.data.length == 0) {
      return null;
    } else if (this.data.length == 1) {
      return this.data.pop();
    }

    const root = this.data[0];

    // Put the right most element of the heap at the root
    this.data[0] = this.data[this.data.length - 1];
    this.data.pop();

    // Rebalance the heap
    this._heapify(0);

    return root;
  }
}
