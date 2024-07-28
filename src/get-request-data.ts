import { Data, mapFormData } from './map-form-data';
import { mapObjectToArrayIfKeysAreNumbers } from './map-object-to-array-if-keys-are-numbers';

export const getRequestSearchData = <T = any>(request: Request) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const entries = Object.fromEntries(search.entries());
  return getDataFromEntries<T>(entries);
};

export const getRequestFormData = async <T = any>(request: Request) => {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData) as Record<string, string | undefined>;

  return getDataFromEntries<T>(entries);
};

export const getDataFromEntries = <T = any>(entries: Record<string, string | undefined>) => {
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
export const getEncodedObject = (data: any) => {
  let object = {};
  for (const key in data) {
    if (Array.isArray(data[key])) {
      // @ts-expect-error
      object[key] = data[key].map((item: any) => {
        if (item instanceof Object && !(item instanceof Date)) {
          return getEncodedObject(item);
        } else {
          return encodeURIComponent(item);
        }
      });
    } else if (data[key] instanceof Object && !(data[key] instanceof Date)) {
      // @ts-expect-error
      object[key] = getEncodedObject(data[key]);
    } else {
      // @ts-expect-error
      object[key] = encodeURIComponent(data[key]);
    }
  }
  return object;
};

export const getDecodedObject = (data: any) => {
  let object = {};
  for (const key in data) {
    if (Array.isArray(data[key])) {
      // @ts-expect-error
      object[key] = data[key].map((item: any) => {
        if (item instanceof Object && !(item instanceof Date)) {
          return getDecodedObject(item);
        } else {
          return decodeURIComponent(item);
        }
      });
    } else if (data[key] instanceof Object && !(data[key] instanceof Date)) {
      // @ts-expect-error
      object[key] = getDecodedObject(data[key]);
    } else {
      // @ts-expect-error
      object[key] = decodeURIComponent(data[key]);
    }
  }
  return object;
};

export const getFormDataFromData = <T = any>(data: T) => {
  const formData = new FormData();
  getFormDataFromItem(formData, data);
  return formData;
};

export const getEntriesFromData = <T = any>(data: T) => {
  const formData = getFormDataFromData(data);
  return Object.fromEntries(formData.entries()) as Record<string, any>;
};

const getFormDataFromItem = (formData: FormData, item: any, key?: string) => {
  if (item === undefined) return;
  if (item instanceof File) {
    if (!key) throw new Error('File must have a key');
    formData.append(key, item);
    return;
  }
  if (item instanceof Blob) {
    if (!key) throw new Error('Blob must have a key');
    formData.append(key, item);
    return;
  }
  if (item instanceof Date) {
    if (!key) throw new Error('Date must have a key');
    formData.append(key, item.toISOString());
    return;
  }
  if (item instanceof Array) {
    item.forEach((element, i) => {
      getFormDataFromItem(formData, element, key ? `${key}.${i}` : i.toString());
    });
    return;
  }
  if (item instanceof Object) {
    Object.keys(item).forEach((element) => {
      getFormDataFromItem(formData, item[element], key ? `${key}.${element}` : element);
    });
    return;
  }
  if (!key) throw new Error(`Item ${item} must have a key`);
  formData.append(key, item);
};
