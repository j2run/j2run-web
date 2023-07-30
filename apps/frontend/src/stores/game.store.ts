import { defineStore } from 'pinia';
import { GameDto } from '../dtos/game';
import { gameService } from '../apis/game';

export const useGameStore = defineStore({
    id: 'game',
    state: () => ({
      master: [] as GameDto[],
      masterMap: {} as { [key: string]: GameDto }
    }),
    actions: {
      async loadAll(force = false) {
        if (!this.master?.length || force) {
          this.master = await gameService.getAll();
          this.masterMap = this.master.reduce<{ [key: string]: GameDto }>((val, item) => {
            val[item._id] = item;
            return val;
          }, {})
        }
      },
    }
});