import { defineStore } from 'pinia';
import { CloudActionDto } from '../dtos/cloud-action';
import { cloudActionService } from '../apis/cloud-action';

export const useCloudActionStore = defineStore({
    id: 'cloud-action',
    state: () => ({
      master: [] as CloudActionDto[],
      masterLength: 0,
      masterMap: {} as SMap<CloudActionDto[]>,
    }),
    actions: {
      async loadAll() {
        this.master = await cloudActionService.list();
        this.masterLength = this.master.length;
        this.masterMap = this.master.reduce<SMap<CloudActionDto[]>>((val, item) => {
          const id = item.dockerContainerId;
          if (!val[id]) {
            val[id] = [];
          }
          val[id].push(item);
          return val;
        }, {});
      },
    }
});