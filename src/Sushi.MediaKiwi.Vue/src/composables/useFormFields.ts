export function useFormFields() {
  function deleteChip(index: number, fileUploads: File[]) {
    fileUploads.splice(index, 1);
  }

  return {
    deleteChip,
  };
}
