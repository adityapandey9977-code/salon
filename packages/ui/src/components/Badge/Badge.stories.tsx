import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['confirmed', 'arrived', 'in-service'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Confirmed: Story = {
  args: {
    variant: 'confirmed',
    children: 'Confirmed',
  },
};

export const Arrived: Story = {
  args: {
    variant: 'arrived',
    children: 'Arrived',
  },
};

export const InService: Story = {
  args: {
    variant: 'in-service',
    children: 'In service',
  },
};
