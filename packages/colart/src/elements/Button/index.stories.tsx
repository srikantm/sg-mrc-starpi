import type { Meta, StoryObj } from "@storybook/react";

import Component from "./index";

const meta: Meta<typeof Component> = {
  // title: 'Example/Button',
  component: Component,
  // parameters: {
  //   layout: 'centered',
  // },
  // tags: ['autodocs'],
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
};

export default meta;

// type Story = StoryObj<typeof meta>;
type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  render: (args) => <Component {...args}>Test</Component>,
  args: {},
};
