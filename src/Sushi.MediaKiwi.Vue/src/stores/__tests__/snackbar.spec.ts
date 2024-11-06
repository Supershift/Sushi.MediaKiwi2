// snackbar.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSnackbarStore } from '../snackbar';

describe('useSnackbarStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Pinia state before each test
    setActivePinia(createPinia());
  });

  it('initializes with show=false and message=""', () => {
    const snackbarStore = useSnackbarStore();
    expect(snackbarStore.show).toBe(false);
    expect(snackbarStore.message).toBe("");
  });

  it('updates show and message on showMessage', () => {
    const snackbarStore = useSnackbarStore();
    snackbarStore.showMessage('Test message');
    expect(snackbarStore.show).toBe(true);
    expect(snackbarStore.message).toBe('Test message');
  });
});