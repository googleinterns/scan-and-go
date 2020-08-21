import { DEFAULT_NGRAM_LENGTH } from "src/constants";
import { Store } from "src/interfaces";
import { Heap } from "src/packages/Heap";

/**
 * Preprocesses a string s to use as input for calculateEditDistance().
 *
 * @param s
 */
export const preprocess = (s: string) => {
  s = s.toLowerCase(); // make lower case
  s = s.replace(/[().|[\]{}`]/, ""); // remove the list of chars defined above
  s = s.replace("&", "and");
  s = s.replace(",", " ");
  s = s.replace("-", " ");
  s = s.replace(/[^\w\s]/, ""); // remove any remaining non-word characters
  s = s.replace(/\s\s+/g, " "); // replace multiple spaces with a single space
  s = s.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  ); // capital at start of each word and lowercase remaining letters
  return s;
};

/**
 * Runs the Levenshtein distance algorithm with modifications.
 * Returns an array of the inner edit distance, the number of trailing
 * insertions, and the number of leading insertions.
 *
 * @param s1
 * @param s2
 */
const calculateEditDistance = (s1: string, s2: string) => {
  const m = s1.length;
  const n = s2.length;
  const ed = new Array(m + 1);
  for (let i = 0; i < m + 1; i++) {
    ed[i] = new Array(n + 1).fill(0);
    ed[i][0] = i;
  }

  for (let i = 1; i < m + 1; i++) {
    for (let j = 1; j < n + 1; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        ed[i][j] = ed[i - 1][j - 1];
      } else {
        ed[i][j] = Math.min(ed[i - 1][j], ed[i][j - 1], ed[i - 1][j - 1]) + 1;
      }
    }
  }

  const min_j = ed[m].indexOf(Math.min(...ed[m]));
  const min_ed = ed[m][min_j];
  return [min_ed, n - min_j, min_j - m + min_ed];
};

const getNgrams = (s: string, n: number = DEFAULT_NGRAM_LENGTH) => {
  const ngrams = [];
  for (let i = n; i <= s.length; i++) {
    ngrams.push(s.slice(i - n, i));
  }
  return ngrams;
};

const buildNgramIndex = (stores: Store[], n: number = DEFAULT_NGRAM_LENGTH) => {
  const index = new Map(); // performs better than Object type for frequent additions
  stores.forEach((store, id) => {
    if (store.preprocessedName) {
      const ngrams = getNgrams(store.preprocessedName);
      ngrams.forEach((ngram) => {
        if (!index.has(ngram)) {
          index.set(ngram, []);
        }
        index.get(ngram).push(id);
      });
    }
  });
  return index;
};

/* Comparator function that defines the sort order of an array of stores. */
const storeCompareFn = (
  a: { storeId: number; dist: number[] },
  b: { storeId: number; dist: number[] }
) => {
  return (
    a.dist[0] - b.dist[0] || a.dist[1] - b.dist[1] || a.dist[2] - b.dist[2]
  );
};

/**
 * Initialize the variables needed for the Single-Pass Search algorithm, with heap.
 *
 * @param stores
 * @param preprocessedQuery
 * @returns lists - the list of ngram inverted list indices, corresponding to the
 *                  ngrams of the preprocessed query.
 * @returns listIndices - the index of the next store for each list.
 * @returns candidateStores - a heap to hold the next store IDs from each list.
 * @returns topKStores - a heap to hold the top k stores.
 */
const initializeSPS = (stores: Store[], preprocessedQuery: string) => {
  // Get ngram inverted list indices
  const ngramIndex = buildNgramIndex(stores);
  const queryNgrams: string[] = getNgrams(preprocessedQuery);
  const lists = queryNgrams.map((ngram) =>
    ngramIndex.has(ngram) ? ngramIndex.get(ngram) : []
  );

  const topKStores = new Heap<{ storeId: number; dist: number[] }>(
    storeCompareFn
  );
  const listIndices = new Array(lists.length).fill(0);
  const candidateStores = new Heap<number[]>((a, b) => b[0] - a[0]);
  listIndices.forEach((idx, i) => {
    if (idx < lists[i].length) {
      candidateStores.insert([lists[i][idx], i]);
      listIndices[i] = 1;
    }
  });
  return { lists, listIndices, candidateStores, topKStores };
};

const calculateMinFreq = (
  nQueries: number,
  maxEdits: number,
  n: number = 3
) => {
  return Math.max(0, nQueries - n * maxEdits);
};

const popElementsByValue = (heap: Heap<any>, poppedLists: number[]) => {
  let storeId = -1;
  let freq = 0;

  let root = heap.remove();
  if (root) {
    freq += 1;
    storeId = root[0];
    // let [storeId, listIdx] = root;
    poppedLists.push(root[1]);
    while ((root = heap.peek()) && root[0] === storeId) {
      heap.remove();
      poppedLists.push(root[1]);
      freq += 1;
    }
  }

  return { storeId, freq };
};

const popElementsByCount = (
  heap: Heap<any>,
  poppedLists: number[],
  count: number
) => {
  let root = heap.peek();
  while (root && count > 0) {
    heap.remove();
    poppedLists.push(root[1]);
    count -= 1;
    root = heap.peek();
  }
};

// Insert the store into topKStores if its frequency and inner edit distance
// meet the threshold, and if it is more similar than the kth store.
const insertTopK = (
  storeId: number,
  stores: Store[],
  preprocessedQuery: string,
  k: number,
  threshold: number,
  topKStores: Heap<{ storeId: number; dist: number[] }>
) => {
  const preprocessedStoreName = stores[storeId].preprocessedName;
  if (preprocessedStoreName) {
    const dist = calculateEditDistance(
      preprocessedQuery,
      preprocessedStoreName
    );
    if (dist[0] <= threshold) {
      if (topKStores.data.length == k) {
        const root = topKStores.peek();
        if (root && storeCompareFn({ storeId, dist }, root) < 0) {
          topKStores.remove();
          topKStores.insert({ storeId, dist });
        }
      } else {
        topKStores.insert({ storeId, dist });
      }
    }
  }

  // Update threshold
  let newThreshold = threshold;
  if (topKStores.data.length == k) {
    const kthStore = topKStores.peek();
    if (kthStore && kthStore.dist[0] < threshold) {
      newThreshold = topKStores.peek()!.dist[0];
    }
  }
  return newThreshold;
};

/**
 * Push the next element (if any) of each popped list to candidateStores;
 *
 * @param poppedLists
 * @param lists
 * @param listIndices
 * @param candidateStores
 * @param skipStores - If true, skips any store ID smaller than than of the current root of candidateStores.
 */
const updateCandidates = (
  poppedLists: number[],
  lists: number[][],
  listIndices: number[],
  candidateStores: Heap<number[]>,
  skipStores: Boolean = false
) => {
  poppedLists.forEach((i) => {
    let idx = listIndices[i];
    const root = candidateStores.peek();
    if (skipStores && root) {
      const rootStoreId = root[0];
      while (idx < lists[i].length && lists[i][idx] < rootStoreId) {
        listIndices[i] += 1;
        idx = listIndices[i];
      }
    }
    if (idx < lists[i].length) {
      candidateStores.insert([lists[i][idx], i]);
      listIndices[i] += 1;
    }
  });
};

/**
 * Get the top k store IDs using the Single-Pass Search Algorithm, with heap, to prune
 * the stores search space.
 *
 * @param stores
 * @param preprocessedQuery
 * @param k
 * @param threshold
 */
const getTopKStoreIdsBySPS = (
  stores: Store[],
  preprocessedQuery: string,
  k: number,
  threshold: number
) => {
  const { lists, listIndices, candidateStores, topKStores } = initializeSPS(
    stores,
    preprocessedQuery
  );
  let minFreq = calculateMinFreq(lists.length, threshold);

  // Traverse the lists in order of store ID
  while (!candidateStores.empty()) {
    // Pop elements with the root store ID
    const poppedLists: number[] = [];
    const { storeId, freq } = popElementsByValue(candidateStores, poppedLists);

    if (freq >= minFreq) {
      // The root store ID might be a top k store
      console.log(stores[storeId], freq, minFreq);
      threshold = insertTopK(
        storeId,
        stores,
        preprocessedQuery,
        k,
        threshold,
        topKStores
      );
      minFreq = calculateMinFreq(lists.length, threshold);
    } else {
      // Otherwise, the next minFreq − freq − 1 store IDs in the heap
      // are also not candidate stores and should be removed.
      popElementsByCount(candidateStores, poppedLists, minFreq - freq - 1);
    }

    // Update the candidate stores heap by adding the next store ID from each popped list
    updateCandidates(
      poppedLists,
      lists,
      listIndices,
      candidateStores,
      freq < minFreq
    );
  }
  return topKStores.data;
};

/**
 * Get the top k store IDs by calculating the edit distance from the query to all stores.
 *
 * @param stores
 * @param preprocessedQuery
 * @param k
 * @param threshold
 */
const getTopKStoreIdsByNaive = (
  stores: Store[],
  preprocessedQuery: string,
  k: number,
  threshold: number
) => {
  const topKStoreIds = stores
    .reduce((ids: { storeId: number; dist: number[] }[], store, storeId) => {
      if (store.preprocessedName) {
        const dist = calculateEditDistance(
          preprocessedQuery,
          store.preprocessedName
        );
        if (dist[0] <= threshold) {
          ids.push({ storeId, dist });
        }
      }
      return ids;
    }, [])
    .sort(
      (a, b) =>
        a.dist[0] - b.dist[0] || a.dist[1] - b.dist[1] || a.dist[2] - b.dist[2]
    )
    .slice(0, k);
  return topKStoreIds;
};

export const getTopKStoreIds = (
  stores: Store[],
  preprocessedQuery: string,
  k: number,
  threshold: number
) => {
  if (preprocessedQuery.length < DEFAULT_NGRAM_LENGTH) {
    return getTopKStoreIdsByNaive(stores, preprocessedQuery, k, threshold);
  } else {
    return getTopKStoreIdsBySPS(stores, preprocessedQuery, k, threshold);
  }
};
