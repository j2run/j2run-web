import { defineStore } from 'pinia';
import { CloudDto } from '../dtos/cloud';
import { cloudService } from '../apis/cloud';
import { list2map } from '../utils/common';

export const useCloudStore = defineStore({
    id: 'cloud',
    state: () => ({
      list: [] as CloudDto[],
      listMap: {} as SMap<CloudDto>,
      cloudSelected: [] as string[],
      initialX: {} as { [key: string]: number },
      initialY: {} as { [key: string]: number },
    }),
    actions: {
      async loadAll(force = false) {
        if (!this.list?.length || force) {
          this.list = await cloudService.getAll();
          this.listMap = list2map(this.list, '_id');
        }
      },
      removeSelected(window: CloudDto) {
        this.cloudSelected = this.cloudSelected.filter(w => w != window._id);
      },
      moveTopSelected(window: CloudDto) {
        this.cloudSelected = [
          ...this.cloudSelected.filter(w => w != window._id),
          window._id,
        ];
      },
      addSelected(window: CloudDto) {
        if (this.cloudSelected.indexOf(window._id) > -1) {
          return;
        }
        this.initialX[window._id] = Math.round(Math.random() * 300 + 200);
        this.initialY[window._id] = Math.round(Math.random() * 300 + 100);
        this.cloudSelected.push(window._id);
      }
    }
});