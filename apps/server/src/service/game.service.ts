import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from 'src/schema/game.schema';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name)
    private GameModel: Model<GameDocument>,
  ) {}
}
