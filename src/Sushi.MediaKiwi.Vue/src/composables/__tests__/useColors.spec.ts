import "reflect-metadata";
import { useColors } from '@/composables/useColors'
import { describe, it, expect } from 'vitest'

describe.skip('useColors', () => {
  // TODO: finish mocking the theme globals

  const hoisted = vi.hoisted(() => {
    return {
      useTheme: vi.fn().mockReturnValue({
        theme: {
          global: {
            current: {
              value: {
                variables: {
                  primary: "#123456",
                  secondary: "#654321",
                  "on-primary": "#abcdef",
                  "on-secondary": "#fedcba",
                },
              },
            },
          },
        }
      }),
    };
  });

  vi.mock("vuetify", async () => {
    const actual = await import("vuetify");
    return {
      ...actual,
      useTheme: hoisted.useTheme,
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should return colors without on- prefix', () => {
    const { colors } = useColors()

    expect(colors.value).toEqual([
      { key: 'primary', value: '#123456', onKey: 'on-primary', onValue: '#abcdef' },
      { key: 'secondary', value: '#654321', onKey: 'on-secondary', onValue: '#fedcba' },
    ])
  })

  it('should return css variables', () => {
    const { cssVariables } = useColors()

    expect(cssVariables.value).toEqual({
      primary: '--v-primary-base',
      secondary: '--v-secondary-base',
    })
  })

  it('should return color background classes', () => {
    const { getColorBackgroundClasses } = useColors()
    expect(getColorBackgroundClasses('primary')).toBe('bg-primary')
    expect(getColorBackgroundClasses('on-primary')).toBe('mk-bg-on-primary')
  })

  it('should return true if color is css color', () => {
    const { isCssColor } = useColors()
    expect(isCssColor('#123456')).toBe(true)
    expect(isCssColor('rgba(0,0,0,0)')).toBe(false)
    expect(isCssColor('primary')).toBe(false)
  });
})