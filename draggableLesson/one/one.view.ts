namespace $.$$ {
	export class $my_draggableLesson_one extends $.$my_draggableLesson_one {

		down(event: MouseEvent) {
			const ball: HTMLElement = this.Ball().dom_node() as HTMLElement;
			function getCoords(elem: HTMLElement) {   // кроме IE8-
				var box = elem.getBoundingClientRect();
				return {
					top: box.top + pageYOffset,
					left: box.left + pageXOffset
				};
			}

			var coords = getCoords(ball);
			var shiftX = event.pageX - coords.left;
			var shiftY = event.pageY - coords.top;
			ball.style.position = 'absolute';
			document.body.appendChild(ball);

			function moveAt(e: MouseEvent) {
				ball.style.left = e.pageX - shiftX + 'px';
				ball.style.top = e.pageY - shiftY + 'px';
			}

			moveAt(event);

			ball.style.zIndex = "1000";

			document.onmousemove = function (event: MouseEvent) {
				moveAt(event);
			}

			ball.onmouseup = function () {
				document.onmousemove = null;
				ball.onmouseup = null;
			}

			ball.ondragstart = function () {
				return false;
			};
		}







	}
}
