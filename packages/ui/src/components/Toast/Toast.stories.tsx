import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { ToastProvider, useToast } from './Toast';

const ToastDemo = () => {
  const { toast } = useToast();
  return (
    <Button variant="primary" onClick={() => toast('New appointment created')}>
      Show Toast
    </Button>
  );
};

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  render: () => (
    <ToastProvider>
      <div className="p-8">
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Default: Story = {};
