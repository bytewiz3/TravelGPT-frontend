<template>
	<el-container class="w-full h-full relative">
		<div class="absolute header-sty">
			<div class="flex justify-between">
				<div class="flex items-center">
					<h1 class="font28 font-bold text-white mr-28">explore ease</h1>
					<el-button
						round
						style="background: rgba(0, 1, 1, 0.1); color: #fff; border: none"
						class="cursor-pointer border-none"
					>
						<img class="w-5 mr-4" src="./imgs/Vector.png" alt="" />
						Chat
					</el-button>
				</div>

				<div class="flex items-center cursor-pointer">
					<el-button round style="background: transparent; color: #fff; border: 1px solid #fff">
						<img class="w-5 mr-4" src="./imgs/User.png" alt="" />
						Login
					</el-button>
				</div>
			</div>
		</div>
		<div class="w-1/2 h-full flex flex-col relative">
			<div class="mt-28">
				<el-button
					type="primary"
					link
					:icon="Plus"
					class="my-4 mx-20 primary-color px-5 py-3 btn-default"
					@click="handleBtn"
				>
					New chat
				</el-button>

				<el-button
					type="primary"
					link
					class="my-4 primary-color px-5 py-3 btn-default"
					@click="handleHistory"
				>
					<img class="w-5 mr-2" src="./imgs/time.png" alt="" />
					Chat History
				</el-button>
			</div>

			<!-- 历史记录 -->
			<div v-if="curTab === 2">
				<div class="flex flex-col px-5 mt-8 his-area" v-show="chatList.length">
					<div
						v-for="(item, index) in chatList"
						:key="index"
						:class="{ selected: curChatId === item.id }"
						style="height: 60px; line-height: 60px"
						class="flex flex-col mb-4 items-center cursor-pointer w-full"
						@click="hadnleAction(1, index, item)"
						@mouseover="handleMouseover(index)"
						@mouseleave="handleMouseleave(index)"
					>
						<div class="flex his-sty items-center justify-between cursor-pointer w-full">
							<div class="flex w-4/5 items-center h-full" style="height: 60px; light-height: 60px">
								<img src="./imgs/msg.png" alt="" class="w-4 h-3 mr-4" />
								<p
									v-if="!item.editStatus"
									class="ellipsis-1 font-bold"
									style="max-width: 85%; color: #4a4a4a"
								>
									{{ item.key }}
								</p>
								<el-input
									v-else
									v-model.trim="item.key"
									style="width: 85%"
									placeholder="Please input"
									@click.stop="inputClick"
									@change="handleEditKey"
								/>
								<img
									src="./imgs/Edit.png"
									alt=""
									class="w-5 h-5 ml-4 hidden"
									:class="`his-sty-${index}`"
									@click.stop="hadnleAction(3, index, item)"
								/>
							</div>

							<img
								src="./imgs/trash.png"
								alt=""
								class="w-5 h-5 hidden"
								:class="`his-sty-${index}2`"
								@click.stop="hadnleAction(2, index, item)"
							/>
						</div>
					</div>
				</div>

				<el-empty description="There are currently no chat records available" v-show="!chatList.length" />
			</div>

			<div v-if="curTab === 1">
				<!-- 聊天记录 -->
				<div
					class="cont-main talks-container scrollbar"
					id="ChatPanel"
					@scroll="talkPanelScroll($event)"
				>
					<div>
						<div v-for="(item, ind) in records" :key="item">
							<div
								class="message-box record-box"
								:class="{
									'direction-rt': item.float == 'right',
								}"
							>
								<div class="main-column">
									<div class="talk-title"></div>

									<div class="talk-content" v-if="item?.status !== 0">
										<!-- 文本消息 -->
										<TextMessage
											v-if="item?.type !== 2"
											:content="item.content"
											:full-width="false"
											:float="item.float"
											:arrow="true"
											:item="item"
											:isLast="ind === records.length - 1"
											:highlightedText="searchWords"
										/>
									</div>
									<div v-if="item?.status == 0">
										<span style="color: gray" class="font12 relative top-1">Typing ...</span>
									</div>
								</div>
							</div>
							<!-- <div v-if="ind === records.length - 1">
                <el-tag
                  v-for="item in tags"
                  :key="item.label"
                  type="primary"
                  effect="dark"
                  round
                  class="cursor-pointer ml-4"
                  style="background: rgba(92, 120, 158, 1)"
                  @click="handleTags(item)"
                >
                  {{ item.label }}
                </el-tag>
              </div> -->
						</div>
					</div>
				</div>

				<el-input
					v-model="keywords"
					style="width: calc(100% - 32px); position: absolute"
					class="mt-4 h-20 bottom-4 mx-auto ml-4"
					placeholder="Message Explore Ease to plan your trip..."
					@change="handleSend"
				>
					<template #suffix>
						<div
							class="rounded-full cursor-pointer p-4"
							style="background: rgba(190, 225, 231, 0.45)"
						>
							<img src="./imgs/Sent.png" class="w-5" />
						</div>
					</template>
				</el-input>
			</div>
		</div>

		<div class="w-1/2 h-full">
			<MapContainer />
		</div>
	</el-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, nextTick, onBeforeMount, provide, computed, onMounted, watch } from 'vue';
