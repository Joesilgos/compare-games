import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class RawgService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.rawg.io/api';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('RAWG_API_KEY')!;
    if (!this.apiKey) {
      throw new Error(
        'RAWG_API_KEY is not defined in the environment variables',
      );
    }
  }

  async searchGameByTitle(title: string): Promise<IRawg | null> {
    const url = `${this.baseUrl}/games`;
    try {
      const response = await firstValueFrom(
        this.httpService.get<IResponseRawg<IRawg>>(url, {
          params: {
            key: this.apiKey,
            search: title,
            page_size: 1
          },
        }),
      );
      // Retorna apenas o primeiro jogo encontrado, se houver
      return response.data?.results?.[0] || null;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error fetching game from RAWG API: ${axiosError.message}`, axiosError.response?.data)
      throw new Error(`Failed to fetch game '${title}' from RAWG API`);
    }
  }

  async getGameDetailsById(id: number): Promise<any> {
    const url = `${this.baseUrl}/games/${id}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            key: this.apiKey,
          },
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error fetching game details from RAWG API for ID ${id}: ${axiosError.message}`,
        axiosError.response?.data,
      );
      throw new Error( `Failed to fetch game details for ID ${id} from RAWG API`);
    }
  }
}
