'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Phone, Calendar, MessageSquare, Edit, Save, X } from 'lucide-react';

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  course: string;
  status: 'new' | 'contacted' | 'interested' | 'enrolled' | 'rejected';
  source: string;
  message: string;
  assignedTo: number | null;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
}

interface Note {
  id: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function LeadDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const leadId = params.id;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: '',
    course: '',
    message: ''
  });
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && leadId) {
      fetchLead();
    }
  }, [status, router, leadId]);

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      if (response.ok) {
        const data = await response.json();
        setLead(data.lead);
        setEditData({
          status: data.lead.status,
          course: data.lead.course,
          message: data.lead.message
        });
      } else {
        router.push('/crm/leads');
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
      router.push('/crm/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setLead(updatedData.lead);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`/api/leads/${leadId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newNote,
          userId: session?.user.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLead(prev => prev ? {
          ...prev,
          notes: [data.note, ...prev.notes]
        } : null);
        setNewNote('');
        setAddingNote(false);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  if (!lead) {
    return null; // Should not happen due to redirect above
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/crm/leads"
                className="text-blue-600 hover:text-blue-700 mr-4"
              >
                ← Back to Leads
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Lead Details</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setEditing(!editing)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                {editing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lead Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Lead Information</h2>
              </div>
              
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="h-4 w-4 inline mr-1" />
                      Full Name
                    </label>
                    <p className="text-sm text-gray-900">{lead.firstName} {lead.lastName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email
                    </label>
                    <p className="text-sm text-gray-900">{lead.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone
                    </label>
                    <p className="text-sm text-gray-900">{lead.phone}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Created Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <p className="text-sm text-gray-900">{lead.source}</p>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  {editing ? (
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      value={editData.message}
                      onChange={(e) => setEditData({...editData, message: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{lead.message || 'No message provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Status and Course */}
          <div>
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Status & Course</h2>
              </div>
              
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {editing ? (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={editData.status}
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="interested">Interested</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'interested' ? 'bg-green-100 text-green-800' :
                      lead.status === 'enrolled' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lead.status}
                    </span>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  {editing ? (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={editData.course}
                      onChange={(e) => setEditData({...editData, course: e.target.value})}
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">{lead.course}</p>
                  )}
                </div>
              </div>
            </div>
            
            {editing && (
              <button
                onClick={handleUpdate}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            )}
          </div>
        </div>
        
        {/* Notes Section */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Notes</h2>
            </div>
            
            <div className="px-6 py-4">
              {/* Add Note */}
              <div className="mb-6">
                {addingNote ? (
                  <div>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Add a note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={handleAddNote}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Add Note
                      </button>
                      <button
                        onClick={() => {
                          setAddingNote(false);
                          setNewNote('');
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingNote(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Note
                  </button>
                )}
              </div>
              
              {/* Notes List */}
              <div className="space-y-4">
                {lead.notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No notes yet. Add the first note!</p>
                ) : (
                  lead.notes.map((note) => (
                    <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{note.user.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}