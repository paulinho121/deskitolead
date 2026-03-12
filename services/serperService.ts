export interface SerperPlace {
  title: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  category?: string;
  description?: string;
}

export interface SerperResponse {
  places: SerperPlace[];
  knowledge_graph?: any;
  searchParameters: {
    q: string;
    type: string;
    num: number;
  };
}

export class SerperService {
  private static readonly API_KEY = process.env.REACT_APP_SERPER_API_KEY || process.env.SERPER_API_KEY || 'SUA_API_KEY_AQUI';
  private static readonly BASE_URL = 'https://google.serper.dev/search';

  static async searchPlaces(
    keyword: string,
    location: string,
    limit: number = 10
  ): Promise<SerperPlace[]> {
    try {
      // Constrói a query de busca para o Google Maps
      const query = `${keyword} in ${location}`;
      
      // Faz a chamada à API do Serper
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          type: 'places', // Busca específica no Google Maps
          num: Math.min(limit, 100), // Limit máximo da API é 100
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data: SerperResponse = await response.json();
      
      // Retorna apenas a quantidade solicitada
      return data.places.slice(0, limit);
      
    } catch (error) {
      console.error('Erro ao buscar lugares no Serper:', error);
      throw error;
    }
  }

  static async searchPlacesWithPagination(
    keyword: string,
    location: string,
    limit: number
  ): Promise<SerperPlace[]> {
    const allResults: SerperPlace[] = [];
    const maxResultsPerCall = 100;
    let remainingResults = limit;

    try {
      while (remainingResults > 0) {
        const currentLimit = Math.min(remainingResults, maxResultsPerCall);
        const results = await this.searchPlaces(keyword, location, currentLimit);
        
        allResults.push(...results);
        remainingResults -= results.length;

        // Se a API retornou menos resultados que o solicitado, chegamos ao fim
        if (results.length < currentLimit) {
          break;
        }

        // Evita rate limiting - pequeno delay entre chamadas
        if (remainingResults > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return allResults.slice(0, limit);
      
    } catch (error) {
      console.error('Erro na busca paginada:', error);
      throw error;
    }
  }

  static convertSerperToLead(serperPlace: SerperPlace, keyword: string, location: string): any {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: serperPlace.title || 'Nome não disponível',
      website: serperPlace.website || '',
      phone: serperPlace.phone || '',
      industry: serperPlace.category || keyword,
      location: serperPlace.address || location,
      status: 'NEW' as const,
      lastUpdated: new Date().toISOString().split('T')[0],
      source: 'serper_maps',
      rating: serperPlace.rating,
      reviews: serperPlace.reviews,
      description: serperPlace.description
    };
  }
}
