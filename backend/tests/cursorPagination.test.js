const assert = require("assert");
const mongoose = require("mongoose");
const { paginateSortedItems } = require("../utils/cursorPagination");

function oid(hexSuffix) {
  return new mongoose.Types.ObjectId(`6650000000000000000000${hexSuffix}`);
}

function item(hexSuffix, createdAt) {
  return { _id: oid(hexSuffix), createdAt: new Date(createdAt) };
}

const records = [
  item("01", "2026-07-08T10:00:00.000Z"),
  item("02", "2026-07-08T10:00:00.000Z"),
  item("03", "2026-07-08T09:00:00.000Z"),
  item("04", "2026-07-08T08:00:00.000Z"),
  item("05", "2026-07-08T07:00:00.000Z"),
];

const firstPage = paginateSortedItems(records, { limit: 2 });
assert.strictEqual(firstPage.data.length, 2, "first page should return the requested page size");
assert.strictEqual(firstPage.hasMore, true, "first page should report hasMore when an extra document exists");
assert.strictEqual(firstPage.nextCursor, String(oid("01")), "nextCursor should be the last item on the page after sort tie-breaks");
assert.deepStrictEqual(
  firstPage.data.map((entry) => String(entry._id)),
  [String(oid("02")), String(oid("01"))],
  "same-timestamp records should be ordered by _id desc",
);

const secondPage = paginateSortedItems(records, { limit: 2, cursor: firstPage.nextCursor });
assert.strictEqual(secondPage.data.length, 2, "second page should return the requested page size");
assert.strictEqual(secondPage.hasMore, true, "second page should report hasMore when one record remains");
assert.deepStrictEqual(
  secondPage.data.map((entry) => String(entry._id)),
  [String(oid("03")), String(oid("04"))],
  "cursor should resume immediately after the last item from page one",
);

const combinedIds = [...firstPage.data, ...secondPage.data].map((entry) => String(entry._id));
assert.strictEqual(new Set(combinedIds).size, combinedIds.length, "consecutive pages should not duplicate records");

const finalPage = paginateSortedItems(records, { limit: 2, cursor: secondPage.nextCursor });
assert.strictEqual(finalPage.data.length, 1, "final page should return the remaining record");
assert.strictEqual(finalPage.hasMore, false, "final page should report hasMore=false");
assert.strictEqual(finalPage.nextCursor, null, "final page should not return a cursor");

const updatedRecords = [
  { _id: oid("01"), updatedAt: new Date("2026-07-08T08:00:00.000Z") },
  { _id: oid("02"), updatedAt: new Date("2026-07-08T11:00:00.000Z") },
  { _id: oid("03"), updatedAt: new Date("2026-07-08T09:00:00.000Z") },
];
const trackerPage = paginateSortedItems(updatedRecords, { limit: 2, dateField: "updatedAt" });
assert.deepStrictEqual(
  trackerPage.data.map((entry) => String(entry._id)),
  [String(oid("02")), String(oid("03"))],
  "tracker pagination should follow updatedAt ordering, not insertion order",
);

console.log("cursor pagination tests passed");
