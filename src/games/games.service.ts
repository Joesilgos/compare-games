import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  paginate,
  PaginateQuery,
  Paginated,
  PaginateConfig,
} from 'nestjs-paginate';
import { Game } from './game.entity';
import { RawgService } from './rawg/rawg.service';
import { ScraperService } from './scraper/scraper.service';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly rawgService: RawgService,
    private readonly scraperService: ScraperService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  async searchGame(title: string): Promise<Game> {
    // Changed return type to Game, throws NotFoundException if null
    const cacheKey = `game_search_${title.toLowerCase().replace(/\s+/g, '_')}`;
    this.logger.log(`Searching for game: ${title}. Cache key: ${cacheKey}`);

    // Check cache
    const cachedGame = await this.cacheManager.get<Game>(cacheKey);
    if (cachedGame) {
      this.logger.log(`Game found in cache: ${title}`);
      return cachedGame;
    }
    this.logger.log(`Game not found in cache: ${title}`);

    

    // Check database using the ID found in RAWG
    let game = await this.gameRepository.findOneBy({ title: title });
    if (game) {
      this.logger.log(`Game found in database with Title: ${title}. Caching and returning.`);
      
      // Optionally update HLTB data if it's missing or outdated
      // if (!game.howLongToBeatData) {
      //   this.logger.log(`HLTB data missing for game Title: ${title}. Fetching...`);
      //   try {
      //     game.howLongToBeatData = await this.scraperService.getHowLongToBeatData(game.title);
      //   } catch (scrapeError) {
      //     this.logger.warn(`Failed to fetch or save HLTB data for game Title ${title} during DB check: ${scrapeError.message}`,);
      //   }
      // }

      await this.gameRepository.save(game);
      await this.cacheManager.set(cacheKey, game)
      return game;
    }

    this.logger.log(`Game not found in database with ID: ${title}. Fetching details from RAWG.`);

    //Search in RAWG API
    const rawgSearchResult = await this.rawgService.searchGameByTitle(title);
    if (!rawgSearchResult || !rawgSearchResult.id) {
      this.logger.warn(`Game not found in RAWG API: ${title}`);
      throw new NotFoundException(`Game with title containing "${title}" not found.`,);
    }

    const gameId = rawgSearchResult.id;
    this.logger.log(`Game found in RAWG API with ID: ${gameId}. Fetching details.`);

    

    // Fetch full details from RAWG API
    const rawgGameDetails = await this.rawgService.getGameDetailsById(gameId);
    if (!rawgGameDetails) {
      this.logger.error(`Failed to fetch details for game ID ${gameId} from RAWG after successful search.`);
      throw new NotFoundException(`Could not retrieve details for game ID ${gameId}.`);
    }

    // Fetch HowLongToBeat data (Bonus)
    let hltbData = null;
    // try {
    //   this.logger.log(`Fetching HowLongToBeat data for: ${rawgGameDetails.name}`)
    //   hltbData = await this.scraperService.getHowLongToBeatData(rawgGameDetails.name);
    // } catch (scrapeError) {
    //   this.logger.error(`Failed to fetch HLTB data for new game ${rawgGameDetails.name}: ${scrapeError.message}`);
    // }

    this.logger.log(`Mapping RAWG details and HLTB data for game ID: ${gameId}`);

    const newGame = this.gameRepository.create({
      id: rawgGameDetails.id,
      title: rawgGameDetails.name,
      description: rawgGameDetails.description || 'No description available.',
      platforms: rawgGameDetails.platforms?.map((p) => p.platform.name) || [],
      releaseDate: rawgGameDetails.released,
      rating: rawgGameDetails.rating,
      coverImage: rawgGameDetails.background_image,
      howLongToBeatData: hltbData,
    });

    try {
      this.logger.log(`Saving new game to database with ID: ${gameId}`);
      const game = await this.gameRepository.save(newGame);
      this.logger.log(`Caching newly saved game with ID: ${gameId}`);
      await this.cacheManager.set(cacheKey, game);
      return game;
    } catch (dbError) {
      this.logger.error(`Failed to save new game ID ${gameId} to database: ${dbError.message}`);
      throw new Error(`Failed to save game ID ${gameId} to database.`);
    }


  }

  async listGames(query: PaginateQuery): Promise<Paginated<Game>> {
    this.logger.log(`Listing games with query: ${JSON.stringify(query)}`);


    return await paginate(query, this.gameRepository, {
      sortableColumns: ['id', 'title', 'description', 'platforms', 'releaseDate', 'rating', 'coverImage', 'createdAt'],
      searchableColumns: ['title'],
      defaultSortBy: [['createdAt', 'DESC']],
      filterableColumns: {
        title: true,
        platform: true,
      },
    });
  }
}
