## Использование Gulp 4 Usage of Gulp 4

## Начало работы Getting Started

Для запуска проекта установите зависимости с помощью npm или yarn: <br>
To start the project, install the dependencies using npm or yarn:

npm install <br>
npm run dev

или <br> or

yarn <br>
yarn dev

## SVG спрайт SVG Sprite

SVG-иконки могут быть объединены в спрайт и находиться в папке src/assets/img/svg. При сборке проекта спрайт будет конвертирован в файл dist/assets/img/svg/sprite.svg.

Для доступа к иконке используйте ее ID, который соответствует названию файла иконки. Например, если иконка называется arrow.svg, ее ID будет sprite.svg#arrow. По умолчанию из иконок удаляются атрибуты fill и stroke для удобства стилизации.

SVG icons can be combined into a sprite and stored in the src/assets/img/svg folder. During the project build, the sprite will be converted into the dist/assets/img/svg/sprite.svg file.

To access an icon, use its ID, which corresponds to the icon file name. For example, if the icon is named arrow.svg, its ID will be sprite.svg#arrow. By default, the fill and stroke attributes are removed from the icons for styling convenience.

Here's an example of how to use an SVG icon from the sprite:

<svg>
    <use xlink:href="assets/img/svg/sprite.svg#arrow"></use>
</svg>
