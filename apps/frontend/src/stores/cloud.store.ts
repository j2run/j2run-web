import { defineStore } from 'pinia';
import { CloudDto } from '../dtos/cloud';
import { cloudService } from '../apis/cloud';

export const useCloudStore = defineStore({
    id: 'cloud',
    state: () => ({
      list: [] as CloudDto[],
    }),
    actions: {
      async loadAll(force = false) {
        if (!this.list?.length || force) {
          this.list = await cloudService.getAll();
        }
      },
    }
});