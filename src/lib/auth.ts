import { getServerSession } from 'next-auth/next';
import { NextRequest } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

export interface Session {
  user: User;
}

export async function getSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  return session as Session | null;
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  
  if (session.user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  
  return session;
}

export function isAdmin(session: Session | null): boolean {
  return session?.user.role === 'admin';
}

export function isStaff(session: Session | null): boolean {
  return session?.user.role === 'staff' || session?.user.role === 'admin';
}