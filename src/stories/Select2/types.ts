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
  style?: React.CSSProperties;
  options?: Option[];
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  status?: "default" | "warning" | "error";
  variant?: "outlined" | "borderless" | "filled";
  searchable: boolean;
  clearable: boolean;
  mode?: "single" | "multi";
  multiCheckbox?: boolean;
  selectAll?: boolean;
  hideSelected?: boolean;
  maxSelect?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  renderLabels?: (label: string[]) => React.ReactNode;
  responsiveMultiple?: boolean;
}
