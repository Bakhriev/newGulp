export const selectInit = () => {
	document.addEventListener('click', e => {
		let currentSelect
		if (e.target.closest('[data-select]')) {
			currentSelect = e.target.closest('[data-select]')
			const items = currentSelect.querySelectorAll('.select-menu__item')
			items.forEach(item => {
				item.addEventListener('click', () => {
					currentSelect.querySelector('[data-selected]').textContent =
						item.textContent
				})
			})
			currentSelect.classList.toggle('active')
		}

		document.querySelectorAll('[data-select].active').forEach(select => {
			if (select === currentSelect) return
			select.classList.remove('active')
		})
	})
}
