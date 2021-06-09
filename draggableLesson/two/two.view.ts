namespace $.$$ {

	const urls = [
		{
			name: "Chrome",
			uri: "my/draggableLesson/two/images/chrome.svg",
		},
		{
			name: "Firefox",
			uri: "my/draggableLesson/two/images/firefox.svg",
		},
		{
			name: "Ie",
			uri: "my/draggableLesson/two/images/ie.svg",
		},
		{
			name: "Opera",
			uri: "my/draggableLesson/two/images/opera.svg",
		},
		{
			name: "Safari",
			uri: "my/draggableLesson/two/images/safari.svg",
		}
	]

	export class $my_draggableLesson_two extends $.$my_draggableLesson_two {

		draggable_items() {
			return urls.map((item) => {
				const it = this.Draggable_item(item.name);
				it.uri = () => item.uri;
				return it;
			})
		}

		render() {
			const manager = this.$.DragManager.init();
			manager.onDragCancel = function (dragObject: any) {
				dragObject.avatar.rollback();
			};

			manager.onDragEnd = function (dragObject: any, dropElem: HTMLElement) {
				dragObject.elem.style.display = 'none';
				const drp = document.querySelector('.droppable');
				if (drp) {
					drp.classList.add('computer--smile');
					setTimeout(function () {
						drp.classList.remove('computer--smile');
					}, 200);
				}

			};
			return super.render()
		}

	}
}
