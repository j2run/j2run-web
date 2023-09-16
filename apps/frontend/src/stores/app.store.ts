import { defineStore } from 'pinia';
import { IBreadcrumbsItem } from '../dtos/app';


export const usePageStore = defineStore({
    id: 'app',
    state: () => ({
      isPageLoading: false,
      breadcrumbs: [] as IBreadcrumbsItem[],
    }),
    actions: {
      showPageLoading() {
        this.isPageLoading = true;
      },
      hidePageLoading() {
        this.isPageLoading = false;
      },
      setBreadcrumbs(breadcrumbs: IBreadcrumbsItem[]) {
        this.breadcrumbs = breadcrumbs;
      }
    }
});