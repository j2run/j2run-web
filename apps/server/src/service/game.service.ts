import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from 'src/schema/game.schema';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {
    // this.gameModel.create({
    //   name: 'Nso Plus',
    //   dockerLabelIds: [new Types.ObjectId('64b2b8d5c5643969901cc8bc')],
    //   image: 'wawahuy/j2_microemulator:lasted',
    //   diskPath: '/data/game/nso-plus.jar',
    // });
  }
}
