import MixedMap from 'mixed-map';

interface MultikeyInternalMapValue<V> {
  map: MixedMap<any, MultikeyInternalMapValue<V>> | undefined;
  valueSet: boolean;
  value: V | undefined;
}

export class MultikeyMap<K extends any[], V> {
  private map: MixedMap<any, MultikeyInternalMapValue<V>>;

  constructor() {
    this.map = new MixedMap<any, MultikeyInternalMapValue<V>>();
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
      [mapValue.valueSet, mapValue.value] :
      [false, undefined];
  }

  set(keys: K, value: V): void {
    let map = this.map;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let mapValue = map.get(key);

      if (!mapValue) {
        mapValue = {
          map: undefined,
          valueSet: false,
          value: undefined,
        };

        map.set(key, mapValue);
      }

      if (i < keys.length - 1) {
        if (mapValue.map) {
          map = mapValue.map;
        } else {
          map = mapValue.map = new MixedMap<any, MultikeyInternalMapValue<V>>();
        }

        continue;
      }

      if (!mapValue.valueSet) {
        mapValue.valueSet = true;
      }

      mapValue.value = value;
    }
  }

  delete(keys: K): boolean {
    let map = this.map;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let mapValue = map.get(key);

      if (!mapValue) {
        return false;
      }

      if (i < keys.length - 1) {
        if (!mapValue.map) {
          return false;
        }

        map = mapValue.map;
        continue;
      }

      if (mapValue.valueSet) {
        mapValue.valueSet = false;
        mapValue.value = undefined;
        return true;
      } else {
        return false;
      }
    }

    // To pass TypeScript checking.
    return false;
  }

  private getMapValueObject(keys: any[]): MultikeyInternalMapValue<V> | undefined {
    let map = this.map;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let mapValue = map.get(key);

      if (!mapValue) {
        return undefined;
      }

      if (i < keys.length - 1) {
        if (!mapValue.map) {
          return undefined;
        }

        map = mapValue.map;
        continue;
      }

      return mapValue;
    }

    // To pass TypeScript checking.
    return undefined;
  }
}

export default MultikeyMap;
