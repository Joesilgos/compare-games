import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Game } from './game.entity';
import { GamesService } from './games.service';
import { RawgModule } from './rawg/rawg.module';
import { ScraperModule } from './scraper/scraper.module';
import { GamesController } from './games.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]), 
    RawgModule,
    ScraperModule
  ],
  controllers: [GamesController],
  providers: [GamesService]
})
export class GamesModule {}
