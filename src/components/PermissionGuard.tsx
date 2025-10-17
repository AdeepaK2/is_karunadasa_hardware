'use client';

import { useApp } from '@/contexts/AppContext';
import { UserPermissions } from '@/types';
import { ReactNode } from 'react';

interface PermissionGuardProps {
  permission: keyof UserPermissions;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { currentUser } = useApp();

  if (!currentUser || !currentUser.permissions[permission]) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
