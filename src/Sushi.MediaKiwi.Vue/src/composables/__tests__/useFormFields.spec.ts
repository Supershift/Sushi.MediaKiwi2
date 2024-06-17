import { describe, it, expect } from 'vitest';
import { useFormFields } from '@/composables/useFormFields';

describe('useFormFields', () => {
  it('deletes the correct chip by index', () => {
    const { deleteChip } = useFormFields();
    const fileUploads = [
      new File(['content1'], 'test1.txt'),
      new File(['content2'], 'test2.txt'),
      new File(['content3'], 'test3.txt'),
    ];

    deleteChip(1, fileUploads); // Delete the second file

    expect(fileUploads.length).toBe(2);
    expect(fileUploads[0].name).toBe('test1.txt');
    expect(fileUploads[1].name).toBe('test3.txt');
  });
});