let controllerIndex = null

let buttons_map = {}

let last_input = undefined

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


function handle_directions(gamepad) {


	const directions_pad = {
		u: gamepad.buttons[buttons_map.u].pressed,
		d: gamepad.buttons[buttons_map.d].pressed,
		l: gamepad.buttons[buttons_map.l].pressed,
		r: gamepad.buttons[buttons_map.r].pressed,
	}

	let x = gamepad.axes[0]
	let y = gamepad.axes[1]
	// might be too aggressive
	if (x < 0.05 && x > -0.05) x = 0
	if (y < 0.05 && y > -0.05) y = 0

	const directions_stick = {
		u: y < -0.5,
		d: y > 0.5,
		l: x < -0.5,
		r: x > 0.5,
	}

	const directions = Object.values(directions_pad).some(x => x) ? directions_pad : directions_stick
	let direction = undefined

	if (directions.u && directions.l && !directions.r && !directions.d) {
		direction = 'ul'
		$('#controller_direction_img_ul').attr({src: assets.direction.arrow})
	}
	else if (directions.u && !directions.l && !directions.r && !directions.d) {
		direction = 'u'
		$('#controller_direction_img_u').attr({src: assets.direction.arrow})
	}
	else if (directions.u && !directions.l && directions.r && !directions.d) {
		direction = 'ur'
		$('#controller_direction_img_ur').attr({src: assets.direction.arrow})
	}
	else if (!directions.u && directions.l && !directions.r && !directions.d) {
		direction = 'l'
		$('#controller_direction_img_l').attr({src: assets.direction.arrow})
	}
	else if (!directions.u && !directions.l && directions.r && !directions.d) {
		direction = 'r'
		$('#controller_direction_img_r').attr({src: assets.direction.arrow})
	}
	else if (!directions.u && directions.l && !directions.r && directions.d) {
		direction = 'dl'
		$('#controller_direction_img_dl').attr({src: assets.direction.arrow})
	}
	else if (!directions.u && !directions.l && !directions.r && directions.d) {
		direction = 'd'
		$('#controller_direction_img_d').attr({src: assets.direction.arrow})
	}
	else if (!directions.u && !directions.l && directions.r && directions.d) {
		direction = 'dr'
		$('#controller_direction_img_dr').attr({src: assets.direction.arrow})
	}

	return direction
}





function handle_buttons(buttons) {
	// normal buttons
	let buttons_pressed = []
	for (let i = 0; i < 8; i++) {
		const value = buttons[i].value;
		if (value) {
			
			buttons_pressed.push(buttons_map[i])
			$(`#controller_button_${buttons_map[i]}`).attr('src', current_svgs.selected[buttons_map[i]])
		}
	}

	return buttons_pressed
}

function clean() {
	$('.direction_img').removeClass('selected').removeAttr('src', '')
	$('#controller_button_A').attr('src',  current_svgs.unselected.A)
	$('#controller_button_B').attr('src',  current_svgs.unselected.B)
	$('#controller_button_X').attr('src',  current_svgs.unselected.X)
	$('#controller_button_Y').attr('src',  current_svgs.unselected.Y)
	$('#controller_button_LT').attr('src', current_svgs.unselected.LT)
	$('#controller_button_RT').attr('src', current_svgs.unselected.RT)
	$('#controller_button_LB').attr('src', current_svgs.unselected.LB)
	$('#controller_button_RB').attr('src', current_svgs.unselected.RB)
}


function are_they_equal(o1, o2) {
	return o1 && o2
		&& o1.direction === o2.direction
		&& o1.buttons.length === o2.buttons.length
		&& o1.buttons.every((o, i) => o === o2.buttons[i])
}

function submit_command(direction, buttons) {
	
	const timer = $('#commands>div>p').last().attr('data-time')*1+1
	$('#commands>div>p').last().attr('data-time', timer)
	if (timer > 60) {
		$('#commands>div>p').last().text('60+')
	}
	else {
		$('#commands>div>p').last().text(timer)
	}

	let current_input = {
		direction: direction,
		buttons: buttons
	}

	if (are_they_equal(current_input, last_input)) 
		return
	const direction_img = $('<img/>')
	if (direction) {
		direction_img.attr('src', assets.direction.arrow)
		direction_img.addClass(direction)
	}
	else {
		direction_img.attr('src', assets.direction.empty)
	}
	const buttons_div = $('<div/>', {class: 'command_buttons'})
	for(const b of buttons) {
		buttons_div.append($('<img/>', {src : current_svgs.selected[b], class: `command_buttons_${b}`}))
	}
	$('#commands')
		.append($('<div/>', {class: 'command_row'})
			.append(direction_img)
			.append(buttons_div)
			.append($('<p/>', {'data-time' : 1}).text(1)))

	while ($('#commands>div').length > config.history_size) {
		$('#commands>div').first().remove()
	}
	last_input = current_input
}



async function game_loop() {
	clean()
	if (controllerIndex !== null) {
		const gamepad = navigator.getGamepads()[controllerIndex]
		const buttons = handle_buttons(gamepad.buttons)
		const directions = handle_directions(gamepad)
		
		submit_command(directions, buttons)
	}
	requestAnimationFrame(game_loop)
}


function start() {
	load_platform()
	create_map()
	requestAnimationFrame(game_loop)
}

start()