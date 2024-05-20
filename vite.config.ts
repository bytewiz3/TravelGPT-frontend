import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import viteCompression from 'vite-plugin-compression';
import { viteSingleFile } from "vite-plugin-singlefile";
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { codeInspectorPlugin } from 'code-inspector-plugin'
// import topLevelAwait from 'vite-plugin-top-level-await'

const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'/@': pathResolve('./src/')
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	return {
		plugins: [vue(), vueSetupExtend(), viteCompression(),
		viteSingleFile(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
		// topLevelAwait({
		// 	promiseExportName: '__tla',
		// 	promiseImportName: (i) => `__tla_${i}`
		// }),
		//  DOM 源码定位功能插件
		codeInspectorPlugin({
			bundler: 'vite'
		})],

		root: process.cwd(),
		resolve: { alias },
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT as unknown as number,
			open: JSON.parse(env.VITE_OPEN),
			proxy: {
				// "/api": {
				// 	target: 'http://127.0.0.1:8089', // 代理的目标地址
				// 	changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:3000 代理服务会把origin修改为目标地址
				// 	// secure: true, // 是否https接口
				// 	// ws: true, // 是否代理websockets
				// 	rewrite: (path) => path.replace(/^\/api/, '') // 路径重写
				// }
			}
		}
	};
});

export default viteConfig;
