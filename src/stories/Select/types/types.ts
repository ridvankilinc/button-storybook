import { ReactNode } from "react";

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface GroupOption {
  category: string;
  options: Option[];
}

export interface SelectProps {
  label?: string;
  defaultValue: string | string[];
  options: Option[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  allowClear?: boolean;
  searchInput?: boolean;
  multipleSelection?: boolean;
  multipleSelectionIcon?: boolean;
  selectAll?: boolean;
  maxSelect?: number;
  hideSelected?: boolean;
  defaultActiveFirstOption?: boolean;
  size: "small" | "default" | "large";
  status?: "default" | "warning" | "error";
  variant?: "outlined" | "borderless" | "filled";
  style?: React.CSSProperties;
  renderValue?: (value: any) => ReactNode;
}
