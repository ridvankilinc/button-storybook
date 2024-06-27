import React from "react";
import Button, { ButtonProps } from "./MyButton.tsx";

export default {
  title: "Button",
  component: Button,
};

const temp = (args: ButtonProps) => <Button {...args} />;

export const Primary = temp.bind({});
Primary.args = {
  hidden: false,
};
