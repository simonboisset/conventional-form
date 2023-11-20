import { Data, mapFormData } from './mapFormData';
import { mapObjectToArrayIfKeysAreNumbers } from './mapObjectToArrayIfKeysAreNumbers';

export const csp = <T = any>(searchParams: URLSearchParams) => {
  const entries = Object.fromEntries(searchParams.entries());
  return getDataFromEntries<T>(entries);
};

export const cfd = <T = any>(formData: FormData) => {
  const entries = Object.fromEntries(formData) as Record<string, string | undefined>;
  return getDataFromEntries<T>(entries);
};

const getDataFromEntries = <T = any>(entries: Record<string, string | undefined>) => {
  let result: Data<T> = {};
  for (const entry in entries) {
    const element = entries[entry];
    if (element) {
      mapFormData(result, entry, element);
    }
  }

  const data = mapObjectToArrayIfKeysAreNumbers(result);
  if (Array.isArray(data) && data.length === 0) {
    return undefined;
  }
  return data as T;
};
