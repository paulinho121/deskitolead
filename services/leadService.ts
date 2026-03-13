
import { supabase } from './supabase';
import { Lead, LeadStatus } from '../types';

export const LeadService = {
  async getAllLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('lastUpdated', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }

    return (data || []) as Lead[];
  },

  async saveLeads(leads: Lead[]): Promise<boolean> {
    const { error } = await supabase
      .from('leads')
      .upsert(leads, { onConflict: 'id' });

    if (error) {
      console.error('Error saving leads:', error);
      return false;
    }

    return true;
  },

  async updateLeadStatus(id: string, status: LeadStatus, insights?: string, details?: any): Promise<boolean> {
    const updateData: any = { status, lastUpdated: new Date().toISOString().split('T')[0] };
    if (insights) updateData.aiInsights = insights;
    if (details) updateData.details = details;

    const { error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating lead status:', error);
      return false;
    }

    return true;
  },

  async deleteLead(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      return false;
    }

    return true;
  }
};
