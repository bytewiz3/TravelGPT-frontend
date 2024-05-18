import { defineStore } from 'pinia';

/**
 * 后端返回原始路由(未处理时)
 * @methods setCacheKeepAlive 设置接口原始路由数据
 */
export const useRequestOriginRoutes = defineStore('RequestOriginRoutes', {
	state: (): RequestOriginRoutesState => ({
		RequestOriginRoutes: [],
	}),
	actions: {
		async setRequestOriginRoutes(routes: Array<string>) {
			this.RequestOriginRoutes = routes;
		},
	},
});