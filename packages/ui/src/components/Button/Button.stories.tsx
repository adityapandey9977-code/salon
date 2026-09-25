import type { Meta, StoryObj } from '@storybook/react';
import { BellIcon, CalendarIcon, PlusIcon } from '../Icons/Icons';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'icon', 'text-action', 'timeline-footer', 'sidebar-nav'],
    },
    isActive: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <PlusIcon className="w-4 h-4" />
        <span>New appointment</span>
      </>
    ),
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <CalendarIcon className="w-[14px] h-[14px] text-muted" />
        Wed, 22 Jul
      </>
    ),
  },
};

export const Icon: Story = {
  args: {
    variant: 'icon',
    children: <BellIcon />,
  },
};

export const TextAction: Story = {
  args: {
    variant: 'text-action',
    children: 'Open calendar',
  },
};

export const SidebarNav: Story = {
  args: {
    variant: 'sidebar-nav',
    children: 'Appointments',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
