import React from "react";
import cn from "classnames";

export type BorderStyleType =
  | "rounded-none"
  | "rounded-sm"
  | "rounded-md"
  | "rounded"
  | "rounded-lg"
  | "rounded-xl"
  | "rounded-2xl"
  | "rounded-3xl"
  | "rounded-full";

export type ColorStyleType =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  label?: string;
  color?: ColorStyleType;
  rounded?: BorderStyleType;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
}

export const Button = ({
  label = "Button",
  color = "blue" as ColorStyleType,
  rounded = "rounded" as BorderStyleType,
  prepend,
  append,
  ...props
}: ButtonProps) => {
  const buttonStyle = {
    red: "bg-red-500 hover:bg-red-400 ",
    orange: "bg-orange-500 hover:bg-orange-400",
    yellow: "bg-yellow-300 hover:bg-yellow-400",
    green: "bg-green-500 hover:bg-green-400",
    blue: "bg-blue-500 hover:bg-blue-400",
    purple: "bg-purple-500 hover:bg-purple-400",
  };

  return (
    <button
      {...props}
      className={cn("px-4 py-2 text-white ", buttonStyle[color], rounded)}
    >
      {prepend && <span className="mr-2">{prepend}</span>}
      {label}
      {append && <span className="ml-2">{append}</span>}
    </button>
  );
};

export default Button;
