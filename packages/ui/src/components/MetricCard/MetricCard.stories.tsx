import type { Meta, StoryObj } from '@storybook/react';
import { Calendar, DollarSign, Users } from 'lucide-react';
import { MetricCard } from './MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Components/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Revenue: Story = {
  args: {
    title: 'Total Revenue',
    value: '₹28.45L',
    icon: <DollarSign className="w-4 h-4" />,
    variant: 'emerald',
    trend: {
      value: '+14.8%',
      isPositive: true,
    },
    comparison: 'vs ₹24.78L prev period',
  },
};

export const Appointments: Story = {
  args: {
    title: 'Appointments Booked',
    value: '1,482',
    icon: <Calendar className="w-4 h-4" />,
    variant: 'purple',
    trend: {
      value: '+8.2%',
      isPositive: true,
    },
    subtitle: '1,290 Done · 80 No-Show',
  },
};

export const Clients: Story = {
  args: {
    title: 'Active Clients',
    value: '3,890',
    icon: <Users className="w-4 h-4" />,
    variant: 'default',
    trend: {
      value: '-1.4%',
      isPositive: false,
    },
    comparison: 'vs 3,945 last month',
  },
};
