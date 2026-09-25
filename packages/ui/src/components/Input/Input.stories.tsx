import type { Meta, StoryObj } from '@storybook/react';
import { Input, PasswordInput, SearchInput } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'flush'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Client Full Name',
    placeholder: 'e.g. Priya Sharma',
    helperText: "Enter customer's full name as registered on booking.",
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    value: 'invalid-email',
    error: 'Please enter a valid email address.',
  },
};

export const Search: StoryObj<typeof SearchInput> = {
  render: () => <SearchInput placeholder="Search services, clients, or inventory..." />,
};

export const Password: StoryObj<typeof PasswordInput> = {
  render: () => <PasswordInput label="Account Password" placeholder="Enter password" />,
};
