import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import Select, { SelectProps } from "./Select.tsx";

export default {
  title: "Stories/Select",
  component: Select,
} as Meta;

const Template: StoryFn<SelectProps> = (args) => {
  const [selectedValue, setSelectedValue] = useState(args.defaultValue);

  return (
    <Select
      {...args}
      defaultValue={"selectedValue"}
      onChange={(value) => setSelectedValue(value)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  options: [
    { label: "Jack", value: "Option1" },
    {
      label: "AliceAliceAliceAliceAliceAliceAliceAliceAlice",
      value: "Option 2",
    },
    { label: "James", value: "Option 3" },
    { label: "Adam", value: "Option 4", disabled: true },
  ],
};
