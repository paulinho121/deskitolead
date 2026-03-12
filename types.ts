
export enum LeadStatus {
  NEW = 'NEW',
  ENRICHING = 'ENRICHING',
  ENRICHED = 'ENRICHED',
  EXPORTED = 'EXPORTED'
}

export interface CompanyDetails {
  cnpj?: string;
  legalName?: string;
  tradeName?: string;
  activity?: string; // CNAE
  size?: string;
  address?: string;
  qsa?: string[]; // Partners
  foundedDate?: string;
}

export interface Lead {
  id: string;
  name: string;
  website: string;
  phone: string;
  industry: string;
  location: string;
  status: LeadStatus;
  details?: CompanyDetails;
  aiInsights?: string;
  lastUpdated: string;
}

export interface SearchFilters {
  keyword: string;
  location: string;
  cnae: string;
  radius: number;
  leadCount: number; // Nova propriedade para quantidade de leads
}
