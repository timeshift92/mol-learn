namespace $.$$ {
	export interface DragObject {
		elem?: HTMLElement,
		avatar?: HTMLElement | undefined
		downX?: number
		downY?: number
		shiftX?: number
		shiftY?: number
	}
	export class DragManager extends $mol_object {

		/**
		 * составной объект для хранения информации о переносе:
		 * {
		 *   elem - элемент, на котором была зажата мышь
		 *   avatar - аватар
		 *   downX/downY - координаты, на которых был mousedown
		 *   shiftX/shiftY - относительный сдвиг курсора от угла элемента
		 * }
		 */
		dragObject: DragObject = {};

		static init() {
			const self = new DragManager();
			self.dragObject = {}
			document.onmousemove = (ev: MouseEvent) => self.onMouseMove(ev);
			document.onmouseup = (ev: MouseEvent) => self.onMouseUp(ev);
			document.onmousedown = (ev: MouseEvent) => { self.onMouseDown(ev) };
			return self;
		}

		onDragEnd = (dragObject: DragObject, dropElem: HTMLElement): void => { };
		onDragCancel = (dragObject: DragObject): void => { };


		onMouseDown(e: MouseEvent) {
			if (e.which != 1) return;
			let elem = (e.target as HTMLElement).closest('.draggable') as HTMLElement;
			if (!elem) return;
			if (!this.dragObject) {
				this.dragObject = {}
			}

			this.dragObject.elem = elem;

			// запомним, что элемент нажат на текущих координатах pageX/pageY
			this.dragObject.downX = e.pageX;
			this.dragObject.downY = e.pageY;

			return false;
		}

		onMouseMove(e: MouseEvent) {
			if (!this.dragObject) return; // элемент не зажат
			if (!this.dragObject.avatar && this.dragObject.downX && this.dragObject.downY) { // если перенос не начат...

				var moveX = e.pageX - this.dragObject.downX;
				var moveY = e.pageY - this.dragObject.downY;

				// если мышь передвинулась в нажатом состоянии недостаточно далеко
				if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
					return;
				}

				// начинаем перенос
				if (!this.dragObject.avatar) {
					this.dragObject.avatar = this.createAvatar(e); // создать аватар
					if (!this.dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
						this.dragObject = {};
						return;
					}
				}


				// аватар создан успешно
				// создать вспомогательные свойства shiftX/shiftY
				if (this.dragObject.avatar) {
					var coords = this.getCoords(this.dragObject.avatar);

					this.dragObject.shiftX = this.dragObject.downX - coords.left;
					this.dragObject.shiftY = this.dragObject.downY - coords.top;
				}


				this.startDrag(e); // отобразить начало переноса
			}

			// отобразить перенос объекта при каждом движении мыши
			if (this.dragObject.avatar && this.dragObject.shiftX && this.dragObject.shiftY) {
				this.dragObject.avatar.style.left = e.pageX - this.dragObject.shiftX + 'px';
				this.dragObject.avatar.style.top = e.pageY - this.dragObject.shiftY + 'px';
			}


			return false;
		}

		onMouseUp(e: MouseEvent) {
			if (this.dragObject.avatar) { // если перенос идет
				this.finishDrag(e);
			}

			// перенос либо не начинался, либо завершился
			// в любом случае очистим "состояние переноса" dragObject
			this.dragObject = {};
		}

		finishDrag(e: MouseEvent) {
			var dropElem = this.findDroppable(e);
			if (!dropElem) {
				this.onDragCancel(this.dragObject);
			} else {
				this.onDragEnd(this.dragObject, dropElem);
			}
		}

		createAvatar(e: MouseEvent): HTMLElement | undefined {


			// запомнить старые свойства, чтобы вернуться к ним при отмене переноса
			var avatar = this.dragObject.elem;
			if (avatar) {

				avatar.ondragstart = function () {
					return false;
				};

				let old = {
					parent: avatar.parentNode,
					nextSibling: avatar.nextSibling,
					position: avatar['position'] || '',
					left: avatar['left'] || '',
					top: avatar['top'] || '',
					zIndex: avatar['zIndex'] || ''
				};

				// функция для отмены переноса

				avatar['rollback'] = () => {
					if (avatar && old.parent) {
						old.parent.insertBefore(avatar, old.nextSibling);
						avatar.style.position = old.position;
						avatar.style.left = old.left;
						avatar.style.top = old.top;
						avatar.style.zIndex = old.zIndex
					}

				};

				return avatar;
			}
		}

		startDrag(e: MouseEvent) {
			let avatar = this.dragObject.avatar;
			if (avatar) {
				// инициировать начало переноса
				document.body.appendChild(avatar);
				avatar.style.zIndex = "9999";
				avatar.style.position = 'absolute';
			}

		}

		findDroppable(event: MouseEvent): HTMLElement | null {
			if (!this.dragObject) return null;
			if (!this.dragObject.avatar) return null;
			// спрячем переносимый элемент
			this.dragObject.avatar.hidden = true;
			this.dragObject.avatar.style.display = 'none';
			
			// получить самый вложенный элемент под курсором мыши
			var elem = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;

			// показать переносимый элемент обратно
			this.dragObject.avatar.hidden = false;
			this.dragObject.avatar.style.display = 'initial';

			if (elem == null) {
				// такое возможно, если курсор мыши "вылетел" за границу окна
				return null;
			}
			
			return elem.closest('.droppable');
		}


		getCoords(elem: HTMLElement) { // кроме IE8-
			var box = elem.getBoundingClientRect();

			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			};

		}
	};


}
