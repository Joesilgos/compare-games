import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { GamesService } from './games.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { GameDto, SearchGameDto } from './game.dto';
import { Game } from './game.entity';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @Get('/search')
  @ApiOperation({ summary: 'Busca um jogo por título', description: 'Busca informações de um jogo pelo título. Verifica o cache, depois o banco de dados e, por fim, a API RAWG. Salva no banco se encontrado na API externa e busca dados do HowLongToBeat.', })
  @ApiQuery({ name: 'title', required: true, description: 'Título do jogo a ser pesquisado',  type: String, })
  @ApiResponse({ status: 200, description: 'Jogo encontrado', type: GameDto })
  @ApiResponse({ status: 404, description: 'Jogo não encontrado' })
  async searchGame( @Query() query: SearchGameDto, ): Promise<Game> {
    return await this.gamesService.searchGame(query.title);
    
  }

  @Get()
  @ApiOperation({ summary: 'Lista jogos armazenados', description: 'Lista os jogos armazenados no banco de dados com opções de filtro por título/plataforma e paginação.',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de jogos',type: Paginated<GameDto>, })
  @ApiQuery({ name: 'title', required: false, description: 'Filtrar por título (parcial, case-insensitive)', type: String, })
  @ApiQuery({ name: 'platform', required: false, description: 'Filtrar por plataforma (funcionalidade básica)', type: String, })
  async listGames(@Paginate() query: PaginateQuery): Promise<Paginated<Game>> {
    return this.gamesService.listGames(query);
  }
}
