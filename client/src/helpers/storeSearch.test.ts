import { preprocess, getTopKStoreIds } from "./storeSearch";
import { emptyStore } from "src/interfaces";

describe("Test all exported store search functions", () => {
  describe("Test preprocess", () => {
    it("preprocesses an empty string", () => {
      const s = "";
      const ps = preprocess(s);
      expect(ps).toEqual("");
    });

    it("normalizes case correctly", () => {
      const s = "UPPERCASE lowercase";
      const ps = preprocess(s);
      expect(ps).toEqual("Uppercase Lowercase");
    });

    it("replaces '&' with \"and\"", () => {
      const s = "A & B";
      const ps = preprocess(s);
      expect(ps).toEqual("A And B");
    });

    it("replaces hyphens with a space", () => {
      const s = "A-B";
      const ps = preprocess(s);
      expect(ps).toEqual("A B");
    });

    it("removes other non-word characters", () => {
      const s = 'A().|[]{}`"b';
      const ps = preprocess(s);
      expect(ps).toEqual("Ab");
    });

    it("strips whitespace and replaces multiple spaces with a single space", () => {
      const s = "   Many   Spaces   ";
      const ps = preprocess(s);
      expect(ps).toEqual("Many Spaces");
    });
  });

  describe("Test getTopKStoreIds", () => {
    const testStores = [
      Object.assign(emptyStore(), { preprocessedName: "Store A" }),
      Object.assign(emptyStore(), { preprocessedName: "Store Ab" }),
      Object.assign(emptyStore(), { preprocessedName: "Store Abc" }),
      Object.assign(emptyStore(), { preprocessedName: "Mart A" }),
      Object.assign(emptyStore(), { preprocessedName: "Mart Abc" }),
    ];
    const threshold = 0;

    it("returns an exact match", () => {
      const expectedStoreId = 0;
      const preprocessedQuery = testStores[expectedStoreId].preprocessedName;
      const storeIds = getTopKStoreIds(
        testStores,
        preprocessedQuery,
        testStores.length,
        0
      );
      expect(storeIds).toContainEqual({
        dist: [0, 0, 0],
        storeId: expectedStoreId,
      });
    });

    it("returns stores containing the query as a substring", () => {
      const query = "Store";
      const preprocessedQuery = preprocess(query);
      const storeIds = getTopKStoreIds(
        testStores,
        preprocessedQuery,
        testStores.length,
        0
      );
      const expectedStoreIds = testStores.filter((store) =>
        store.preprocessedName.includes(preprocessedQuery)
      );
      expect(storeIds.length).toBeGreaterThan(0);
      expect(storeIds.length).toEqual(expectedStoreIds.length);
      storeIds.forEach(({ storeId }) => {
        expect(testStores[storeId].preprocessedName).toContain(
          preprocessedQuery
        );
      });
    });

    it("returns stores with inner edit distance at most the given threshold", () => {
      const queryNoTypo = "Store";
      const query = "Sotre";
      const preprocessedQuery = preprocess(query);
      const threshold = 2;
      const storeIds = getTopKStoreIds(
        testStores,
        preprocessedQuery,
        testStores.length,
        threshold
      );
      const expectedStores = testStores.filter((store) =>
        store.preprocessedName.includes(queryNoTypo)
      );
      expect(storeIds.length).toBeGreaterThan(0);
      expect(storeIds.length).toEqual(expectedStores.length);
      storeIds.forEach(({ dist, storeId }) => {
        expect(testStores[storeId].preprocessedName).toContain(queryNoTypo);
        expect(dist[0]).toBeLessThanOrEqual(threshold);
      });
    });

    it("returns at most k stores ", () => {
      const query = "a";
      const preprocessedQuery = preprocess(query);
      const k = 2;
      const allStoreIds = getTopKStoreIds(
        testStores,
        preprocessedQuery,
        testStores.length,
        0
      );
      const kStoreIds = getTopKStoreIds(testStores, preprocessedQuery, 2, 0);
      expect(kStoreIds.length).toBeLessThanOrEqual(k);
      expect(kStoreIds.length).toBeLessThan(allStoreIds.length);
    });

    it("returns stores in sorted order", () => {
      const query = "a";
      const preprocessedQuery = preprocess(query);
      const allStoreIds = getTopKStoreIds(
        [],
        preprocessedQuery,
        testStores.length,
        0
      );
      const storeCompareFn = (
        a: { storeId: number; dist: number[] },
        b: { storeId: number; dist: number[] }
      ) => {
        return (
          a.dist[0] - b.dist[0] ||
          a.dist[1] - b.dist[1] ||
          a.dist[2] - b.dist[2]
        );
      };
      const isSorted = allStoreIds.every(
        (_, i, a) => !i || storeCompareFn(a[i - 1], a[i]) <= 0
      );
      expect(isSorted).toEqual(true);
    });

    it("returns 0 stores from an empty list of stores ", () => {
      const query = "Store";
      const preprocessedQuery = preprocess(query);
      const storeIds = getTopKStoreIds(
        [],
        preprocessedQuery,
        testStores.length,
        query.length
      );
      expect(storeIds.length).toEqual(0);
    });
  });
});
