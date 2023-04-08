import flatten, { unflatten } from 'flat';

export const Flatten = (data: Record<any, any>) =>
  flatten(data, {
    delimiter: '/',
    safe: false,
    maxDepth: Infinity,
    transformKey: (key = '') => encodeURIComponent(key),
  });

export const Unflatten = (flatData: Record<any, any>) =>
  unflatten(flatData, {
    delimiter: '/',
    object: false,
    overwrite: true,
    transformKey: (key = '') => decodeURIComponent(key),
  });
