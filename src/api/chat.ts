import request from '/@/utils/request';

const chatApi = {
	// 登录
	_login: (data: object) => {
		return request({
			url: '/api/v1/user/_login',
			method: 'post',
			data,
		});
	},
	// 用户注册
	_register: (data: object) => {
		return request({
			url: '/api/v1/user/_register',
			method: 'post',
			data,
		});
	},
	// 创建新的会话
	_new_chat_pri: (data: object) => {
		return request({
			url: '/api/v1/chat/_new_chat_pri',
			method: 'post',
			data,
		});
	},
	// 高德地址导航
	address_list: (data: object) => {
		return request({
			url: '/api/v1/address/address_list',
			method: 'post',
			data,
		});
	},
	// 高德地址周边信息
	circum_address_list: (data: object) => {
		return request({
			url: '/api/v1/address/circum_address_list',
			method: 'post',
			data,
		});
	},
	// 进行会话
	_chat: (data: object) => {
		return request({
			url: '/api/v1/chat/_chat',
			method: 'post',
			data,
		});
	},
	// 保存会话历史
	_save: (data: object) => {
		return request({
			url: '/api/v1/chat/_save',
			method: 'post',
			data,
		});
	},
	// 用户会话历史
	history: (data: object) => {
		return request({
			url: '/api/v1/chat/history/list',
			method: 'post',
			data,
		});
	},
	// 删除会话历史
	_delete_history: (data: object) => {
		return request({
			url: '/api/v1/chat/_delete_history',
			method: 'post',
			data,
		});
	},
	// 会话模板列表
	prompt: (data: object) => {
		return request({
			url: '/api/v1/chat/prompt/list',
			method: 'post',
			data,
		});
	},
	// 新增会话模板
	_add: (data: object) => {
		return request({
			url: '/api/v1/chat/prompt/_add',
			method: 'post',
			data,
		});
	},
	// 删除会话模板
	_delete: (data: object) => {
		return request({
			url: '/api/v1/chat/prompt/_delete',
			method: 'post',
			data,
		});
	},
}

export default chatApi