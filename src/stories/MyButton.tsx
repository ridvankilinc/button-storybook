import React from "react";
import "./myButton.css";
import cn from "classnames";

type BorderStyleType =
  | "rounded-none"
  | "rounded-sm"
  | "rounded-md"
  | "rounded"
  | "rounded-lg"
  | "rounded-xl"
  | "rounded-2xl"
  | "rounded-3xl"
  | "rounded-full";

type ColorStyleType = "red" | "orange" | "yellow" | "green" | "blue" | "purple";

type IconPositionType = "prepend" | "append";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  label?: string;
  color?: ColorStyleType;
  borderRadius?: BorderStyleType;
  icon?: React.ReactNode;
  iconPosition?: IconPositionType;
}

const Button = ({
  label = "Button",
  color = "blue" as ColorStyleType,
  borderRadius = "rounded" as BorderStyleType,
  icon,
  iconPosition = icon && label ? "prepend" : undefined,
  ...props
}: ButtonProps) => {
  const colorStyle = {
    red: "bg-red-500",
    orange: "bg-orange-500 border-orange-200 text-white",
    yellow: "bg-yellow-300",
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  };

  return (
    <button
      {...props}
      className={cn(
        "px-4 py-2 flex items-center justify-center gap-2",
        colorStyle[color],
        borderRadius
      )}
    >
      {icon && iconPosition === "prepend" && <span>{icon}</span>}
      {label}
      {icon && iconPosition === "append" && <span>{icon}</span>}
    </button>
  );
};

export default Button;
