import { describe, it, expect } from 'vitest';
import { useDayjs } from '@/composables/useDayjs';
import dayjs from "dayjs";

describe('useDayjs', () => {
  const { addDate, substractDate, startOf, endOf, isSame, isBefore, isAfter } = useDayjs();

  it('adds days correctly', () => {
    const result = addDate.value(new Date(2020, 0, 1), 5, 'day');
    expect(result).toEqual(dayjs(new Date(2020, 0, 1)).add(5, 'day').toDate());
  });

  it('subtracts days correctly', () => {
    const result = substractDate.value(new Date(2020, 0, 10), 5, 'day');
    expect(result).toEqual(dayjs(new Date(2020, 0, 10)).subtract(5, 'day').toDate());
  });

  it('gets start of month correctly', () => {
    const result = startOf.value(new Date(2020, 0, 15), 'month');
    expect(result).toEqual(dayjs(new Date(2020, 0, 1)).startOf('month').toDate());
  });

  it('gets end of month correctly', () => {
    const result = endOf.value(new Date(2020, 0, 15), 'month');
    expect(result).toEqual(dayjs(new Date(2020, 0, 31)).endOf('month').toDate());
  });

  it('compares same dates correctly', () => {
    const result = isSame.value(new Date(2020, 0, 1), new Date(2020, 0, 1), 'day');
    expect(result).toBe(true);
  });

  it('compares before correctly', () => {
    const result = isBefore.value(new Date(2020, 0, 1), new Date(2020, 0, 2), 'day');
    expect(result).toBe(true);
  });

  it('compares after correctly', () => {
    const result = isAfter.value(new Date(2020, 0, 2), new Date(2020, 0, 1), 'day');
    expect(result).toBe(true);
  });
});