import TextMessage from '../../components/TextMessage.vue';
import { Local } from '/@/utils/storage.ts';
import chatApi from '/@/api/chat';
import {
	Search,
	Plus,
	Refresh,
	Bell,
	Loading,
	Promotion,
	Warning,
	Close,
} from '@element-plus/icons-vue';

let mapMsg = ref({});
let searchWords = ref();
provide(
	'handleMapMsg',
	computed(() => mapMsg.value)
);
let editInd = ref();
let keywords = ref();
let records = ref([]);
let curSessionId = ref('');
let tags = ref([
	{
		label: 'Details',
		text: 'Details DetailsDetailsDetailsDetails',
	},
	{
		label: 'Details',
		text: 'Details DetailsDetailsDetailsDetails',
	},
]);
provide(
	'records',
	computed(() => records.value)
);
let chatList = ref([]);
let curTab = ref(1);
let curChatId = ref(null);
// 开启一个新对话
function handleBtn() {
	curTab.value = 1;
	records.value = records.value?.filter((v) => v.status !== 0); // 過濾無效數據
	let old = Local.get('chatList') || [];
	if (records.value?.length) {
		// 更新已存在對象
		if (curChatId.value) {
			let ind = old.findIndex((v) => v.id === curChatId.value);
			if (ind > -1) old[ind].value = records.value;
			pubSetlocalList(old);
			records.value = [];
			chatList.value = Local.get('chatList') || [];
			curChatId.value = null;

			// 新增一個
			let val = [
				{
					key: 'New Chat',
					value: [],
					id: Date.now(),
					needTyped: false,
				},
				...old,
			];
			pubSetlocalList(val);
			records.value = [];
			chatList.value = Local.get('chatList') || [];
		} else {
			let val = [
				{
					key: records.value[0].content,
					value: records.value,
					id: Date.now(),
					needTyped: false,
				},
				...old,
			];
			pubSetlocalList(val);
			records.value = [];
			chatList.value = Local.get('chatList') || [];
		}
		curChatId.value = chatList.value?.[0]?.id;
	} else {
		// 新增一個
		let val = [
			{
				key: 'New Chat',
				value: [],
				id: Date.now(),
				needTyped: false,
			},
			...old,
		];
		pubSetlocalList(val);
		chatList.value = Local.get('chatList') || [];
		curChatId.value = val[0].id;
	}
}

watch(
	() => curChatId.value,
	(v) => {
		console.log('当前id：', curChatId.value);
	}
);

// 切换聊天历史tab
function handleHistory() {
	curTab.value = 2;
}

function handleNewChat() {}

function handleTags(item) {
	// TODO:
}

function hadnleAction(type, ind, item) {
	chatList.value = chatList.value.map((q) => ({
		...q,
		editStatus: false,
		needTyped: false,
	}));

	if (type === 1) {
		curTab.value = 1;
		curChatId.value = item.id;
		records.value = Local.get('chatList').find((v) => v.id === curChatId.value)?.value;
		nextTick(() => {
			talkPanelScrollBottom();
		});
	} else if (type === 2) {
		// 删除
		let newArr = chatList.value.filter((item, index) => index !== ind);
		pubSetlocalList(newArr);
		chatList.value = Local.get('chatList') || [];
		if (curChatId.value === item.id) {
			records.value = [];
			curChatId.value = null;
		}
    chatList.value = Local.get('chatList') || [];
	} else {
		// 編輯名稱
		chatList.value[ind].editStatus = true;
		editInd.value = ind;
		console.log(chatList.value);
	}
}

