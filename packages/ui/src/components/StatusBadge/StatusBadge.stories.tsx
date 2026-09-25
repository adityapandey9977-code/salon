import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showDot: { control: 'boolean' },
    pulseDot: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Confirmed: Story = {
  args: {
    status: 'Confirmed',
  },
};

export const InService: Story = {
  args: {
    status: 'In-Service',
    pulseDot: true,
  },
};

export const PendingReview: Story = {
  args: {
    status: 'Pending',
    label: 'Pending Review',
  },
};

export const VIPMember: Story = {
  args: {
    status: 'VIP',
    label: 'Gold VIP',
  },
};

export const Cancelled: Story = {
  args: {
    status: 'Cancelled',
  },
};
