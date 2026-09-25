import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['square-monogram', 'circle-profile', 'circle-guest'],
    },
    colorScheme: {
      control: 'select',
      options: ['default', 'one', 'two', 'three', 'four'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Monogram: Story = {
  args: {
    variant: 'square-monogram',
    initials: 'A',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Profile: Story = {
  args: {
    variant: 'circle-profile',
    initials: 'AS',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const GuestOne: Story = {
  args: {
    variant: 'circle-guest',
    colorScheme: 'one',
    initials: 'PS',
  },
};