function handleSend(v) {
	keywords.value = v.trim();
	if (keywords.value) {
		let obj = {
			float: 'right',
			content: keywords.value,
			role: 'user',
			status: 1,
			// role:'assistant',
			index: records.value.length + 1,
		};

		records.value.push(obj);
		updateHis();
		// records.value.push({
		//   float: "left",
		//   role: "assistant",
		//   content: `我是临时会话asides 啊大叔我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔 我是临时会话asides 啊大叔  `,
		//   status: 1, // 等待回复中
		//   needTyped: true,
		// });
		// records.value.push({
		// 	float: 'left',
		// 	role: 'assistant',
		// 	status: 0, // 等待回复中
		// });
		// TODO:
		// getGPT(keywords.value);
		handleAddressListApi(keywords.value);
		handleChatApi(keywords.value);
		talkPanelScrollBottom();
		setTimeout(() => {
			keywords.value = '';
		}, 300);
	}
}

// 高德地址周边信息
async function handleAddressListApi(address_name) {
	try {
		const { msg } = await chatApi.circum_address_list({
			address_name,
		});
		// recommend 3:eat  0:play
		console.log(msg.pois);
		if (msg?.pois.length) {
			//   let typecode = msg?.pois.map((r) => r.typecode);
			let position = msg?.pois.map((r) => r.location);
			if (position) {
				// 绘制地图点位
				mapMsg.value = {
					type: 1,
					position,
				};
			}
		}
	} catch (error) {}
}

// 与gpt会话
async function handleChatApi(msg) {
	try {
		const data = await chatApi._chat({
			session_id: curSessionId.value,
			role: 'user',
			content: msg,
		});
		let str = data
			.replaceAll('}', '},')
			.replaceAll('data: {', '{')
			.replaceAll(`"message": "", "code": 0, `, '')
			.replaceAll(`"data": `, '');
		let newStr = str.substring(0, str.length - 1);
		// 使用正则表达式匹配所有引号内的内容
		const regex = /"([^"]*)"/g;
		const matches = newStr.match(regex);
		// 将匹配到的内容组成新的字符串
		const result = matches.map((match) => match.replace(/"/g, '')).join('');
		console.log('gpt回复：', result);

		records.value = records.value.filter((e) => e.status === 1);
		records.value.push({
			float: 'left',
			name: 'assi',
			status: 1,
			content: result.replace(/\\n/g, '\n'),
			needTyped: true,
		});
		updateHis();
		talkPanelScrollBottom();
	} catch (error) {}
	//   curSessionId.value =
}

function formateText(data) {
	const lines = data.split('\r\n\r\n');
	console.log(lines);
	// 初始化一个空数组来存储解析后的 JSON 对象
	const jsonDataArray = [];

	// 遍历每行数据，解析为 JSON 对象并存储在数组中
	lines.forEach((line) => {
		const jsonData = JSON.parse(line.replace('data: ', ''));
		jsonDataArray.push(jsonData);
	});

	// 提取每个 JSON 对象中的 data 字段值，并组成一句话
	const sentence = jsonDataArray.map((jsonData) => jsonData.data).join('');
	console.log(sentence);
	return sentence;
}

// 聊天窗口滚动到底部
function talkPanelScrollBottom() {
	nextTick(() => {
		let el = document.getElementById('ChatPanel');
		el && (el.scrollTop = el.scrollHeight);
	});
}

function talkPanelScroll(el) {
	// el.target.scrollTop = 0;
}

function updateHis() {
	let old = Local.get('chatList') || [];
	let ind = old.findIndex((v) => v.id === curChatId.value);
	if (curChatId.value && ind > -1) {
		old[ind].value = records.value;
		pubSetlocalList(old);
	}
}

function handleMouseover(index) {
	const hiddenElement = document.querySelector(`.his-sty-${index}`);
	const hiddenElement2 = document.querySelector(`.his-sty-${index}2`);
	hiddenElement.classList.remove('hidden');
	hiddenElement2.classList.remove('hidden');
}
function handleMouseleave(index) {
	const hiddenElement = document.querySelector(`.his-sty-${index}`);
	const hiddenElement2 = document.querySelector(`.his-sty-${index}2`);
	hiddenElement.classList.add('hidden');
	hiddenElement2.classList.add('hidden');
}
onBeforeMount(() => {
	let his = Local.get('chatList') || [];
	if (!his.length) {
		let id = Date.now();
		chatList.value = [
			{
				id,
				key: 'New Chat',
				value: [],
				editStatus: false,
				needTyped: false,
			},
		];
		// Local.set('chatList', chatList.value);
		pubSetlocalList(chatList.value);
		curChatId.value = id;
	} else {
		chatList.value = (Local.get('chatList') || []).map((res) => ({
			...res,
			editStatus: false,
			needTyped: false,
		}));
	}
});

function pubSetlocalList(v) {
	Local.set(
		'chatList',
		v.map((r) => ({ ...r, value: r.value.map((a) => ({ ...a, needTyped: false })) }))
	);
}

function inputClick() {}

