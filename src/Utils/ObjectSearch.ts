export const itemMatchesQuery = (query: Record<string, any> = {}, item: Record<any, any> = {}, looseEquality: boolean = false): boolean =>
  Object.keys(query).every(k => looseEquality ? item [k] == query[k] : item [k] === query[k]);

export const MATH_FUNCTION_MAP: Record<'+' | '-' | '*' | '/', (val1: number, val2: number) => number> = {
  '+': (val1, val2) => val1 + val2,
  '-': (val1, val2) => val1 - val2,
  '*': (val1, val2) => val1 * val2,
  '/': (val1, val2) => val1 / val2,
};

export const SEARCH_COMMAND_PREFIX = '@';

export enum OBJECT_SEARCH_COMMANDS {
  TakeValueAtKeyName = 'TakeValueAtKeyName',
  TakeValueOfKeyAt = 'TakeValueOfKeyAt',
  FirstItemWhere = 'FirstItemWhere',
  ObjectAsArray = 'ObjectAsArray',
  Math = 'Math',
  ExtractData = 'ExtractData',
  ApplyExtractedData = 'ApplyExtractedData',
  ApplyExtractedDataToItems = 'ApplyExtractedDataToItems',
  Where = 'Where',
  WhereNot = 'WhereNot',
}

export const SEARCH_FUNCTION_MAP: Record<OBJECT_SEARCH_COMMANDS, (value: any, commandArguments: string[], extractedData: Record<string, any>) => any> = {
  [OBJECT_SEARCH_COMMANDS.TakeValueAtKeyName]: (value: any, commandArguments: string[], extractedData: Record<string, any> = {}): any => {
    if (value instanceof Object && !(value instanceof Array)) {
      const [keyName, extractKeyAs] = commandArguments;

      if (!!extractKeyAs) {
        extractedData[extractKeyAs] = keyName;
      }

      return value[keyName];
    }
  },
  [OBJECT_SEARCH_COMMANDS.TakeValueOfKeyAt]: (value: any, commandArguments: string[], extractedData: Record<string, any> = {}): any => {
    if (value instanceof Object && !(value instanceof Array)) {
      const [stringIndex, extractKeyAs] = commandArguments;
      const index = parseInt(stringIndex, 10);
      const keyAtIndex = Object.keys(value)[index];

      if (!!extractKeyAs) {
        extractedData[extractKeyAs] = keyAtIndex;
      }

      return value[keyAtIndex];
    }
  },
  [OBJECT_SEARCH_COMMANDS.FirstItemWhere]: (value: any, commandArguments: string[]): any => {
    if (value instanceof Array) {
      const queryTerms: { key: string; value: string; }[] = commandArguments.map(cA => {
        const [key, value] = cA.split('=');
        return { key, value };
      });
      const filteredArray = value.filter((item: any) => {
        if (item instanceof Object) {
          return queryTerms.every(({ key, value }) => {
            const itemValue = item[key];

            return itemValue == value;
          });
        }

        return false;
      });

      return filteredArray[0];
    }
  },
  [OBJECT_SEARCH_COMMANDS.ObjectAsArray]: (value: any, commandArguments: string[]): any => {
    if (value instanceof Object) {
      const [applyKeyAs, skipKeyString = ''] = commandArguments;
      const skipKeys = skipKeyString.split('|');

      return Object.keys(value).filter(key => !skipKeys.includes(key)).map(key => (
        !!applyKeyAs ? { ...value[key], [applyKeyAs]: key } : value[key]
      ));
    }
  },
  [OBJECT_SEARCH_COMMANDS.Math]: (value: any, commandArguments: string[]): any => {
    if (value instanceof Object) {
      const [key1, operation, key2] = commandArguments;
      const mathFunction = MATH_FUNCTION_MAP[operation as keyof typeof MATH_FUNCTION_MAP];

      try {
        const val1 = parseInt(`${value[key1]}`, 10);
        const val2 = parseInt(`${value[key2]}`, 10);

        return mathFunction(val1, val2);
      } catch (e) {
        // Ignore.
      }
    }
  },
  [OBJECT_SEARCH_COMMANDS.ExtractData]: (value: any, dataKeys: string[], extractedData: Record<string, any> = {}): any => {
    if (value instanceof Object) {
      for (const dK of dataKeys) {
        extractedData[dK] = value[dK];
      }

      return value;
    }
  },
  [OBJECT_SEARCH_COMMANDS.ApplyExtractedData]: (value: any, keysToApply: string[], extractedData: Record<string, any> = {}): any => {
    if (value instanceof Object) {
      const mapOfValuesToApply = keysToApply.reduce((acc, k) => ({ ...acc, [k]: extractedData[k] }), {});

      return {
        ...value,
        ...mapOfValuesToApply,
      };
    }
  },
  [OBJECT_SEARCH_COMMANDS.ApplyExtractedDataToItems]: (value: any, keysToApply: string[], extractedData: Record<string, any> = {}): any => {
    if (value instanceof Array) {
      return value.map(item => SEARCH_FUNCTION_MAP[OBJECT_SEARCH_COMMANDS.ApplyExtractedData](item, keysToApply, extractedData));
    }
  },
  [OBJECT_SEARCH_COMMANDS.Where]: (value: any, commandArguments: string[]): any => {
    if (value instanceof Array) {
      const query = commandArguments.reduce((acc, kVP) => {
        const [key, value] = kVP.split('=');
        return { ...acc, [key]: value };
      }, {});

      return value.filter((item: any) => itemMatchesQuery(query, item, true));
    }
  },
  [OBJECT_SEARCH_COMMANDS.WhereNot]: (value: any, commandArguments: string[]): any => {
    if (value instanceof Array) {
      const query = commandArguments.reduce((acc, kVP) => {
        const [key, value] = kVP.split('=');
        return { ...acc, [key]: value };
      }, {});

      return value.filter((item: any) => !itemMatchesQuery(query, item, true));
    }
  },
};

