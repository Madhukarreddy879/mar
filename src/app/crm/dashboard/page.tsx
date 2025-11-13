'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  TrendingUp, 
  Eye, 
  ArrowRight,
  BarChart3,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Mail
} from 'lucide-react';

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  course: string;
  status: 'new' | 'contacted' | 'interested' | 'enrolled' | 'rejected';
  source: string;
  assignedTo: number | null;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  enrolledLeads: number;
  rejectedLeads: number;
  conversionRate: number;
}

const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
  <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className="text-green-600 text-xs font-semibold mt-2">↑ {trend} this month</p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
    new: { bg: 'bg-blue-50', text: 'text-blue-700', icon: AlertCircle },
    contacted: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Mail },
    interested: { bg: 'bg-purple-50', text: 'text-purple-700', icon: TrendingUp },
    enrolled: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle }
  };

  const config = statusConfig[status] || statusConfig.new;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    enrolledLeads: 0,
    rejectedLeads: 0,
    conversionRate: 0
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        const leads = data.leads;
        
        // Calculate stats
        const totalLeads = leads.length;
        const newLeads = leads.filter((lead: Lead) => lead.status === 'new').length;
        const contactedLeads = leads.filter((lead: Lead) => lead.status === 'contacted').length;
        const enrolledLeads = leads.filter((lead: Lead) => lead.status === 'enrolled').length;
        const rejectedLeads = leads.filter((lead: Lead) => lead.status === 'rejected').length;
        const conversionRate = totalLeads > 0 ? (enrolledLeads / totalLeads) * 100 : 0;

        setStats({
          totalLeads,
          newLeads,
          contactedLeads,
          enrolledLeads,
          rejectedLeads,
          conversionRate: Math.round(conversionRate * 10) / 10
        });

        // Get recent leads (last 8)
        const recent = leads
          .sort((a: Lead, b: Lead) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 8);
        setRecentLeads(recent);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {session?.user.name}!</h1>
        <p className="text-blue-100">
          {session?.user.role === 'admin' 
            ? 'You have full administrative access' 
            : 'You have staff access'}
        </p>
      </div>

      {/* Main Content */}
      <div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={FileText}
            label="Total Leads"
            value={stats.totalLeads}
            color="bg-blue-600"
          />
          <StatCard
            icon={AlertCircle}
            label="New Leads"
            value={stats.newLeads}
            color="bg-green-600"
            trend={stats.newLeads}
          />
          <StatCard
            icon={Mail}
            label="Contacted"
            value={stats.contactedLeads}
            color="bg-yellow-600"
          />
          <StatCard
            icon={CheckCircle}
            label="Enrolled"
            value={stats.enrolledLeads}
            color="bg-purple-600"
          />
          <StatCard
            icon={BarChart3}
            label="Conversion"
            value={`${stats.conversionRate}%`}
            color="bg-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Status Breakdown */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Status Breakdown
            </h3>
            <div className="space-y-4">
              {[
                { label: 'New', value: stats.newLeads, color: 'bg-blue-500', percent: stats.totalLeads > 0 ? (stats.newLeads / stats.totalLeads) * 100 : 0 },
                { label: 'Contacted', value: stats.contactedLeads, color: 'bg-yellow-500', percent: stats.totalLeads > 0 ? (stats.contactedLeads / stats.totalLeads) * 100 : 0 },
                { label: 'Interested', value: 0, color: 'bg-purple-500', percent: 0 },
                { label: 'Enrolled', value: stats.enrolledLeads, color: 'bg-green-500', percent: stats.totalLeads > 0 ? (stats.enrolledLeads / stats.totalLeads) * 100 : 0 },
                { label: 'Rejected', value: stats.rejectedLeads, color: 'bg-red-500', percent: stats.totalLeads > 0 ? (stats.rejectedLeads / stats.totalLeads) * 100 : 0 }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/crm/leads?status=new"
                className="block w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-center font-medium text-blue-700"
              >
                View New Leads ({stats.newLeads})
              </Link>
              <Link
                href="/crm/leads?status=contacted"
                className="block w-full p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors text-center font-medium text-yellow-700"
              >
                Follow-up Required ({stats.contactedLeads})
              </Link>
              <Link
                href="/crm/leads"
                className="block w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-center font-medium text-gray-700"
              >
                All Leads
              </Link>
              {session?.user.role === 'admin' && (
                <Link
                  href="/crm/users"
                  className="block w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-center font-medium text-purple-700"
                >
                  Manage Users
                </Link>
              )}
            </div>
          </div>

          {/* Today's Summary */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Key Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Leads</span>
                <span className="text-2xl font-bold text-gray-900">{stats.totalLeads}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Enrollment Rate</span>
                <span className="text-2xl font-bold text-green-600">{stats.conversionRate}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">Conversion Goal</span>
                <span className="text-sm font-semibold text-blue-600">15%</span>
              </div>
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Performance Status</p>
                <p className="text-sm font-bold text-blue-700">
                  {stats.conversionRate >= 15 ? '✓ On Track' : '⚠ Below Target'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leads Table */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
                Recent Leads
              </h3>
              <Link
                href="/crm/leads"
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-blue-600">
                              {lead.firstName.charAt(0)}{lead.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {lead.firstName} {lead.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.course || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(lead.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/crm/leads/${lead.id}`}
                          className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No leads yet</p>
                        <p className="text-sm mt-1">Leads from your website will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
