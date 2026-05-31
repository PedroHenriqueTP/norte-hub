import React from 'react';
import { AdminPortal } from '../../components/admin/AdminPortal';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ee1d23] selection:text-white">
      <AdminPortal />
    </div>
  );
}
