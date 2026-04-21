import { CollectionResult, Department, MuseumObject } from "./types";

const BASE_API_URL =
  "https://collectionapi.metmuseum.org/public/collection/v1";

export const fetchObjects = async (
  departmentIds?: number[],
  metadataDate?: string,
): Promise<CollectionResult> => {
  const url = new URL(`${BASE_API_URL}/objects`);
  if (departmentIds)
    url.searchParams.append("departmentIds", departmentIds.join("|"));
  if (metadataDate) url.searchParams.append("metadataDate", metadataDate);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error fetching objects: ${response.statusText}`);
  return response.json();
};

export const fetchObject = async (objectId: number): Promise<MuseumObject> => {
  const url = `${BASE_API_URL}/objects/${objectId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error fetching object: ${response.statusText}`);
  return response.json();
};

export const fetchDepartments = async (): Promise<Department[]> => {
  const url = `${BASE_API_URL}/departments`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error fetching departments: ${response.statusText}`);
  const json: { departments: Department[] } = await response.json();
  return json.departments;
};

export type SearchOptions = {
  isHighlight?: boolean;
  title?: boolean;
  tags?: boolean;
  departmentId?: number[];
  isOnView?: boolean;
  artistOrCulture?: boolean;
  medium?: string[];
  hasImages?: boolean;
  geoLocation?: string[];
  dateBegin?: number;
  dateEnd?: number;
};

export const search = async (
  q: string,
  options?: SearchOptions,
): Promise<CollectionResult> => {
  const url = new URL(`${BASE_API_URL}/search`);
  url.searchParams.append("q", q);

  if (options) {
    const {
      isHighlight,
      title,
      tags,
      departmentId,
      isOnView,
      artistOrCulture,
      medium,
      hasImages,
      geoLocation,
      dateBegin,
      dateEnd,
    } = options;

    if (isHighlight !== undefined)
      url.searchParams.append("isHighlight", String(isHighlight));
    if (title !== undefined) url.searchParams.append("title", String(title));
    if (tags !== undefined) url.searchParams.append("tags", String(tags));
    if (departmentId?.length)
      url.searchParams.append("departmentIds", departmentId.join("|"));
    if (isOnView !== undefined)
      url.searchParams.append("isOnView", String(isOnView));
    if (artistOrCulture !== undefined)
      url.searchParams.append("artistOrCulture", String(artistOrCulture));
    if (medium?.length) url.searchParams.append("medium", medium.join("|"));
    if (hasImages !== undefined)
      url.searchParams.append("hasImages", String(hasImages));
    if (geoLocation?.length)
      url.searchParams.append("geoLocation", geoLocation.join("|"));
    if (dateBegin !== undefined && dateEnd !== undefined) {
      url.searchParams.append("dateBegin", String(dateBegin));
      url.searchParams.append("dateEnd", String(dateEnd));
    }
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error fetching search results: ${response.statusText}`);
  return response.json();
};
