export const omit = (obj: Record<string, any>, keys: string[]) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Record<string, any>);
};

