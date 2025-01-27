# Form Messages

Forms use a collection of labels when feedback is given. The `{{message.entryName}}` placeholder can be edited by passing a entry-name prop on the form components.

By default the entry is resolved to a default value, being entry

### Load Labels

- loadFailedSnackbarMessage: **Failed to load `{{message.entryName}}`**

### Undo Labels

- undoSuccessSnackbarMessage: **Changes reverted**
- undoFailedSnackbarMessage: **Failed to revert changes**
- undoButtonLabel: **Undo changes**

### Delete labels

- deleteButtonLabel: **Delete**
- deleteConfirmationTitle: **Delete this `{{message.entryName}}`**
- deleteConfirmationBody: **Are you sure you want to delete this `{{message.entryName}}`?**
- deleteSuccessfulMessage: **Successfully deleted the `{{message.entryName}}`**
- deleteFailedMessage: **Failed to delete the `{{message.entryName}}`**

### Submit labels:

- submitButtonLabel: **Submit**
- submitConfirmationTitle: **Submit this `{{message.entryName}}`**
- submitConfirmationBody: **Are you sure you want to submit this `{{message.entryName}}`?**
- submitSuccessMessage: **Successfully submitted the `{{message.entryName}}`**

### Save labels:

- saveButtonLabel: **Save**
- saveConfirmationTitle: **Save this `{{message.entryName}}`**
- saveConfirmationBody: **Are you sure you want to save this `{{message.entryName}}`?**
- saveSuccessMessage: **Successfully saved the `{{message.entryName}}`**

### Edit labels:

- editConfirmationTitle: **Edit this `{{message.entryName}}`**
- editConfirmationBody: **Are you sure you want to edit this `{{message.entryName}}`?**
- editSuccessMessage: **Successfully edited the `{{message.entryName}}`**
