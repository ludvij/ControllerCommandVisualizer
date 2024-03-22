let current_svgs = undefined

$('#platform_selection').on('change', (e) => {
	load_platform(e)
	clean()
})


for (const platform of config.platforms) {
	$('#platform_selection').append($('<option/>', {value : platform, text : platform}))
}

$(`option[value='${config.default_platform}']`).attr('selected', 'selected')

function load_platform(event) {
	
	const platform = event ? event.target.value: config.default_platform
	current_svgs = assets[platform]
	
}

