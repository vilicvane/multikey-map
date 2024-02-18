import {MixedMap} from 'mixed-map';

type MultikeyInternalMapValue<TValue> = {
  map?: MixedMap<unknown, MultikeyInternalMapValue<TValue>>;
  value?: TValue;
};

export class MultikeyMap<TKeys extends unknown[], TValue> {
  constructor(
    private map = new MixedMap<unknown, MultikeyInternalMapValue<TValue>>(),
  ) {}

  get(keys: TKeys): TValue | undefined {
    return this.getMapValueObject(keys)?.value;
  }

  has(keys: PartialKeys<TKeys>): boolean {
    const mapValue = this.getMapValueObject(keys);
    return !!mapValue && 'value' in mapValue;
  }

  hasAndGet(keys: TKeys): [true, TValue] | [false, undefined];
  hasAndGet(keys: TKeys): [boolean, unknown] {
    const mapValue = this.getMapValueObject(keys);

    if (mapValue && 'value' in mapValue) {
      return [true, mapValue.value];
    } else {
      return [false, undefined];
    }
  }

  getSubMap<TPartialKeys extends StrictPartialKeys<TKeys>>(
    keys: TPartialKeys,
  ): MultikeyMap<RestKeys<TKeys, TPartialKeys>, TValue> | undefined {
    const map = this.getMapValueObject(keys)?.map;

    if (map) {
      return new MultikeyMap(map);
    } else {
      return undefined;
    }
  }

  set(keys: TKeys, value: TValue): void {
    const [mapKeys, valueKey] = getMapKeysAndValueKey(keys);

    let map = this.map;

    for (const key of mapKeys) {
      let mapValue = map.get(key);

      if (!mapValue) {
        mapValue = {map: new MixedMap()};
        map.set(key, mapValue);
      } else if (!mapValue.map) {
        mapValue.map = new MixedMap();
      }

      map = mapValue.map!;
    }

    {
      const mapValue = map.get(valueKey);

      if (mapValue) {
        mapValue.value = value;
      } else {
        map.set(valueKey, {value});
      }
    }
  }

  delete(keys: TKeys): boolean {
    const mapValue = this.getMapValueObject(keys);

    if (mapValue && 'value' in mapValue) {
      delete mapValue.value;
      return true;
    } else {
      return false;
    }
  }

  private getMapValueObject(
    keys: unknown[],
  ): MultikeyInternalMapValue<TValue> | undefined {
    const [mapKeys, valueKey] = getMapKeysAndValueKey(keys);

    let map = this.map;

    for (const key of mapKeys) {
      const subMap = map.get(key)?.map;

      if (!subMap) {
        return undefined;
      }

      map = subMap;
    }

    return map.get(valueKey);
  }
}

export default MultikeyMap;

function getMapKeysAndValueKey(keys: unknown[]): [unknown[], unknown] {
  if (keys.length === 0) {
    throw new Error('Expected at least one key.');
  }

  return [keys.slice(0, -1), keys[keys.length - 1]];
}

type StrictPartialKeys<TKeys extends unknown[]> = number extends TKeys['length']
  ? TKeys
  : __StrictPartialKeys<TKeys>;

type __StrictPartialKeys<TKeys extends unknown[]> = TKeys extends [
  infer TFirst,
  ...infer TRest,
]
  ? TRest extends []
    ? never
    : [TFirst] | [TFirst, ...__StrictPartialKeys<TRest>]
  : [];

type PartialKeys<TKeys extends unknown[]> = number extends TKeys['length']
  ? TKeys
  : __PartialKeys<TKeys>;

type __PartialKeys<TKeys extends unknown[]> = TKeys extends [
  infer TFirst,
  ...infer TRest,
]
  ? [TFirst] | [TFirst, ...__PartialKeys<TRest>]
  : [];

type RestKeys<
  TKeys extends unknown[],
  TPartialKeys extends unknown[],
> = TKeys extends [...TPartialKeys, ...infer TRestKeys] ? TRestKeys : never;
