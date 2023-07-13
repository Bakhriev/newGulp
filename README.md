Используется Gulp 4

## Начало работы

Для запуска проекта установите зависимости с помощью npm или yarn

npm install -> npm run dev

OR!

yarn -> yarn dev
для dev версии

svg в виде спрайта, src/assets/img/svg сюда кладите svg, например arrow.svg и оно конвертируется
dist/assets/img/svg/sprite.svg
доступ можно получить к нему вот так,

id у svg иконки берется из его названия, arrow.svg будет sprite.svg#arrow ниже есть пример
по умолчанию у них удалены fill stroke цвета для удобства стилизования

Добавил !!!!!! yarn build билд версию

<!--
<svg>
    <use xlink:href="assets/img/svg/sprite.svg#arrow"></use>
</svg>
 -->
