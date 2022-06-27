# Skillbus CRM

CRM для работы с контактной информацией студентов оффлайн-курсов Skillbus.

Для запуска необходимо выполнить команду `node index`, находясь в директории crm-backend.

## Превью

![Превью](https://drive.google.com/uc?export=view&id=1S9Z0hNeXwT2vEnAKrJMsnD5A7YFISZ_s)

## Функционал

- **Сортировка.** 
На все заголовки колонок, кроме контактов и действий, можно нажать, чтобы установить сортировку по соответствующему полю. Первое нажатие устанавливает сортировку по возрастанию, повторное - по убыванию. 
- **Поиск с автодополнением.**
При вводе список найденных элементов будет отображаться под строкой поиска. При выборе элемента из списка происходит скролл к соответствующему контакту в таблице и выделение этого контакта. 
- **Действия.**
Доступно добавление, удаление, изменения данных пользователя. По нажатию на соответсвующие кнопки высплывает модальное окно, в котором можно работать с данными клиента.

**Библиотеки и плагины:**
- Валидация формы - [Pristine](https://github.com/sha256/Pristine).
- Туллтипы - [Microtip](https://github.com/ghosh/microtip).
- Кастомный селект - [Nice Select](https://github.com/bluzky/nice-select2).
- Маска телефона - [Inputmask](https://github.com/RobinHerbots/Inputmask).
