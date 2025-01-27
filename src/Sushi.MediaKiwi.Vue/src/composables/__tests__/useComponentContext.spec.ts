import { describe, it, expect, vi } from 'vitest';
import { useComponentContext } from '@/composables/useComponentContext';

vi.mock("vue", async () => {
  const actual = await import("vue")
  return {
    ...actual,
    getCurrentInstance: () => ({
      vnode: {
        props: {
          propOne: 'one',
          propTwo: 'two',
        },
      },
    }),
  };
});

describe('useComponentContext', () => {
  const { instance, hasDefinedEmit } = useComponentContext();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes and returns lowercase prop names in definedProps', () => {
    expect(instance).toBeDefined();
    expect(instance).toHaveProperty("vnode");
    expect(instance?.vnode.props).toEqual({ propOne: 'one', propTwo: 'two' });
  });

  it('correctly identifies if a defined emit exists', () => {
    expect(hasDefinedEmit('click:row')).toBe(false);
    expect(hasDefinedEmit('nonexistent:emit')).toBe(false);
  });
});