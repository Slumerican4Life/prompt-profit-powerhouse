import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Download,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Power,
  PowerOff,
  Search
} from 'lucide-react';

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_needed: string;
  urgency_level: string | null;
  project_description: string | null;
  status: string;
  created_at: string;
  lead_value: number | null;
  notes: string | null;
}

export default function Dashboard() {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState('');
  const [leadStatus, setLeadStatus] = useState('');
  const [isAway, setIsAway] = useState(false);
  const { toast } = useToast();

  // Redirect if not authenticated or not authorized
  if (loading) return <div>Loading...</div>;
  if (!user || !profile) return <Navigate to="/auth" replace />;
  if (profile.role !== 'owner' && profile.role !== 'manager') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchLeads();
    setIsAway(profile.is_away);

    // Set up real-time subscription for new leads
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('New lead received:', payload);
          setLeads(current => [payload.new as Lead, ...current]);
          toast({
            title: "🎯 New Lead!",
            description: `${(payload.new as Lead).full_name} - ${(payload.new as Lead).service_needed}`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          setLeads(current => 
            current.map(lead => 
              lead.id === (payload.new as Lead).id ? payload.new as Lead : lead
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const filtered = leads.filter(lead =>
      lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.service_needed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    );
    setFilteredLeads(filtered);
  }, [leads, searchTerm]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive"
      });
    }
  };

  const handleAwayToggle = async () => {
    const newAwayStatus = !isAway;
    const { error } = await updateProfile({ is_away: newAwayStatus });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update away status",
        variant: "destructive"
      });
    } else {
      setIsAway(newAwayStatus);
      toast({
        title: "Status Updated",
        description: newAwayStatus ? "You are now away - AI will handle visitors" : "You are now available",
      });
    }
  };

  const updateLeadNotes = async () => {
    if (!selectedLead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          notes: notes,
          status: leadStatus || selectedLead.status 
        })
        .eq('id', selectedLead.id);

      if (error) throw error;

      toast({
        title: "Updated",
        description: "Lead information updated successfully",
      });

      fetchLeads();
      setSelectedLead(null);
      setNotes('');
      setLeadStatus('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive"
      });
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Service', 'Urgency', 'Status', 'Value', 'Description', 'Created'].join(','),
      ...filteredLeads.map(lead => [
        `"${lead.full_name}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.service_needed}"`,
        `"${lead.urgency_level || 'normal'}"`,
        `"${lead.status}"`,
        `"$${lead.lead_value || 0}"`,
        `"${(lead.project_description || '').replace(/"/g, '""')}"`,
        `"${new Date(lead.created_at).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToGoogleSheets = () => {
    const headers = ['Name', 'Email', 'Phone', 'Service', 'Urgency', 'Status', 'Value', 'Description', 'Created'];
    const data = filteredLeads.map(lead => [
      lead.full_name,
      lead.email,
      lead.phone,
      lead.service_needed,
      lead.urgency_level || 'normal',
      lead.status,
      `$${lead.lead_value || 0}`,
      lead.project_description || '',
      new Date(lead.created_at).toLocaleDateString()
    ]);

    const csvData = [headers, ...data].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(csvData);
    
    toast({
      title: "📋 Copied to Clipboard!",
      description: "Lead data copied. Paste into Google Sheets (Ctrl+V)",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency) {
      case 'emergency': return 'destructive';
      case 'urgent': return 'secondary';
      default: return 'outline';
    }
  };

  const totalValue = leads.reduce((sum, lead) => sum + (lead.lead_value || 0), 0);
  const newLeads = leads.filter(lead => lead.status === 'new').length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Manager Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile.full_name || profile.email}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant={isAway ? "destructive" : "outline"}
              onClick={handleAwayToggle}
              className="flex items-center gap-2"
            >
              {isAway ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              {isAway ? 'Away' : 'Available'}
            </Button>
            
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">New Leads</p>
                <p className="text-2xl font-bold">{newLeads}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <BarChart3 className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Qualified</p>
                <p className="text-2xl font-bold">{qualifiedLeads}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Leads</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button onClick={exportLeads} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={exportToGoogleSheets} variant="outline">
                  📊 Copy for Sheets
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Service</th>
                    <th className="text-left p-2">Contact</th>
                    <th className="text-left p-2">Urgency</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Value</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{lead.full_name}</td>
                      <td className="p-2">{lead.service_needed}</td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant={getUrgencyColor(lead.urgency_level)}>
                          {lead.urgency_level || 'normal'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`}></div>
                          {lead.status}
                        </div>
                      </td>
                      <td className="p-2">${lead.lead_value || 0}</td>
                      <td className="p-2 text-sm">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedLead(lead);
                            setNotes(lead.notes || '');
                            setLeadStatus(lead.status);
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Lead Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Lead: {selectedLead.full_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <select
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this lead..."
                  className="min-h-24"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedLead(null)}>
                  Cancel
                </Button>
                <Button onClick={updateLeadNotes}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}