export const findValueInItemByValuePath = (item: any, valuePath: string, extractedData: Record<string, any> = {}) => {
  const valuePathArray = valuePath.split('/').map(p => p.charAt(0) === SEARCH_COMMAND_PREFIX ? p : decodeURIComponent(p));

  let value = item;

  for (let i = 0; i < valuePathArray.length; i++) {
    const valuePathPart = valuePathArray[i];
    const isCommand = valuePathPart.charAt(0) === SEARCH_COMMAND_PREFIX;
    const commandName = isCommand ? ((valuePathPart.match(/@.*?(<|$)/gmi) ?? [])[0] || '').replace(/[@<]/g, () => '') : undefined;
    const searchFunction = isCommand ? SEARCH_FUNCTION_MAP[commandName as OBJECT_SEARCH_COMMANDS] : undefined;
    const commandArguments = isCommand ? ((valuePathPart.match(/<.*?>/gmi) ?? [])[0] || '').replace(/[<>]/g, () => '').split(',') : undefined;

    value = searchFunction ? searchFunction(value, commandArguments as string[], extractedData) : (value ?? {})[valuePathPart];
  }

  return value;
};

export const findValueInEachItemByValuePath = (items: any[], valuePath: string, extractedData: Record<string, any>[] = []) => items.map(item => {
  const extractedItemData = {};

  extractedData.push(extractedItemData);

  return findValueInItemByValuePath(item, valuePath, extractedItemData);
});

export const combineArrays = <ItemType>(arrays: ItemType[][]): ItemType[] => ([] as any[]).concat(...arrays);

export type KeyList<ItemType extends Record<string, any>> = keyof Partial<ItemType>;
export type NumericValueTransform = (value: any) => number;
export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

export const accumulate = <ItemType extends Record<string, any>>(items: ItemType[] = [], byKey: string, nonNumericKeys: KeyList<ItemType>[] = [], transformMap: PartialRecord<KeyList<ItemType>, NumericValueTransform> = {} as any): ItemType[] => {
  const accumulatorMap: Record<string, ItemType> = {};

  for (const item of items) {
    const cleanItem: ItemType = item || {} as any;
    const identifier = `${cleanItem[byKey]}`;

    if (!!identifier) {
      const existingItem: ItemType = accumulatorMap[identifier] || {};
      const keyList = Object.keys({ ...existingItem, ...cleanItem });
      const newItem: Partial<ItemType> = {};

      for (const key of keyList) {
        const transform = transformMap[key];
        const newValue: number = transform ? transform(cleanItem[key]) : cleanItem[key];

        newItem[key as keyof ItemType] = nonNumericKeys.includes(key) ? newValue : (existingItem[key] ?? 0) + parseFloat(`${newValue}`);
      }

      accumulatorMap[identifier] = newItem as ItemType;
    }
  }

  return Object.values(accumulatorMap);
};

export const sortOnFields = <ItemType extends Record<string, any>>(items: ItemType[] = [], sortFields: KeyList<ItemType>[] = []): ItemType[] => {
  let newItems = [...items];

  for (const sortField of sortFields) {
    newItems = newItems.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      return aValue !== bValue ? aValue > bValue ? 1 : -1 : 0;
    });
  }

  return newItems;
};
