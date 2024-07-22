import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Select2 from "./Select2.tsx";
import { Select2Props } from "./types.ts";
import { BiUserCircle } from "react-icons/bi";

export default {
  title: "Stories/Select2",
  component: Select2,
} as Meta;

const Template: StoryFn<Select2Props> = (args) => {
  return <Select2 {...args} style={{ width: 400 }} />;
};

export const Default = Template.bind({});
Default.args = {
  mode: "multi",
  searchable: true,
  options: [
    {
      category: "Category 1",
      icon: <BiUserCircle />,
      description: "(desc)",
      value: "category1item1",
      label: "Category Item 1",
    },
    {
      category: "Category 1",
      icon: <BiUserCircle />,
      value: "category1item2",
      label: "Category Item 2",
    },

    {
      category: "Category 2",
      icon: <BiUserCircle />,
      value: "category2item1",
      label: "Category Item 1",
    },
    {
      category: "Category 2",
      value: "category2item2",
      label: "Category Item 2",
    },

    {
      icon: <BiUserCircle />,
      value: "defaultvalue1",
      label: "Default Value 1",
    },
    {
      value: "defaultvalue2",
      label: "Default Value 2",
    },
    {
      value: "defaultvalue3 ",
      label: "Default Value 3",
    },
  ],
};
