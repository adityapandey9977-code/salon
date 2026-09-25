import React from 'react';
import { Outlet } from 'react-router';
import { CallCenterCTIBar } from '../components/CallCenterCTIBar';
import { InboundCallerScreenPopModal } from '../components/InboundCallerScreenPopModal';

export function CallCenterMainLayout() {
  return (
    <div className="flex flex-col min-h-full -m-4 md:-m-6 lg:-m-8">
      <InboundCallerScreenPopModal />
      <CallCenterCTIBar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
}
