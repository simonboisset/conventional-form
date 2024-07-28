import { getDataFromEntries } from './get-request-data';

export const getFormData = <T = any>(target: EventTarget) => {
  const formData = new FormData(target as HTMLFormElement);
  const entries = Object.fromEntries(formData) as Record<string, string | undefined>;
  return getDataFromEntries<T>(entries);
};
