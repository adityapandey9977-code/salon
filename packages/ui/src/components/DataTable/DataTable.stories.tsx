import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { type ColumnDef, DataTable } from './DataTable';

const meta: Meta = {
  title: 'Components/DataTable',
  tags: ['autodocs'],
};

export default meta;

interface SampleCustomer {
  id: string;
  name: string;
  phone: string;
  vipTier: string;
  visits: number;
  totalSpend: string;
  status: string;
}

const sampleData: SampleCustomer[] = [
  {
    id: 'CLT-101',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    vipTier: 'Gold Member',
    visits: 14,
    totalSpend: '₹42,500',
    status: 'Active',
  },
  {
    id: 'CLT-102',
    name: 'Ananya Iyer',
    phone: '+91 98234 56789',
    vipTier: 'Platinum Member',
    visits: 28,
    totalSpend: '₹1,12,000',
    status: 'Active',
  },
  {
    id: 'CLT-103',
    name: 'Rohan Verma',
    phone: '+91 97123 45678',
    vipTier: 'Silver Member',
    visits: 5,
    totalSpend: '₹14,200',
    status: 'Pending',
  },
  {
    id: 'CLT-104',
    name: 'Kavita Nair',
    phone: '+91 99887 76655',
    vipTier: 'Bronze Member',
    visits: 2,
    totalSpend: '₹3,800',
    status: 'Inactive',
  },
];

const columns: ColumnDef<SampleCustomer>[] = [
  {
    key: 'name',
    header: 'Customer Name',
    sortable: true,
    render: (row) => (
      <div>
        <div className="font-bold text-slate-900">{row.name}</div>
        <div className="text-[10.5px] text-slate-400 font-mono">{row.id}</div>
      </div>
    ),
  },
  {
    key: 'phone',
    header: 'Phone Number',
  },
  {
    key: 'vipTier',
    header: 'VIP Tier',
    sortable: true,
    render: (row) => (
      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
        {row.vipTier}
      </span>
    ),
  },
  {
    key: 'visits',
    header: 'Visits',
    sortable: true,
    align: 'center',
  },
  {
    key: 'totalSpend',
    header: 'Total Spend',
    sortable: true,
    align: 'right',
    render: (row) => <span className="font-bold text-slate-900">{row.totalSpend}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    render: (row) => <StatusBadge status={row.status} size="sm" />,
  },
];

export const DefaultTable: StoryObj = {
  render: () => (
    <DataTable<SampleCustomer>
      data={sampleData}
      columns={columns}
      searchKey="name"
      searchPlaceholder="Search customers by name..."
      selectable
    />
  ),
};
