import { type SearchOptions } from "./data";

export function paramsToSearchOptions(
  params: Record<string, string>,
): SearchOptions {
  const options: SearchOptions = {};
  if (params.isHighlight === "true") options.isHighlight = true;
  if (params.title === "true") options.title = true;
  if (params.tags === "true") options.tags = true;
  if (params.isOnView === "true") options.isOnView = true;
  if (params.artistOrCulture === "true") options.artistOrCulture = true;
  if (params.hasImages === "true") options.hasImages = true;
  if (params.departmentId) {
    const id = parseInt(params.departmentId, 10);
    if (!isNaN(id)) options.departmentId = id;
  }
  if (params.medium)
    options.medium = params.medium
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  if (params.geoLocation)
    options.geoLocation = params.geoLocation
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  if (params.dateBegin && params.dateEnd) {
    options.dateBegin = parseInt(params.dateBegin, 10);
    options.dateEnd = parseInt(params.dateEnd, 10);
  }
  if (params.q) options.q = params.q.trim();
  return options;
}

export function searchOptionsToParams(
  options: SearchOptions,
  query = "",
): URLSearchParams {
  const params = new URLSearchParams();
  if (options.isHighlight) params.set("isHighlight", "true");
  if (options.title) params.set("title", "true");
  if (options.tags) params.set("tags", "true");
  if (options.isOnView) params.set("isOnView", "true");
  if (options.artistOrCulture) params.set("artistOrCulture", "true");
  if (options.hasImages) params.set("hasImages", "true");
  if (options.departmentId !== undefined)
    params.set("departmentId", String(options.departmentId));
  if (options.medium?.length) params.set("medium", options.medium.join(","));
  if (options.geoLocation?.length)
    params.set("geoLocation", options.geoLocation.join(","));
  if (options.dateBegin !== undefined && options.dateEnd !== undefined) {
    params.set("dateBegin", String(options.dateBegin));
    params.set("dateEnd", String(options.dateEnd));
  }
  if (query) params.set("q", query);

  return params;
}
