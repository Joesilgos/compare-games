import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class GameDto {
  @ApiProperty({
    description: 'ID único do jogo (proveniente da API RAWG)',
    example: 3498,
  })
  id: number;

  @ApiProperty({ description: 'Título do jogo', example: 'Grand Theft Auto V' })
  title: string;

  @ApiProperty({
    description: 'Descrição do jogo',
    example: 'Grand Theft Auto V é um jogo de ação e aventura...',
  })
  description: string;

  @ApiProperty({
    description: 'Plataformas em que o jogo está disponível',
    example: ['PC', 'PlayStation 5', 'Xbox Series S/X'],
  })
  platforms: string[];

  @ApiProperty({
    description: 'Data de lançamento do jogo (YYYY-MM-DD)',
    example: '2013-09-17',
  })
  releaseDate: string;

  @ApiProperty({
    description: 'Avaliação média do jogo (0 a 5)',
    example: 4.47,
  })
  rating: number;

  @ApiProperty({
    description: 'URL da imagem de capa do jogo',
    example:
      'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612691.jpg',
  })
  coverImage: string;

  @ApiProperty({
    description: 'Dados de tempo de jogo do HowLongToBeat (se disponível)',
    example: {
      'Main Story': '31½ Hours',
      'Main + Extra': '48 Hours',
      Completionist: '80 Hours',
    },
    required: false,
  })
  howLongToBeatData?: any;

  @ApiProperty({ description: 'Data de criação do registro no banco' })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro no banco',
  })
  updatedAt: Date;
}




export class SearchGameDto {
  @ApiProperty({
    description: 'O título do jogo a ser pesquisado.',
    example: 'Cyberpunk 2077',
  })
  @IsNotEmpty()
  @IsString()
  title: string;
}
