import { DEFAULT_NGRAM_LENGTH } from "src/constants";
import { Store } from "src/interfaces";
import { Heap } from "src/packages/Heap";

/**
 * Preprocesses a string s to use as input for calculateEditDistance().
 *
 * @param s
 */
export const preprocess = (s: string) => {
  s = s.replace("&", "and");
  s = s.replace("-", " ");
  s = s.replace(/[^\w\s]/g, ""); // remove any remaining non-word characters
  s = s.trim(); // remove trailing and leading whitespace
  s = s.replace(/\s\s+/g, " "); // replace multiple spaces with a single space
  s = s.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  ); // capital at start of each word and lowercase remaining letters
  return s;
};

/**
 * Runs a modified Levenshtein distance algorithm to calculate the edit distance
 * from s1 to s2. Specifically, it returns the inner edit distance, the number
 * of trailing insertions, and the number of leading insertions.
 *
 * @param s1
 * @param s2
 * @returns innerEd   - the inner edit distance, defined as the minimum number of
 *                      operations (insertions, deletions, or substitutions) needed
 *                      to transform s1 into any substring of s2.
 * @returns trailing  - the number of trailing insertions needed after the end of
 *                      s1 to transform it into the full string s2.
 * @returns leading   - the number of leading insertions needed before the start of
 *                      s1 to transform it into the full string s2.
 */
const calculateEditDistance = (s1: string, s2: string) => {
  const m = s1.length;
  const n = s2.length;
  const ed = new Array(m + 1);
  for (let i = 0; i < m + 1; i++) {
    // Each cell ed[i][j] shows the current inner edit distance, number of insertions,
    // and number of deletions respectively to transform s1[:i] to a substring of s2[:j].
    ed[i] = new Array(n + 1).fill([0, 0, 0]);
    ed[i][0] = [i, 0, 0];
  }

  // Build the DP table
  for (let i = 1; i < m + 1; i++) {
    for (let j = 1; j < n + 1; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        ed[i][j] = ed[i - 1][j - 1];
      } else {
        const operations = [ed[i - 1][j - 1], ed[i - 1][j], ed[i][j - 1]];
        const prev = operations.sort(
          (a, b) => b[0] - a[0] || b[1] - a[1] || b[2] - a[2]
        )[0];
        const [prevEd, prevIns, prevDel] = prev;
        if (prev === ed[i - 1][j]) {
          ed[i][j] = [prevEd + 1, prevIns, prevDel + 1]; // s1[i] is deleted
        } else if (prev === ed[i][j - 1]) {
          ed[i][j] = [prevEd + 1, prevIns + 1, prevDel]; // s2[j] is inserted
        } else {
          ed[i][j] = [prevEd + 1, prevIns, prevDel]; // s1[i] is substituted with s2[j]
        }
      }
    }
  }

  // Calculate the inner edit distance, number of trailing insertions, and number
  // of leading insertions.
  let maxJ = 0;
  let [innerEd, numIns, numDel] = ed[m][0];
  for (let j = 1; j < n + 1; j++) {
    if (ed[m][j][0] <= innerEd) {
      [innerEd, numIns, numDel] = ed[m][j];
      maxJ = j;
    }
  }
  const trailing = n - maxJ;
  const leading = maxJ - (m + numIns + numDel);
  return { innerEd, trailing, leading };
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
  a: {
    storeId: number;
    dist: { innerEd: number; trailing: number; leading: number };
  },
  b: {
    storeId: number;
    dist: { innerEd: number; trailing: number; leading: number };
  }
) => {
  return (
    a.dist.innerEd - b.dist.innerEd ||
    a.dist.trailing - b.dist.trailing ||
    a.dist.leading - b.dist.leading
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

  const topKStores = new Heap<{
    storeId: number;
    dist: { innerEd: number; trailing: number; leading: number };
  }>(storeCompareFn);
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
  topKStores: Heap<{
    storeId: number;
    dist: { innerEd: number; trailing: number; leading: number };
  }>
) => {
  const preprocessedStoreName = stores[storeId].preprocessedName;
  if (preprocessedStoreName) {
    const dist = calculateEditDistance(
      preprocessedQuery,
      preprocessedStoreName
    );
    if (dist.innerEd <= threshold) {
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
    if (kthStore && kthStore.dist.innerEd < threshold) {
      newThreshold = kthStore.dist.innerEd;
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
    .reduce(
      (
        ids: {
          storeId: number;
          dist: { innerEd: number; trailing: number; leading: number };
        }[],
        store,
        storeId
      ) => {
        if (store.preprocessedName) {
          const dist = calculateEditDistance(
            preprocessedQuery,
            store.preprocessedName
          );
          if (dist.innerEd <= threshold) {
            ids.push({ storeId, dist });
          }
        }
        return ids;
      },
      []
    )
    .sort(storeCompareFn)
    .slice(0, k);
  return topKStoreIds;
};

/**
 * Returns a sorted list of the index of at most k stores, each with inner edit
 * distance between the query and the store name at most a certain threshold.
 *
 * @param stores
 * @param preprocessedQuery
 * @param k
 * @param threshold
 */
export const getTopKStoreIds = (
  stores: Store[],
  preprocessedQuery: string,
  k: number,
  threshold: number
) => {
  const minFreq = calculateMinFreq(
    preprocessedQuery.length - DEFAULT_NGRAM_LENGTH + 1,
    threshold
  );
  if (preprocessedQuery.length < DEFAULT_NGRAM_LENGTH || minFreq == 0) {
    // If the query length is smaller than the length of a ngram, or if the
    // minimum number of ngrams that needs to be matched between the query and
    // a store is 0, then we need to calculate the edit distance between the query
    // and all stores.
    return getTopKStoreIdsByNaive(stores, preprocessedQuery, k, threshold);
  } else {
    // Otherwise, we can calculate the edit distance for only the stores
    // that match with at least minFreq of the query's ngrams.
    return getTopKStoreIdsBySPS(stores, preprocessedQuery, k, threshold);
  }
};
