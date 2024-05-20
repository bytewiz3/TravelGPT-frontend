<template>
	<div
		class="text-message"
		:class="{
			left: float == 'left',
			right: float == 'right',
			'max-width': !fullWidth,
		}"
	>
		<div class="btns flex justify-end" v-if="float === 'left'">
			<div v-for="ite in 4" :key="ite" class="cursor-pointer shake mr-2" @click="handleClick(ite)">
				<img :src="`./src/views/chat/imgs/icon${ite}.png`" alt="" />
			</div>
		</div>
		<pre v-html="typedText" ref="typedOutput" />
	</div>
</template>


<script setup>
import { onMounted, ref, computed, watch, inject } from 'vue';
import { Local } from '/@/utils/storage.ts';
import Typed from 'typed.js';
import { ElMessage } from 'element-plus';

const props = defineProps({
	content: {
		type: [String, Number],
		default: '',
	},
	// 需要高亮的词
	highlightedText: {
		type: [String],
		default: '',
	},
	float: {
		type: String,
		default: 'left',
	},
	fullWidth: {
		type: Boolean,
		default: true,
	},
	arrow: {
		type: Boolean,
		default: false,
	},
	item: {
		type: Object,
		default: () => ({}),
	},
});
let emits = defineEmits(['sendAgain']);
let html = ref('');
let records = inject('records', []);
let curChatId = inject('curChatId', null);

// 重新发送
function sendAgain() {
	emits('sendAgain');
}

let typed = ref(null);
let typedText = ref('');
let typedOutput = ref();

onMounted(() => {
	const text = textReplaceLink(
		props.content,
		props.float == 'right' ? '#ffffff' : 'rgb(9 149 208)'
	);

	props.float === 'left' && props?.item?.needTyped
		? initializeTyped(text)
		: (typedText.value = text);
});

// 打印机效果处理
function initializeTyped(text) {
	typedText.value = text;
	typed.value = new Typed(typedOutput.value, {
		strings: [typedText.value],
		typeSpeed: 5,
		backSpeed: 30,
		loop: false,
	});
}
let textArr = ref([]);

watch(
	() => typedText.value,
	(v) => {
		if (props.float == 'left' && props?.item?.needTyped) {
			typed.value.strings = [v];
		}
	}
);

function textReplaceLink(text, color = 'rgb(9,149,208)') {
	let str = '';
	let exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
	if (props.highlightedText && text.includes(props.highlightedText)) {
		str = text.replace(
			new RegExp(props.highlightedText, 'g'),
			(match) => `<span class="highlight">${match}</span>`
		);
	} else {
		str = text.replace(
			exp,
			`<a href='$1' target="_blank" style="color:${color};text-decoration: revert;">$1</a >`
		);
	}

	return str;
}

function handleClick(ind) {
	console.log(ind);
	switch (ind) {
		case 3:
			copyText(props?.item?.content)
			break;
	
		default:
			break;
	}
}

// 复制文本
function copyText(text, message = 'Copied to clipboard') {
	let input = document.createElement('input');
	input.value = text;
	document.body.appendChild(input);
	input.select();
	document.execCommand('copy');
	document.body.removeChild(input);
	ElMessage({
		message,
		grouping: true,
		type: 'success',
		duration: 1000,
	});
}
</script>


<style lang="scss" scoped>
.text-message {
	position: relative;
	min-width: 30px;
	min-height: 30px;
	border-radius: 5px;
	padding: 15px;

	&_status {
		position: absolute;
		top: 10px;
		left: -20px;
		color: #909399;
		.send-sty {
			margin-top: 4px;
			cursor: pointer;
		}
	}

	&.max-width {
		max-width: calc(100% - 50px);
	}

	&.left {
		// color: rgba(77, 77, 77, 1);
		background: rgba(190, 225, 231, 0.3);
		border-radius: 0 20px 20px 20px;
	}

	&.right {
		color: #ffffff;
		background: rgba(92, 120, 158, 1);
		border-radius: 20px 0 20px 20px;
	}

	pre {
		white-space: pre-wrap;
		overflow: hidden;
		word-break: break-word;
		word-wrap: break-word;
		font-size: 14px;
		padding: 3px 10px;
		font-family: 'Microsoft YaHei';
		line-height: 25px;
	}
}
.live-room-sty {
	.chat-item-gift,
	.chat-item-text {
		display: flex;
		align-items: center;
	}
	.level {
		display: inline;
		width: 36px;
		height: 24px;
	}
	.nickname {
		margin-right: 4px;
		font-size: 16px;
		color: var(--secondary-color);
	}
	.user-enter {
		font-size: 16px;
	}
	.convention-msg {
		color: #ff453a;
	}
	.gift-count {
		font-size: 16px;
		color: #f6b700;
		&::before {
			content: 'x';
			color: #f6b700;
			font-size: 14px;
		}
	}
}
:deep(pre img) {
	display: initial;
}
.live-vip {
	width: 16px;
	height: 16px;
	margin-right: 8px;
}
.vip-enter-sty {
	display: flex;
	align-items: center;
	margin-bottom: 4px;
	padding: 0 10px;
	background: linear-gradient(99.72deg, #dcafff 7.31%, #ff8cad 92.69%);
	border-radius: 20px;
	span {
		color: #fff73e;
	}
}
.chat-text {
	img {
		max-width: none;
		display: inline;
	}
}
:deep(.highlight) {
	background-color: yellow;
}
:deep(.highlight2) {
	color: rgb(246, 112, 199);
}
:deep(a) {
	color: rgb(9, 149, 208) !important;
}
:deep(.typed-cursor--blink) {
	display: none;
}
:deep(.typed-cursor) {
	display: none;
}
.btns {
}
</style>



