import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';
import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder('game')
      .where('game.title ilike :param', {
        param: `%${param}%`,
      })
      .getMany();
    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT COUNT(*) FROM games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const repositoryUser = getRepository(User);
    const users = await repositoryUser
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.games', 'game')
      .where('game.id = :id', { id })
      .getMany();

    return users;
  }
}
