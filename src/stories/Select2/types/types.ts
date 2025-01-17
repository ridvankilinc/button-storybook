export interface Option {
  category?: string;
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface Select2Props {
  placeholder?: string;
  label?: string;
  labelModel?: "default" | "fixed" | "open";
  style?: React.CSSProperties;
  options?: Option[];
  disabled?: boolean;
  loading?: boolean;
  size?: "small" | "medium" | "large";
  status?: "default" | "warning" | "error";
  variant?: "outlined" | "filled" | "borderless";
  searchable?: boolean;
  clearable?: boolean;
  clearOnSelect?: boolean;
  mode?: "single" | "multi";
  multiCheckbox?: boolean;
  selectAll?: boolean;
  hideSelected?: boolean;
  maxSelect?: number;
  menuPlacement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  renderLabel?: (label: string) => React.ReactNode;
  responsiveMultiple?: boolean;
  highlightOnHover?: boolean;
  menuNoData?: () => React.ReactNode;
  menuLabel?: (label: string) => React.ReactNode;
  icon?: Icons;
}

interface Icons {
  selectAllBlank?: React.ReactNode;
  selectAllFill?: React.ReactNode;
  menuNoData?: React.ReactNode;
}
