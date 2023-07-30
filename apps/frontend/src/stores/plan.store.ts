import { defineStore } from 'pinia';
import { planService } from '../apis/plan';
import { PlanDto } from '../dtos/plan';

export const usePlanStore = defineStore({
    id: 'plan',
    state: () => ({
      master: [] as PlanDto[],
      masterMap: {} as { [key: string]: PlanDto }
    }),
    actions: {
      async loadAll(force = false) {
        if (!this.master?.length || force) {
          this.master = await planService.getAll();
          this.masterMap = this.master.reduce<{ [key: string]: PlanDto }>((val, item) => {
            val[item._id] = item;
            return val;
          }, {});
        }
      },
    }
});