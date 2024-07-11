import { describe, it, expect } from 'vitest';
import { useDeepMerge } from '@/composables/useDeepMerge';

const { deepMerge } = useDeepMerge();

describe('deepMerge', () => {
  it('merges two simple objects', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const expected = { a: 1, b: 2 };
    expect(deepMerge(obj1, obj2)).toEqual(expected);
  });

  it('overwrites existing properties', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const expected = { a: 1, b: 3, c: 4 };
    expect(deepMerge(obj1, obj2)).toEqual(expected);
  });

  it('merges nested objects', () => {
    const obj1 = { a: { x: 1 }, b: 2 };
    const obj2 = { a: { y: 2 }, b: 3 };
    const expected = { a: { x: 1, y: 2 }, b: 3 };
    expect(deepMerge(obj1, obj2)).toEqual(expected);
  });

  it('does not merge non-object source', () => {
    const obj1 = { a: 1 };
    const obj2 = null;
    expect(deepMerge(obj1, obj2)).toEqual(obj1);
  });

  it('returns target if source is not an object', () => {
    const obj1 = { a: 1 };
    const obj2 = "not an object";
    expect(deepMerge(obj1, obj2)).toEqual(obj1);
  });

  it('merges objects with array properties by replacing the array', () => {
    const obj1 = { a: [1, 2], b: 2 };
    const obj2 = { a: [3, 4] };
    const expected = { a: [3, 4], b: 2 };
    expect(deepMerge(obj1, obj2)).toEqual(expected);
  });

});