let controllerIndex = null

let buttons_map = {}

function create_map() {
	let index_to_name = {
		0: 'A', 1: 'B', 2: 'X', 3: 'Y', 4: 'LB', 5: 'RB', 6: 'LT', 7: 'RT', 12: 'u', 13: 'd', 14: 'l', 15: 'r'
	}

	let name_to_index = Object.fromEntries(Object.entries(index_to_name).map(a => a.reverse()))

	buttons_map = {
		...index_to_name,
		...name_to_index,
	}
}

window.addEventListener('gamepadconnected', (e) => {
	handle_controller_conection(e, true)
})


window.addEventListener('gamepaddisconnected', (e) => {
	handle_controller_conection(e, false)
})


function handle_controller_conection(event, connected) {
	const gamepad = event.gamepad
	if (connected) {
		controllerIndex = gamepad.index
		
	} else {
		controllerIndex = null
	}
}


function handle_directions(directions) {
	
	if      ( directions.u &&  directions.l && !directions.r && !directions.d) $('.ul').append($('<img/>', {src: button_svgs.direction.arrow}))
	else if ( directions.u && !directions.l && !directions.r && !directions.d) $( '.u').append($('<img/>', {src: button_svgs.direction.arrow}))
	else if ( directions.u && !directions.l &&  directions.r && !directions.d) $('.ur').append($('<img/>', {src: button_svgs.direction.arrow}))
	else if (!directions.u &&  directions.l && !directions.r && !directions.d) $( '.l').append($('<img/>', {src: button_svgs.direction.arrow}))
	else if (!directions.u && !directions.l &&  directions.r && !directions.d) $( '.r').append($('<img/>', {src: button_svgs.direction.arrow}))
	else if (!directions.u &&  directions.l && !directions.r &&  directions.d) $('.dl').append($('<img/>', {src: button_svgs.direction.arrow}))
	else if (!directions.u && !directions.l && !directions.r &&  directions.d) $( '.d').append($('<img/>', {src: button_svgs.direction.arrow}))
	else if (!directions.u && !directions.l &&  directions.r &&  directions.d) $('.dr').append($('<img/>', {src: button_svgs.direction.arrow}))
}


/**
 * 
 * 
 */
function handle_axes(axes) {
	let x = axes[0]
	let y = axes[1]
	// might be too aggressive
	if (x < 0.05 && x > -0.05) x = 0
	if (y < 0.05 && y > -0.05) y = 0

	const directions = {
		u : y < -0.5,
		d : y > 0.5,
		l : x < -0.5,
		r : x > 0.5,
	}
	
	
	handle_directions(directions)
	
}


function handle_buttons(buttons) {
	// normal buttons
	for (let i = 0; i < 8; i++) {
		const value = buttons[i].value;
		if (value) {			
			$(`#controller_button_img_${buttons_map[i]}`).attr('src', current_svgs.selected[buttons_map[i]])
		}
	}
	const directions = {
		u : buttons[buttons_map.u].pressed,
		d : buttons[buttons_map.d].pressed,
		l : buttons[buttons_map.l].pressed,
		r : buttons[buttons_map.r].pressed,
	}
	
	handle_directions(directions)

}

function clean() {
	$('.direction').removeClass('selected')
	$('img').remove()
	$('.controller.button.A').append( $('<img/>', {src: current_svgs.unselected.A , id: 'controller_button_img_A'}))
	$('.controller.button.B').append( $('<img/>', {src: current_svgs.unselected.B , id: 'controller_button_img_B'}))
	$('.controller.button.X').append( $('<img/>', {src: current_svgs.unselected.X , id: 'controller_button_img_X'}))
	$('.controller.button.Y').append( $('<img/>', {src: current_svgs.unselected.Y , id: 'controller_button_img_Y'}))
	$('.controller.button.LT').append($('<img/>', {src: current_svgs.unselected.LT, id: 'controller_button_img_LT'}))
	$('.controller.button.RT').append($('<img/>', {src: current_svgs.unselected.RT, id: 'controller_button_img_RT'}))
	$('.controller.button.LB').append($('<img/>', {src: current_svgs.unselected.LB, id: 'controller_button_img_LB'}))
	$('.controller.button.RB').append($('<img/>', {src: current_svgs.unselected.RB, id: 'controller_button_img_RB'}))
}



function game_loop() {
	if (controllerIndex !== null) {
		clean()
		const gamepad = navigator.getGamepads()[controllerIndex]
		handle_buttons(gamepad.buttons)
		handle_axes(gamepad.axes)
	}
	requestAnimationFrame(game_loop)
}

requestAnimationFrame(game_loop)
create_map()