function handleEditKey(v) {
	if (v && editInd.value !== null) {
		chatList.value[editInd.value].key = v;
		chatList.value[editInd.value].editStatus = false;
		// updateHis();
		// Local.set('chatList', chatList.value);
		pubSetlocalList(chatList.value);
		// editInd.value = null;
	}
}
// 创建新的会话
async function createNewChatApi() {
	try {
		const { data } = await chatApi._new_chat_pri({});
		curSessionId.value = data?.session_id;
		// console.log(curSessionId.value);
		records.value.push({
			...data?.messages?.[0],
			float: 'left',
			needTyped: true,
			status: 1,
			index: 1,
		});
		// console.log(records.value);
	} catch (error) {}
	//   curSessionId.value =
}
// 保存历史消息记录
async function saveChatHisApi() {
	try {
		const { data } = await chatApi._save_pri({});
		// console.log(data)
	} catch (error) {}
}

onMounted(() => {
	createNewChatApi();
	//   setTimeout(() => {
	//     mapMsg.value = {
	//       type: 1,
	//       data: [],
	//     };
	//   }, 2000);
});
</script>

<style lang="scss" scoped>
.primary-color {
	color: #3569b7 !important;
}
.cur-btn {
	border-radius: 72px;
	padding: 12px 20px 12px 20px !important;
	background: rgba(190, 225, 231, 0.44) !important;
}
.btn-default {
	border-radius: 72px;
	padding: 12px 20px 12px 20px !important;
	font-size: 16px;
}
.header-sty {
	width: calc(100% - 32px);
	height: 80px;
	top: 16px;
	left: 0;
	right: 0;
	margin: auto;
	padding: 20px 40px 20px 40px;
	gap: 400px;
	border-radius: 96px;
	background: linear-gradient(90deg, rgba(97, 138, 200, 0.6) 0%, rgba(117, 199, 204, 0.6) 100%);
	z-index: 4;
}

.selected {
	border-radius: 4px;
	background: rgba(217, 217, 217, 0.19);
	border-radius: 96px;
}

.his-area {
	/* max-height: calc(100% - 270px); */
	overflow: auto;
	.his-sty {
		padding: 0 40px;
		border-radius: 96px;
		&:hover {
			background: rgba(217, 217, 217, 0.19);
		}
	}
}

.cont-main {
	// background: pink;
	height: calc(100vh - 270px);
	width: 100%;
	padding: 20px;
	box-sizing: border-box;
	overflow-y: auto;
	position: relative;
	.message-box {
		width: 100%;
		min-height: 30px;
		margin-bottom: 5px;
	}

	.loading-toolbar {
		height: 30px;
		line-height: 30px;
		margin: 5px 0;
		text-align: center;
		user-select: none;
		font-size: 13px;
		color: #cec4c4;

		.color-blue {
			color: #409eff;
		}
	}

	.record-box {
		display: flex;
		flex-direction: row;
		transition: 0.5s ease;

		.checkbox-column {
			display: flex;
			justify-content: center;
			flex-basis: 40px;
			flex-shrink: 0;
			order: 1;
			user-select: none;
			padding-top: 25px;

			i {
				color: #ccc;
				cursor: pointer;
				font-size: 22px;
				&.selected {
					color: #409eff !important;
				}
			}
		}

		.avatar-column {
			width: 40px;
			flex-basis: 40px;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			order: 2;
			user-select: none;
			padding-top: 22px;
			flex-direction: column;
		}

		.main-column {
			flex: 1 auto;
			order: 3;
			position: relative;
			box-sizing: border-box;
			padding: 5px;
			overflow: hidden;

			.talk-title {
				display: flex;
				align-items: center;
				height: 15px;
				margin-bottom: 2px;
				font-size: 10px;
				color: #a7a0a0;
				opacity: 1;
				transition: 0.5s ease;
			}

			.talk-content {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				box-sizing: border-box;
				width: 100%;

				.nickname {
					font-size: 12px;
					color: #a7a0a0;
					margin: -4px 0 4px -8px;
					transform: scale(0.9);
				}
			}
		}

		&.direction-rt {
			.avatar-column {
				order: 3;
			}

			.main-column {
				order: 2;

				.talk-title {
					justify-content: flex-end;
				}

				.talk-content {
					align-items: flex-end;
				}
			}
		}

		&.checkbox-border {
			border: 1px dashed #c4c4ec;
			&:hover {
				border-color: #409eff;
			}
		}
	}
}

:deep(.el-input__wrapper) {
	padding: 0 20px;
	background: rgba(222, 229, 240, 0.48);
	border-radius: 96px;
}
</style>
