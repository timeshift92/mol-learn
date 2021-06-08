namespace $.$$ {

	export type $my_nested_task = {
		id: string
		title: string
	}

	export class $my_nested extends $.$my_nested {

		@ $mol_mem
		task_list( next? : $my_nested_task[] ) {
			return next ?? [ ... $mol_range2( index => this.Task( String( index + 1 ) ) , ()=> this.task_count() ) ]
		}

		@ $mol_mem_key
		Task( id : string ) {
			return {
				id : id ,
				title : `Task #${ id }` ,
				toJSON : ()=> id ,
			}
		}

		task_rows() {
			return this.task_list().map( task => this.Task_row( task ) )
		}

		task_title( task : $my_nested_task ) {
			return task.title
		}

		@ $mol_mem_key
		task_uri( task : $my_nested_task ) {
			return this.$.$mol_state_arg.make_link({
				... this.$.$mol_state_arg.dict() ,
				'product' : task.id ,
			})
		}

		transfer_adopt( transfer : DataTransfer ) {

			const uri = transfer.getData( "text/uri-list" )
			if( !uri ) return

			return this.task_list().find( task => this.task_uri( task ) === uri )

		}

		receive_before( anchor : $my_nested_task , task : $my_nested_task ) {

			if( anchor === task ) return
			
			const tasks = this.task_list().filter( p => p !== task )
			
			const index = tasks.indexOf( anchor )
			tasks.splice( index , 0 , task )
			
			this.task_list( tasks )

		}

		receive( task : $my_nested_task ) {
			debugger
			
			const tasks = this.task_list().filter( p => p !== task )
			tasks.push( task )
			
			this.task_list( tasks )

		}

		receive_trash( task : $my_nested_task ) {
			this.task_list( this.task_list().filter( p => p !== task ) )
		}

	}

}
