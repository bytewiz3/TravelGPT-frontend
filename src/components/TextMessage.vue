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


