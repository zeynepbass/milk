export const pageParamsFromCursor = {
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
};

export const flattenPages = (data) => data?.pages.flatMap((page) => page.items) ?? [];

export const mapInfiniteItems = (data, mapItem) =>
  data?.pages
    ? { ...data, pages: data.pages.map((page) => ({ ...page, items: page.items.map(mapItem) })) }
    : data;

export const filterInfiniteItems = (data, keep) =>
  data?.pages
    ? { ...data, pages: data.pages.map((page) => ({ ...page, items: page.items.filter(keep) })) }
    : data;

export const prependInfiniteItem = (data, item) => {
  if (!data?.pages?.length) return { pages: [{ items: [item], nextCursor: null }], pageParams: [null] };

  const [first, ...rest] = data.pages;
  if (first.items.some((existing) => existing._id === item._id)) return data;

  return { ...data, pages: [{ ...first, items: [item, ...first.items] }, ...rest] };
};
