import { defineStore } from 'pinia';
import { planService } from '../apis/plan';
import { PlanDto } from '../dtos/plan';
import { list2map } from '../utils/common';

export const usePlanStore = defineStore({
    id: 'plan',
    state: () => ({
      master: [] as PlanDto[],
      masterMap: {} as SMap<PlanDto>
    }),
    actions: {
      async loadAll(force = false) {
        if (!this.master?.length || force) {
          this.master = await planService.getAll();
          this.masterMap = list2map(this.master, '_id');
        }
      },
    }
});