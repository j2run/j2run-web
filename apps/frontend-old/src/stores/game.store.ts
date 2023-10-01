import { defineStore } from 'pinia';
import { GameDto } from '../dtos/game';
import { gameService } from '../apis/game';
import { list2map } from '../utils/common';

export const useGameStore = defineStore({
    id: 'game',
    state: () => ({
      master: [] as GameDto[],
      masterMap: {} as SMap<GameDto>,
    }),
    actions: {
      async loadAll(force = false) {
        if (!this.master?.length || force) {
          this.master = await gameService.getAll();
          this.masterMap = list2map(this.master, '_id');
        }
      },
    }
});