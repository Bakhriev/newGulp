// core version + navigation, pagination modules:
import Swiper from 'swiper'
import {Navigation, Pagination, Scrollbar, Autoplay} from 'swiper/modules'
// import Swiper and modules styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const swiper = new Swiper('.swiper-1', {
	direction: 'horizontal',
	spaceBetween: 20,

	breakpoints: {
		320: {
			slidesPerView: 1,
		},
		768: {
			slidesPerView: 2,
		},
		1200: {
			slidesPerView: 3,
		},
	},

	// Modules
	modules: [Navigation, Pagination, Autoplay],

	// If we need pagination
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},

	// Navigation arrows
	navigation: {
		nextEl: '.custom-next',
		prevEl: '.custom-prev',
	},

	// And if we need scrollbar
	scrollbar: {
		el: '.swiper-scrollbar',
	},
})
