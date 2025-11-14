'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Phone, Calendar, MessageSquare } from 'lucide-react';

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
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
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
                ← Back to Students
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Student Details</h1>
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
                <h2 className="text-lg font-medium text-gray-900">Student Information</h2>
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
                   <p className="text-sm text-gray-900">{lead.message || 'No message provided'}</p>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Course Information */}
          <div>
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Course Information</h2>
              </div>
              
              <div className="px-6 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interested Course</label>
                  <p className="text-sm text-gray-900">{lead.course}</p>
                </div>
              </div>
            </div>
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