export const initYMap = () => {
	const map = new ymaps.Map('map', {
		center: [55.76, 37.64],
		//  0-19
		zoom: 16,
	})

	const placeMark = new ymaps.Placemark(
		[55.76, 37.64],
		{
			balloonContent: `
    
    <div class="map-modal">
      <div class="map-modal__text">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint illo eveniet
        cum nihil pariatur, explicabo repudiandae eligendi facilis tempora debitis
        repellendus optio aspernatur voluptate deserunt quam modi molestias alias
        quod?
      </div>
    </div>  

    `,
		},
		{
			iconLayout: 'default#image',
			iconImageHref: 'assets/img/marker.svg',
			iconImageSize: [64, 64],
			iconImageOffset: [-32, -64],
		}
	)

	// map.controls.remove('geolocationControl') убирает кнопку найти мое местоположение
	map.controls.remove('searchControl') // удаляет поиск
	map.controls.remove('trafficControl') // удаляет пробки
	map.controls.remove('typeSelector') // удаляет слои
	map.controls.remove('rulerControl') // удаляем линейку
	map.behaviors.disable(['scrollZoom']) // отключаем скролл мышкой
	map.controls.remove('searchControl')

	map.geoObjects.add(placeMark)
}

ymaps.ready(initYMap)
