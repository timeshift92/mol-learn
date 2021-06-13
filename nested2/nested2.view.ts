namespace $.$$ {

	export type $my_nested_task2 = {
		id: string
		title: string,
		parent_id: string | null

	}



	export class $my_nested2 extends $.$my_nested2 {

		@$mol_mem
		list(next?: $my_nested_task2[]) {
			return next ?? [
				{ id: "1", title: "Menu one", parent_id: null },
				{ id: "11", title: "menu child one for one", parent_id: "1" },
				{ id: "12", title: "menu child two for one", parent_id: "1" },
				{ id: "2", title: "Menu two", parent_id: null },
				{ id: "21", title: "menu child one for two", parent_id: "2" },
				{ id: "22", title: "menu child two for two", parent_id: "2" }
			]
		}

		@$mol_mem_key
		task_data(parent_id: string | null, next?: $my_nested_task2) {
			if (next) {
				const updList = this.list().flatMap(tsk => {
					if (tsk.id == next.id) {
						tsk = next
					}
					return tsk
				});
				this.list(updList)
			}
			return  this.list().find(tsk => tsk.parent_id == parent_id)
		}
		root_rows() {
			return this.row_content(null)
		}

		@$mol_mem_key
		task_uri(task: $my_nested_task2) {
			return this.$.$mol_state_arg.make_link({
				... this.$.$mol_state_arg.dict(),
				'product': task.id,
			})
		}

		task_title(task: $my_nested_task2) {
			return task.title
		}

		@$mol_mem_key
		Task(task: $my_nested_task2) {
			return {
				id: task.id,
				title: task.title,
				parent_id: task.parent_id,
				toJSON: () => task.id,
			}
		}
		@$mol_mem_key
		row_content(task: $my_nested_task2 | null, next?: $my_nested_task2[]) {
			console.log(task)
			return next ?? this.list().filter(row => row.parent_id === (task ? task.id : null)).map(item => this.DropZone(item))
		}
		row_item(task: $my_nested_task2) {
			return this.Task_row(task)
		}


		transfer_adopt(transfer: DataTransfer) {

			const uri = transfer.getData("text/uri-list")
			if (!uri) return
			return this.list().find(task => this.task_uri(task) === uri)

		}



		receive_before(anchor: $my_nested_task2, task: $my_nested_task2) {

			if (anchor === task) return
			if (this.hasParent(anchor, task)) return

			const tasks = this.list().filter(p => p !== task)
			task.parent_id = anchor.parent_id
			const index = tasks.indexOf(anchor)
			tasks.splice(index, 0, task)

			this.list(tasks)

		}

		hasParent(anchor: $my_nested_task2, task: $my_nested_task2): boolean {

			const parent = this.list().find(tsk => tsk.id == anchor.parent_id)
			if (!parent) return false;
			if (parent.id == task.id) return true
			return this.hasParent(parent, task);

		}

		receive(anchor: $my_nested_task2, task: $my_nested_task2) {

			if (anchor.id === task.id) return
			if (this.hasParent(anchor, task)) return

			const tasks = this.list().filter(p => p !== task)
			task.parent_id = anchor.id;
			// this.list(tasks)
			this.task_data(task.parent_id, task)

			tasks.push(task)

			this.list(tasks)

		}






	}

}
