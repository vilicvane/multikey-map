import test from 'ava';

import MultikeyMap from '..';

test('set and get with single key', t => {
  let map = new MultikeyMap<any[], any>();

  map.set(['foo'], 123);
  map.set(['bar'], 456);

  t.is(map.get(['foo']), 123);
  t.is(map.get(['bar']), 456);
  t.deepEqual(map.hasAndGet(['bar']), [true, 456]);
  t.is(map.get(['pia']), undefined);
  t.deepEqual(map.hasAndGet(['pia']), [false, undefined]);
});

test('set and get with multiple keys', t => {
  let map = new MultikeyMap<any[], any>();

  map.set(['foo', 'pia'], 123);
  map.set(['bar', 'pia'], 456);
  map.set(['bar', 'hia'], 789);
  map.set(['bar', 'yo'], undefined);

  t.is(map.get(['foo', 'pia']), 123);
  t.is(map.get(['bar', 'pia']), 456);
  t.is(map.get(['bar', 'hia']), 789);
  t.is(map.get(['bar', 'hia']), 789);
  t.deepEqual(map.hasAndGet(['bar', 'hia']), [true, 789]);
  t.is(map.get(['bar', 'yo']), undefined);
  t.is(map.has(['bar', 'yo']), true);
  t.deepEqual(map.hasAndGet(['bar', 'yo']), [true, undefined]);
  t.is(map.get(['bar', 'xia']), undefined);
  t.is(map.has(['bar', 'xia']), false);
  t.deepEqual(map.hasAndGet(['bar', 'xia']), [false, undefined]);
  t.is(map.get(['ha', 'pia']), undefined);
  t.is(map.get(['ha']), undefined);
  t.is(map.get(['foo']), undefined);
});

test('set value with keys of different lengths', t => {
  let map = new MultikeyMap<any[], any>();

  map.set(['foo'], 123);
  map.set(['foo', 'pia'], 456);
  map.set(['bar', 'pia'], 789);
  map.set(['bar'], undefined);

  t.is(map.get(['foo']), 123);
  t.is(map.get(['foo', 'pia']), 456);
  t.is(map.get(['bar', 'pia']), 789);
  t.deepEqual(map.hasAndGet(['bar']), [true, undefined]);
});

test('set value with keys of different lengths', t => {
  let map = new MultikeyMap<any[], any>();

  map.set(['foo'], 123);
  map.set(['foo', 'pia'], 456);
  map.set(['bar', 'pia'], 789);
  map.set(['bar'], undefined);

  t.is(map.get(['foo']), 123);
  t.is(map.get(['foo', 'pia']), 456);
  t.is(map.get(['bar', 'pia']), 789);
  t.deepEqual(map.hasAndGet(['bar']), [true, undefined]);
});

test('delete values', t => {
  let map = new MultikeyMap<any[], any>();

  map.set(['foo'], 123);
  map.set(['foo', 'pia'], 456);
  map.set(['bar', 'pia'], 789);
  map.set(['bar'], undefined);

  map.delete(['foo']);
  map.delete(['bar', 'pia']);

  t.deepEqual(map.hasAndGet(['foo']), [false, undefined]);
  t.is(map.get(['foo', 'pia']), 456);
  t.deepEqual(map.hasAndGet(['bar', 'pia']), [false, undefined]);
  t.deepEqual(map.hasAndGet(['bar']), [true, undefined]);
});
