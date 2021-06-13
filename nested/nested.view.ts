namespace $.$$ {

	export type $my_nested_task = {
		id: string
		title: string,
		parent_id: string | null

	}
	const list: $my_nested_task[] = [
		{ id: "1", title: "Menu one", parent_id: null },
		{ id: "11", title: "menu child one for one", parent_id: "1" },
		{ id: "12", title: "menu child two for one", parent_id: "1" },
		{ id: "2", title: "Menu two", parent_id: null },
		{ id: "21", title: "menu child one for two", parent_id: "2" },
		{ id: "22", title: "menu child two for two", parent_id: "2" }


	]


	export class $my_nested extends $.$my_nested {

		@$mol_mem
		task_list(next?: $my_nested_task[]) {
			return next ?? [...list.map(task => this.Task(task))]
		}

		@$mol_mem_key
		Task(task: $my_nested_task) {
			return {
				id: task.id,
				title: task.title,
				parent_id: task.parent_id,
				toJSON: () => task.id,
			}
		}
		drop_lists() {
			return [this.List(null)]
		}
		List_drop(id?: any) {
			const obj = new this.$.$mol_drop()

			obj.adopt = (transfer?: any) => this.transfer_adopt(transfer)
			obj.receive = (obj?: any) => this.receive(this.task_list().filter(tk => tk.id == id)[0], obj)
			obj.Sub = () => this.Scroll(id)

			return obj
		}

		@$mol_mem_key
		task_rows(id: number) {
			return this.task_list().filter(tk => tk.parent_id == id).map((task, index) => {
				const wrap = this.Task_wrap(index, task)

				wrap.sub = () => {
					return [
						this.Task_row(task),
						this.List_drop(task.id)
					]
				}
				return wrap
			})
		}
		child_tasks(task: $my_nested_task) {
			return this.task_list().filter(child => child.parent_id == task.id).map((child, index) => {
				const wrap = this.Task_wrap(index, child)
				wrap.sub = () => {
					return [
						this.Task_row(task),
						this.Task_list(task.id)
					]
				}
				return wrap
			})
		}

		task_title(task: $my_nested_task) {
			return task.title
		}

		@$mol_mem_key
		task_uri(task: $my_nested_task) {
			return this.$.$mol_state_arg.make_link({
				... this.$.$mol_state_arg.dict(),
				'product': task.id,
			})
		}

		transfer_adopt(transfer: DataTransfer) {

			const uri = transfer.getData("text/uri-list")
			if (!uri) return
			return this.task_list().find(task => this.task_uri(task) === uri)
			// return this.findrec(this.task_list(), uri)

		}



		receive_before(anchor: $my_nested_task, task: $my_nested_task) {

			if (anchor === task) return

			const tasks = this.task_list().filter(p => p !== task)
			task.parent_id = anchor.parent_id
			const index = tasks.indexOf(anchor)
			tasks.splice(index, 0, task)

			this.task_list(tasks)

		}

		receive(anchor: $my_nested_task, task: $my_nested_task) {

			if (anchor === task) return
			if (task.id === anchor.parent_id) return
			const tasks = this.task_list().filter(p => p !== task)
			task.parent_id = anchor.id;
			tasks.push(task)

			this.task_list(tasks)

		}

		receive_trash(task: $my_nested_task) {
			this.task_list(this.task_list().filter(p => p !== task))
		}

	}

}
