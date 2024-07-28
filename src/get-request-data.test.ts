import { expect, test } from 'vitest';
import { getRequestFormData } from './get-request-data';

export const createRequestMock = (data: Record<string, string>) => {
  const url = new URL('http://localhost');
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  const request = new Request(url.toString(), {
    method: 'POST',
    body: formData,
  });
  return request;
};

test('shoud get form data', async () => {
  const request = createRequestMock({
    name: 'simon',
    password: 'foo',
  });

  const result = await getRequestFormData(request);

  expect(result.name).toBe('simon');
  expect(result.password).toBe('foo');
});
test('shoud get form data whit numerical values', async () => {
  const request = createRequestMock({
    age: '23',
    id: '1234',
  });

  const result = await getRequestFormData(request);

  expect(result.age).toBe('23');
  expect(result.id).toBe('1234');
});
test('shoud get form data with nested object', async () => {
  const request = createRequestMock({
    name: 'joe',
    'profile.username': 'john',
    'profile.lastname': 'doe',
    'profile.role': 'SERVER',
  });

  const result = await getRequestFormData(request);

  expect(result.name).toBe('joe');
  expect(result.profile?.username).toBe('john');
  expect(result.profile?.lastname).toBe('doe');
  expect(result.profile?.role).toBe('SERVER');
});
test('shoud get form data with deep nested object', async () => {
  const request = createRequestMock({
    name: 'joe',
    'profile.name.firstname': 'john',
    'profile.name.lastname': 'doe',
    'profile.role': 'SERVER',
  });

  const result = await getRequestFormData(request);

  expect(result.name).toBe('joe');
  expect(result.profile?.name?.firstname).toBe('john');
  expect(result.profile?.name?.lastname).toBe('doe');
  expect(result.profile?.role).toBe('SERVER');
});
test('shoud get form data with nested array', async () => {
  const request = createRequestMock({
    name: 'simon',
    'tables.0': 'Table 1',
    'tables.1': 'Table 2',
    'tables.3': 'Table 3',
    'tables.4': 'Table 4',
    'tables.5': 'Table 5',
  });

  const result = await getRequestFormData(request);

  expect(result.name).toBe('simon');
  expect(Array.isArray(result.tables)).toBeTruthy();
  expect(result.tables?.[0]).toBe('Table 1');
  expect(result.tables?.[1]).toBe('Table 2');
  expect(result.tables?.[2]).toBe('Table 3');
  expect(result.tables?.[3]).toBe('Table 4');
  expect(result.tables?.[4]).toBe('Table 5');
});
test('shoud get form data with deep nested array', async () => {
  const request = createRequestMock({
    name: 'simon',
    'tables.0.name': 'Table 1',
    'tables.0.id': 'table.1.id',
    'tables.1.name': 'Table 2',
    'tables.1.id': 'table.2.id',
    'tables.2.name': 'Table 3',
    'tables.2.id': 'table.3.id',
    'tables.3.name': 'Table 4',
    'tables.3.id': 'table.4.id',
  });

  const result = await getRequestFormData(request);

  expect(result.name).toBe('simon');
  expect(Array.isArray(result.tables)).toBeTruthy();
  expect(result.tables?.[0]?.name).toBe('Table 1');
  expect(result.tables?.[0]?.id).toBe('table.1.id');
  expect(result.tables?.[1]?.name).toBe('Table 2');
  expect(result.tables?.[1]?.id).toBe('table.2.id');
});
test('shoud get form data with flat array', async () => {
  const request = createRequestMock({
    '0.name': 'Table 1',
    '0.id': 'table.1.id',
    '1.name': 'Table 2',
    '1.id': 'table.2.id',
    '2.name': 'Table 3',
    '2.id': 'table.3.id',
    '3.name': 'Table 4',
    '3.id': 'table.4.id',
  });

  const result = await getRequestFormData(request);

  expect(Array.isArray(result)).toBeTruthy();
  expect(result?.[0]?.name).toBe('Table 1');
  expect(result?.[0]?.id).toBe('table.1.id');
  expect(result?.[1]?.name).toBe('Table 2');
  expect(result?.[1]?.id).toBe('table.2.id');
});
test('shoud get form data with flat array', async () => {
  const request = createRequestMock({
    '0.name': 'Table 1',
    '0.id': 'table.1.id',
    '1.name': 'Table 2',
    '1.id': 'table.2.id',
    '2.name': 'Table 3',
    '2.id': 'table.3.id',
    '3.name': 'Table 4',
    '3.id': 'table.4.id',
  });

  const result = await getRequestFormData(request);

  expect(Array.isArray(result)).toBeTruthy();
  expect(result?.[0]?.name).toBe('Table 1');
  expect(result?.[0]?.id).toBe('table.1.id');
  expect(result?.[1]?.name).toBe('Table 2');
  expect(result?.[1]?.id).toBe('table.2.id');
});
