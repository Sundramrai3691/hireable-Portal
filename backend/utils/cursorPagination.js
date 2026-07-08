const mongoose = require("mongoose");

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parseLimit(value, defaultLimit = DEFAULT_LIMIT) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultLimit;
  }
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

function parseObjectIdCursor(cursor) {
  if (!cursor) {
    return null;
  }
  if (!mongoose.Types.ObjectId.isValid(cursor)) {
    const error = new Error("Invalid cursor.");
    error.statusCode = 400;
    throw error;
  }
  return new mongoose.Types.ObjectId(cursor);
}

function appendCursorFilter(baseFilter, cursorFilter) {
  if (!cursorFilter) {
    return baseFilter;
  }
  if (!baseFilter || !Object.keys(baseFilter).length) {
    return cursorFilter;
  }
  return { $and: [baseFilter, cursorFilter] };
}

async function buildDateCursorPageQuery(Model, baseFilter, options = {}) {
  const limit = parseLimit(options.limit);
  const dateField = options.dateField || "createdAt";
  const cursorId = parseObjectIdCursor(options.cursor);
  let cursorFilter = null;

  if (cursorId) {
    const cursorDoc = await Model.findOne({ ...baseFilter, _id: cursorId })
      .select({ [dateField]: 1 })
      .lean();

    if (!cursorDoc || !cursorDoc[dateField]) {
      const error = new Error("Cursor does not match this result set.");
      error.statusCode = 400;
      throw error;
    }

    cursorFilter = {
      $or: [
        { [dateField]: { $lt: cursorDoc[dateField] } },
        { [dateField]: cursorDoc[dateField], _id: { $lt: cursorId } },
      ],
    };
  }

  // Cursor pagination is used instead of skip/limit because skip/limit re-scans
  // and discards N documents on every page, so late pages get slower with O(n)
  // cost per page. It is also unstable if documents are inserted/deleted between
  // page loads because items shift, causing skipped or duplicated results. A
  // cursor on indexed sort fields uses O(log n) index positioning and remains
  // stable under concurrent writes.
  return {
    filter: appendCursorFilter(baseFilter, cursorFilter),
    limit,
    sort: { [dateField]: -1, _id: -1 },
  };
}

function buildPage(items, limit, serialize = (item) => item) {
  const hasMore = items.length > limit;
  const pageItems = hasMore ? items.slice(0, limit) : items;
  const lastItem = pageItems[pageItems.length - 1] || null;

  return {
    data: pageItems.map(serialize),
    nextCursor: hasMore && lastItem ? String(lastItem._id) : null,
    hasMore,
  };
}

function paginateSortedItems(items, { limit, cursor, dateField = "createdAt" }) {
  const parsedLimit = parseLimit(limit);
  const sorted = [...items].sort((a, b) => {
    const dateDelta = new Date(b[dateField]).getTime() - new Date(a[dateField]).getTime();
    if (dateDelta !== 0) {
      return dateDelta;
    }
    return String(b._id).localeCompare(String(a._id));
  });
  const cursorIndex = cursor ? sorted.findIndex((item) => String(item._id) === String(cursor)) : -1;
  const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
  return buildPage(sorted.slice(startIndex, startIndex + parsedLimit + 1), parsedLimit);
}

module.exports = {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  parseLimit,
  parseObjectIdCursor,
  appendCursorFilter,
  buildDateCursorPageQuery,
  buildPage,
  paginateSortedItems,
};
