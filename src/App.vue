<template>
	<div class="contentArea">
		<div class="message">{{ msg }}</div>
		<pig-latin></pig-latin>
	</div>
</template>

<script>
	import { map } from 'lodash';
	import PigLatin from './PigLatin.vue'

	export default {
		data () {
			return {
				msg: 'Hello from vue-loader!',
				message: 'Type here, pig latin below.'
			}
		},
		components: {
			PigLatin
		},
	}
</script>

<style>
	.message {
		color: blue;
	}
</style>