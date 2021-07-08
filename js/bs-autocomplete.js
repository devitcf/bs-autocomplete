Vue.component('bs-autocomplete', {
		inheritAttrs: false,
		delimiters: ['{{', '}}'],
		name: 'bs-autocomplete',
		template: `
            <div style="position: relative" ref="outer_div">
                <select :class="select_class" @click.stop.prevent="toggle_list" v-bind="$attrs" @keydown.38="press_up" @keydown.40="press_down" @keypress.enter.stop.prevent="press_enter">
                	<option style="display:none" v-if="selected_item" selected>
                		<slot name="display_text" v-bind="{item:selected_item}">{{ get_item_text(selected_item) }}</slot>
                	</option>
				</select>
	            <div class="bs-autocomplete" v-if="show">
	            	<div class="bs-autocomplete-items">
	            		<div class="p-2">
	            			<input type="text" :class="input_class" v-model="search_value" ref="search_input" :placeholder="placeholder" @keyup.27="toggle_list('hide')" @keydown.38="press_up" @keydown.40="press_down" @keypress.enter.stop.prevent="press_enter" @input="active_index = null">
						</div>
			            <div class="list-group list-group-flush bs-autocomplete-list" :style="{'--bs-autocomplete-max-height': get_max_height()}">
			                <a v-for="item, index in result_list" class="list-group-item list-group-item-action" :class="{'active': (index == active_index && !item.disable), 'disabled': (item.disable)}" style="cursor: pointer; padding-top: 5px; padding-bottom: 5px;" @click="select(item)">
                				<slot name="option_text" v-bind="{item}">{{ get_item_text(item) }}</slot>
			                </a>
						</div>
					</div>
				</div>
			</div>
`,
		data() {
			return {
				selected_item: null,
				search_value: '',
				show: false,
				active_index: null,
				item_labels: new Map(),
				click_outside_callback: (event) => {
					if (event.path.includes(this.$refs.outer_div)) {
						return;
					}
					return this.toggle_list('hide')}
			};
		},
		watch: {
			show: async function (new_value) {
				if (new_value === true) {
					document.body.addEventListener('click', this.click_outside_callback);
					await this.scroll_to_active();
					this.$refs.search_input.focus();
				}
				if (new_value === false) {
					document.body.removeEventListener('click', this.click_outside_callback);
				}
			},
			active_index: async function (new_value) {
				if (new_value) {
					await this.scroll_to_active();
				}
			},
			value: async function (new_value) {
				this.sync_selected_item(new_value);
			},
		},
		model: {
			prop: 'value',
			event: 'input',
		},
		props: {
			value: [String, Object],
			select_class: {
				type: String,
				default: 'custom-select'
			},
			input_class: {
				type: String,
				default: 'form-control'
			},
			placeholder: {
				type: String,
				default: '',
			},
			items: {
				type: Array,
				default: () => []
			},
			item_text: {
				type: [String, Function],
				default: 'text',
			},
			return_attr: {
				required: true,
				type: String,
			},
			return_obj: {
				type: Boolean,
				default: false,
			},
			max_height: {
				type: [String, Number],
				default: '300px'
			}
		},
		mounted() {
			this.sync_selected_item(this.value);
		},
		computed: {
			result_list() {
				return this.items.filter(e => {
					if (this.search_value === '') {
						return true;
					}
					return this.item_labels.get(e).toLowerCase().includes(this.search_value.toLowerCase());
				});
			},
		},
		methods: {
			sync_selected_item(value) {
				this.selected_item = this.items.find(e => {
					let item = this.return_attr == null ? e : e[this.return_attr];

					if(this.return_obj) {
						return e[this.return_attr] === value[this.return_attr];
					}
					return item === value;
				});
			},
			get_item_text(item) {
				let label = this.item_text instanceof Function ? this.item_text(item) : item[this.item_text];
				this.item_labels.set(item, label);
				return label;
			},
			get_max_height() {
				return this.max_height + (this.max_height.toString().toLowerCase().includes('px') ? '' : 'px');
			},
			clear_input() {
				this.search_value = '';
			},
			toggle_list(mode = 'toggle') {
				this.clear_input();
				this.show = mode === 'show' ? true : (mode === 'hide' ? false : !this.show);
			},
			async scroll_to_active() {
				await this.$nextTick();
				let el = this.$refs.outer_div.querySelectorAll('.list-group-item')[this.active_index];
				if (el) {
					el.scrollIntoView({block: "end"});
				}
			},
			press_down(e) {
				if (!this.show) {
					this.toggle_list('show');
				}
				if (this.active_index == null) {
					return this.active_index = 0;
				}
				if (this.active_index < this.result_list.length - 1) {
					this.active_index++;
				}
			},
			press_up(e) {
				if (!this.show) {
					this.toggle_list('show');
				}
				if (this.active_index == null) {
					return this.active_index = 0;
				}
				if (this.active_index > 0) {
					this.active_index--;
				}
			},
			press_enter() {
				if (!this.show) {
					this.toggle_list('show');
				} else {
					return this.select(this.result_list[this.active_index]);
				}
			},
			select(item) {
				if (item.disable) {
					return ;
				}
				this.selected_item = item;
				this.active_index = this.items.indexOf(item);
				this.toggle_list('hide');
				let return_value = this.return_obj ? item : item[this.return_attr];
				this.$emit('input', return_value);
			},
		},
	}
);
