import React from "react";
import Button from "./Button.tsx";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Stories/Button",
  component: Button,
} as Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    label: "Default",
    color: "blue",
    rounded: "rounded",
  },
};

export const Colors = {
  render: () => (
    <div className="flex gap-2">
      <Button label="Red" color="red" />
      <Button label="Orange" color="orange" />
      <Button label="Yellow" color="yellow" />
      <Button label="Green" color="green" />
      <Button label="Blue" color="blue" />
      <Button label="Purple" color="purple" />
    </div>
  ),
};

export const Rounded: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button label="Rounded None" rounded="rounded-none" />
      <Button label="Rounded Sm" rounded="rounded-sm" />
      <Button label="Rounded" rounded="rounded" />
      <Button label="Rounded Xl" rounded="rounded-xl" />
      <Button label="Rounded 3xl" rounded="rounded-3xl" />
      <Button label="Rounded Full" rounded="rounded-full" />
    </div>
  ),
};

export const Extension: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button label="With Prepend" prepend="prepend" />
      <Button label="With Append" append="append" />
      <Button label="With Both" prepend="prepend" append="append" />
    </div>
  ),
};
