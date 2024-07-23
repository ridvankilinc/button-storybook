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
  options: [
    {
      category: "Category 1",
      icon: <BiUserCircle />,
      description: "(desc)",
      value: "category1item1",
      label: "a100",
    },
    {
      category: "Category 1",
      value: "category1item2",
      label: "a101",
    },

    {
      category: "Category 2",
      value: "category2item1",
      label: "b100",
    },
    {
      category: "Category 2",
      icon: <BiUserCircle />,
      value: "category2item2",
      label: "b101",
    },

    {
      icon: <BiUserCircle />,
      value: "defaultvalue1",
      label: "c100",
    },
    {
      value: "defaultvalue2",
      label: "c101",
    },
    {
      value: "defaultvalue3 ",
      label: "c102",
    },
    {
      value: "defaultvalue4 ",
      label: "c103",
    },
    {
      value: "defaultvalue5 ",
      label: "c104",
    },
  ],
};
