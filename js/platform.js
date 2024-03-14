let button_svgs = undefined

let current_svgs = undefined
let current_platform = 'xbox'



async function load_platform() {
	const response = await fetch('js/assets.json')
	button_svgs = await response.json()
	switch (current_platform) {
		case 'xbox': current_svgs = button_svgs.xbox
			break
		case 'ps': current_svgs = button_svgs.ps
			break
	}

	clean()
}

load_platform()
