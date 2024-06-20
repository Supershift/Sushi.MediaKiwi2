export enum TableFilterType {
  /** Renders a date picker */
  DatePicker,
  /* Renders a date range menu, with preset options */
  DateRange,
  /** Renders a text field */
  TextField,
  /** Renders a text field */
  Contains,
  /**
   * Dynamic type, depending on the amount of available options, will either use
   * {@link TableFilterType.Select} (> 5 options), {@link TableFilterType.RadioGroup} (<= 5 options) or {@link TableFilterType.Direct} (1 option)
   */
  SingleSelect,
  /**
   * Renders a dropdown component
   * @deprecated Use {@link TableFilterType.SingleSelect} instead
   */
  Select,
  /**
   * Renders a radio buton group
   * @deprecated Use {@link TableFilterType.SingleSelect} instead
   */
  RadioGroup,
  /** Renders no dedicated component, a click in the filter menu should be suffice */
  Direct,
  /**
   * Dynamic type, depending on the amount of available options, will either use
   * {@link TableFilterType.SelectMultiple} (> 5 options) or {@link TableFilterType.SelectMultipleCheckbox} (<= 5 options)
   */
  MultiSelect,
  /**
   * Renders a list of checkboxes
   * @deprecated Use {@link TableFilterType.MultiSelect} instead
   * */
  SelectMultipleCheckbox,
  /**
   * Renders a dropdown component
   * @deprecated Use {@link TableFilterType.MultiSelect} instead
   */
  SelectMultiple,
  /** Open your own component */
  Custom,
  Operator,
}
