import MultikeyMap from 'multikey-map';

test('set and get with single key', () => {
  const map = new MultikeyMap<any[], any>();

  map.set(['foo'], 123);
  map.set(['bar'], 456);

  expect(map.get(['foo'])).toBe(123);
  expect(map.get(['bar'])).toBe(456);
  expect(map.hasAndGet(['bar'])).toEqual([true, 456]);
  expect(map.get(['pia'])).toBe(undefined);
  expect(map.hasAndGet(['pia'])).toEqual([false, undefined]);
});

test('set and get with multiple keys', () => {
  const map = new MultikeyMap<any[], any>();

  map.set(['foo', 'pia'], 123);
  map.set(['bar', 'pia'], 456);
  map.set(['bar', 'hia'], 789);
  map.set(['bar', 'yo'], undefined);

  expect(map.get(['foo', 'pia'])).toBe(123);
  expect(map.get(['bar', 'pia'])).toBe(456);
  expect(map.get(['bar', 'hia'])).toBe(789);
  expect(map.get(['bar', 'hia'])).toBe(789);
  expect(map.hasAndGet(['bar', 'hia'])).toEqual([true, 789]);
  expect(map.get(['bar', 'yo'])).toBe(undefined);
  expect(map.has(['bar', 'yo'])).toBe(true);
  expect(map.hasAndGet(['bar', 'yo'])).toEqual([true, undefined]);
  expect(map.get(['bar', 'xia'])).toBe(undefined);
  expect(map.has(['bar', 'xia'])).toBe(false);
  expect(map.hasAndGet(['bar', 'xia'])).toEqual([false, undefined]);
  expect(map.get(['ha', 'pia'])).toBe(undefined);
  expect(map.get(['ha'])).toBe(undefined);
  expect(map.get(['foo'])).toBe(undefined);
});

test('set value with keys of different lengths', () => {
  const map = new MultikeyMap<any[], any>();

  map.set(['foo'], 123);
  map.set(['foo', 'pia'], 456);
  map.set(['bar', 'pia'], 789);
  map.set(['bar'], undefined);

  expect(map.get(['foo'])).toBe(123);
  expect(map.get(['foo', 'pia'])).toBe(456);
  expect(map.get(['bar', 'pia'])).toBe(789);
  expect(map.hasAndGet(['bar'])).toEqual([true, undefined]);
});

test('set value with keys of different lengths', () => {
  const map = new MultikeyMap<any[], any>();

  map.set(['foo'], 123);
  map.set(['foo', 'pia'], 456);
  map.set(['bar', 'pia'], 789);
  map.set(['bar'], undefined);

  expect(map.get(['foo'])).toBe(123);
  expect(map.get(['foo', 'pia'])).toBe(456);
  expect(map.get(['bar', 'pia'])).toBe(789);
  expect(map.hasAndGet(['bar'])).toEqual([true, undefined]);
});

test('delete values', () => {
  const map = new MultikeyMap<any[], any>();

  map.set(['foo'], 123);
  map.set(['foo', 'pia'], 456);
  map.set(['bar', 'pia'], 789);
  map.set(['bar'], undefined);

  map.delete(['foo']);
  map.delete(['bar', 'pia']);

  expect(map.hasAndGet(['foo'])).toEqual([false, undefined]);
  expect(map.get(['foo', 'pia'])).toBe(456);
  expect(map.hasAndGet(['bar', 'pia'])).toEqual([false, undefined]);
  expect(map.hasAndGet(['bar'])).toEqual([true, undefined]);
});
