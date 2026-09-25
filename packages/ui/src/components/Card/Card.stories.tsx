import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <div>
          <CardTitle>The next few hours</CardTitle>
          <CardDescription>Front desk schedule · Wednesday</CardDescription>
        </div>
        <Button variant="text-action">Open calendar</Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-sm text-soft">Content goes here...</div>
      </CardContent>
    </Card>
  ),
};
