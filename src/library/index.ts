import {MixedMap} from 'mixed-map';

type MultikeyInternalMapValue<TValue> =
  | {map: MixedMap<unknown, MultikeyInternalMapValue<TValue>>}
  | {value: TValue};

export class MultikeyMap<TKeys extends unknown[], TValue> {
  constructor(
    private map = new MixedMap<unknown, MultikeyInternalMapValue<TValue>>(),
  ) {}

  get<TPartialKeys extends StrictPartialKeys<TKeys>>(
    keys: TPartialKeys,
  ): MultikeyMap<RestKeys<TKeys, TPartialKeys>, TValue> | undefined;
  get(keys: TKeys): TValue | undefined;
  get(keys: unknown[]): MultikeyMap<any, TValue> | TValue | undefined {
    const mapValue = this.getMapValueObject(keys);

    if (!mapValue) {
      return undefined;
    }

    if ('map' in mapValue) {
      return new MultikeyMap(mapValue.map);
    } else {
      return mapValue.value;
    }
  }

  has(keys: PartialKeys<TKeys>): boolean {
    return this.getMapValueObject(keys) !== undefined;
  }

  hasAndGet<TPartialKeys extends StrictPartialKeys<TKeys>>(
    keys: TPartialKeys,
  ):
    | [true, MultikeyMap<RestKeys<TKeys, TPartialKeys>, TValue>]
    | [false, undefined];
  hasAndGet(keys: TKeys): [true, TValue] | [false, undefined];
  hasAndGet(
    keys: TKeys,
  ): [boolean, MultikeyMap<any, TValue> | TValue | undefined] {
    const mapValue = this.getMapValueObject(keys);

    if (!mapValue) {
      return [false, undefined];
    }

    if ('map' in mapValue) {
      return [true, new MultikeyMap(mapValue.map)];
    } else {
      return [true, mapValue.value];
    }
  }

  set(keys: TKeys, value: TValue): void {
    let map = this.map;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let mapValue = map.get(key);

      if (i < keys.length - 1) {
        if (!mapValue || !('map' in mapValue)) {
          mapValue = {map: new MixedMap()};
          map.set(key, mapValue);
        }

        map = mapValue.map;
      } else {
        if (!mapValue || !('value' in mapValue)) {
          map.set(key, {value});
        } else {
          mapValue.value = value;
        }
      }
    }
  }

  delete(keys: PartialKeys<TKeys>): boolean {
    let map = this.map;

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];

      if (index < keys.length - 1) {
        const mapValue = map.get(key);

        if (!mapValue || !('map' in mapValue)) {
          return false;
        }

        map = mapValue.map;
      } else {
        return map.delete(key);
      }
    }

    throw new Error();
  }

  private getMapValueObject(
    keys: unknown[],
  ): MultikeyInternalMapValue<TValue> | undefined {
    let map = this.map;

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const mapValue = map.get(key);

      if (!mapValue) {
        return undefined;
      }

      if (index < keys.length - 1) {
        if (!('map' in mapValue)) {
          return undefined;
        }

        map = mapValue.map;
      } else {
        return mapValue;
      }
    }

    throw new Error();
  }
}

export default MultikeyMap;

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
