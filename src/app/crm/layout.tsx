import Sidebar from '@/components/Sidebar';
import { ReactNode } from 'react';

export default function CRMLayout({ children }: { children: ReactNode }) {
  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
}
