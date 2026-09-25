import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;

export const InteractiveModal: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
          <Modal.Header
            title="Create Master SKU"
            subtitle="Add a new consumable product to the inventory database."
          />
          <Modal.Body className="space-y-4">
            <Input label="SKU Name" placeholder="e.g. L'Oreal Inoa 5.0 Natural Brown" />
            <Input label="Barcode / EAN" placeholder="e.g. 8901234567890" />
            <Input label="Cost Price (₹)" placeholder="e.g. 450" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Save SKU
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
};
