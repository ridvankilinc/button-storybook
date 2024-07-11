import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import Select, { SelectProps } from "./Select.tsx";

export default {
  title: "Stories/Select",
  component: Select,
} as Meta;

const Template: StoryFn<SelectProps> = (args) => {
  const [selectedValue, setSelectedValue] = useState(args.defaultValue);

  return <Select {...args} onChange={(value) => setSelectedValue(value)} />;
};

export const Default = Template.bind({});
Default.args = {
  options: [
    { label: "Jack", description: "açıklamama", value: "Option 1" },
    { label: "Alice", value: "Option 2" },
    { label: "James", value: "Option 3" },
    { label: "Adam", value: "Option 4" },
    { label: "Eve", value: "Option 5" },
    { label: "Frank", value: "Option 6" },
    { label: "Grace", value: "Option 7" },
    { label: "Henry", value: "Option 8" },
    { label: "Ivy", value: "Option 9" },
    { label: "Jackson", value: "Option 10" },
    { label: "Kate", value: "Option 11" },
    { label: "Lisa", value: "Option 12" },
    { label: "Mary", value: "Option 13" },
    { label: "Nancy", value: "Option 14" },
    { label: "Olivia", value: "Option 15" },
  ],
};
