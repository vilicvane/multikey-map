type GeneralMap<T> = Map<any, T> | WeakMap<any, T>;

interface MultikeyInternalMapValue<T> {
  map: GeneralMap<MultikeyInternalMapValue<T>>;
  value?: T;
}

export class MultikeyMap<K extends any[], V> {
  private map: GeneralMap<MultikeyInternalMapValue<V>>;

  constructor(
    private weak = false,
  ) {
    this.map = createMap<MultikeyInternalMapValue<V>>(weak);
  }

  get(keys: K): V | undefined {
    let mapValue = this.getMapValueObject(keys);
    return mapValue ? mapValue.value : undefined;
  }

  has(keys: K): boolean {
    let mapValue = this.getMapValueObject(keys);
    return mapValue ? 'value' in mapValue : false;
  }

  hasAndGet(keys: K): [boolean, V | undefined] {
    let mapValue = this.getMapValueObject(keys);
    return mapValue ?
      ['value' in mapValue, mapValue.value] :
      [false, undefined];
  }

  set(keys: K, value: V): void {
    let map = this.map;
    let weak = this.weak;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let mapValue = map.get(key);

      if (!mapValue) {
        mapValue = {map: createMap<MultikeyInternalMapValue<V>>(weak)};
        map.set(key, mapValue);
      }

      if (i === keys.length - 1) {
        mapValue.value = value;
      }

      map = mapValue.map;
    }
  }

  private getMapValueObject(keys: any[]): MultikeyInternalMapValue<V> | undefined {
    let map = this.map;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let mapValue = map.get(key);

      if (!mapValue) {
        return undefined;
      }

      if (i === keys.length - 1) {
        return mapValue;
      }

      map = mapValue.map;
    }

    return undefined;
  }
}

export default MultikeyMap;

function createMap<T>(weak: boolean): GeneralMap<T> {
  return weak ? new WeakMap<any, T>() : new Map<any, T>();
}
