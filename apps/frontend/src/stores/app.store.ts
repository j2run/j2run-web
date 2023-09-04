import { defineStore } from 'pinia';


export const usePageStore = defineStore({
    id: 'app',
    state: () => ({
      isPageLoading: false
    }),
    actions: {
      showPageLoading() {
        this.isPageLoading = true;
      },
      hidePageLoading() {
        this.isPageLoading = false;
      }
    }
});