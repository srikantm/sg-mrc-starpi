import Component from './index';
import {Meta, StoryObj} from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;
export const Error: Story = {
  args: {
    severity: 'error',
  },
};

export const Info: Story = {
  args: {
    severity: 'info',
  },
};

export const Success: Story = {
  args: {
    severity: 'success',
  },
};

export const Warning: Story = {
  args: {
    severity: 'warning',
  },
};
