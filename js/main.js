const initialArray = [
  {
    name: "Василий",
    surname: "Пупкин",
    lastName: "Васильевич",
    contacts: [{ type: "Телефон", value: "+71234567890" },
    { type: "Email", value: "abc@xyz.com" },
    {
      type: "Facebook", value: "https://facebook.com/vasiliy-pupkin-the-best",
    },],
  },
  {
    name: "Джон",
    surname: "Леннон",
    contacts: [{ type: "Телефон", value: "+79217869154" },
    { type: "Email", value: "allyouneed@islove.com" },
    { type: "Twitter", value: "@liveandletdie" },],
  },
  {
    name: "Гурбангулы",
    surname: "Бердымухамедов",
    lastName: "Мяликгулыевич",
    contacts: [{ type: "Телефон", value: "+79046523108" },
    { type: "Vk", value: "id201757016" },
    { type: "Twitter", value: "@berdymuhamedov" },
    { type: "Email", value: "office@turkmenembassy.ru" },
    { type: "Instagram", value: "@gmberdimuhamedow" },
    { type: "TikTok", value: "@gmberdimuhamedow" },
    { type: "Snapchat", value: "gberdimuhamedoff" },
    { type: "Discord", value: "gurbanguly#9087" },
    { type: "OnlyFans", value: "@turkboynextdoor" },
    { type: "Steam", value: "steamcommunity.com/id/yourturkenemy" },],
  },
];

// ---Функции для работы с сервером---

const modalDelete = document.querySelector(".modal-delete");
const modalChange = document.querySelector(".modal-change");
const modalAdd = document.querySelector(".modal-add");
// const activeModal = document.querySelector(".modal--is-active");
const modalCloseBtns = document.querySelectorAll(".modal__close-btn");

let clientsArrayData;
async function getClientsData() {
  const response = await fetch("http://localhost:3000/api/clients");
  const data = await response.json();
  clientsArrayData = data;
}

// async function addNewClient(client) {
//   fetch('http://localhost:3000/api/clients', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(client),
//   })
// }

let responseAdd;
async function addClientData() {
  const contactWrappers = modalAdd.querySelectorAll(
    ".add-contact__field-wrapper"
  );
  let contactsArray = [];
  contactWrappers.forEach((wrapper) => {
    let newContact = {};
    newContact.type = wrapper.querySelector(".current").textContent;
    newContact.value = wrapper.querySelector("input").value;
    contactsArray.push(newContact);
  });
  responseAdd = await fetch(`http://localhost:3000/api/clients`, {
    method: "POST",
    body: JSON.stringify({
      name: modalAdd.querySelector('[name = "name"]').value,
      surname: modalAdd.querySelector('[name = "surname"]').value,
      lastName: modalAdd.querySelector('[name = "middle-name"]').value,
      contacts: contactsArray,
    }),
    headers: { "Content-Type": "application/json" },
  });
}

async function deleteClientData() {
  await fetch(
    `http://localhost:3000/api/clients/${document
      .querySelector('[data-delete= "delete"]')
      .querySelector(".content-row__cell--id").textContent
    }`,
    {
      method: "DELETE",
    }
  );
}

let responseChange;
async function saveChanges() {
  const contactWrappers = modalChange.querySelectorAll(
    ".add-contact__field-wrapper"
  );
  let contactsArray = [];
  contactWrappers.forEach((wrapper) => {
    let newContact = {};
    newContact.type = wrapper.querySelector(".current").textContent;
    newContact.value = wrapper.querySelector("input").value;
    contactsArray.push(newContact);
  });
  responseChange = await fetch(
    `http://localhost:3000/api/clients/${document
      .querySelector(".modal__client-id")
      .textContent.slice(4, 100)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        name: modalChange.querySelector('[name = "name"]').value,
        surname: modalChange.querySelector('[name = "surname"]').value,
        lastName: modalChange.querySelector('[name = "middle-name"]').value,
        contacts: contactsArray,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );
}

// ---Вспомогательные функции---

function clearTable() {
  const tableRows = document.querySelectorAll(".table__content-row");
  if (tableRows) {
    tableRows.forEach((row) => row.remove());
  }
}

function clearModal() {
  document.querySelector(".modal--is-active").querySelectorAll("input").forEach((input) => (input.value = null));
  document.querySelector(".modal--is-active").querySelectorAll('.d-block').forEach((message) => message.classList.remove('d-block'));
  document.querySelector(".modal--is-active")
    .querySelectorAll(".contact-wrapper")
    .forEach((contact) => contact.remove());
}

function checkContactsAmount(modal) {
  if (
    modal.querySelectorAll(".add-contact__field-wrapper").length === 10
  ) {
    modal
      .querySelector(".add-contact__btn")
      .classList.add("btn-disabled");
    modal
      .querySelector(".add-contact__btn")
      .setAttribute("disabled", "disabled");
  }
}

function removeDeleteFlag() {
  if (document.querySelector('[data-delete= "delete"]')) {
    document
      .querySelector('[data-delete= "delete"]')
      .removeAttribute("data-delete");
  }
}

function getFilteredArray() {
  filteredArray = [];
  document.querySelectorAll(".content-row__cell--id").forEach((cell) => {
    clientsArrayData.forEach((client) => {
      if (client.id == cell.textContent) {
        filteredArray.push(client);
      }
    });
  });
}

function inputListener() {
  this.value ? this.closest('.wrapper').children[0].classList.remove('d-block')
    : this.closest('.wrapper').children[0].classList.add('d-block');
}

function validateForm(modal) {
  if (!modal.querySelector('[name="surname"]').value) {
    modal.querySelector('[name="surname"]').closest('.wrapper').children[0].classList.add('d-block');
  }
  modal.querySelector('[name="surname"]').addEventListener('input', inputListener);

  if (!modal.querySelector('[name="name"]').value) {
    modal.querySelector('[name="name"]').closest('.wrapper').children[0].classList.add('d-block');
  }
  modal.querySelector('[name="name"]').addEventListener('input', inputListener);

  const allContacts = modal.querySelectorAll('.add-contact__input');
  allContacts.forEach((input) => {
    if (!input.value) {
      input.closest('.wrapper').children[0].classList.add('d-block');
    }
    input.addEventListener('input', inputListener);
  })

  if (modal.querySelectorAll('.d-block').length) {
    return false
  } else {
    return true
  }
}

// ---Функции отрисовки---

let contactSelect;
let customSelect;
let contactInput;

function createAddContactField(modal) {
  const contactsWrapper = modal.querySelector(".form__contacts-wrapper");
  const contactFieldsWrapper = document.createElement("div");
  contactFieldsWrapper.classList.add("add-contact__field-wrapper", "flex");
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper', "contact-wrapper");
  const contactErrorMessage = document.createElement('div');
  contactErrorMessage.classList.add("contact-error-message");
  contactErrorMessage.textContent = 'Это поле не может быть пустым';

  contactSelect = document.createElement("select");
  contactSelect.classList.add("add-contact__select");
  contactSelect.innerHTML = `<option value="Телефон" selected>Телефон</option>
  <option value="Email">Email</option>
  <option value="Facebook">Facebook</option>
  <option value="Vk">Vk</option>
  <option value="Другое">Другое</option>`;

  contactInput = document.createElement("input");
  contactInput.classList.add("add-contact__input", "to-validate");
  contactInput.setAttribute("type", "tel");

  contactSelect.addEventListener("change", (ev) => {
    if (ev.target.value === "Телефон") {
      contactInput.setAttribute("type", "tel");
    } else if (ev.target.value === "Email") {
      contactInput.setAttribute("type", "email");
    } else {
      contactInput.setAttribute("type", "text");
    }
  });

  const contactDeleteBtn = document.createElement("button");
  contactDeleteBtn.classList.add("add-contact__delete-btn", "btn-reset");
  contactDeleteBtn.setAttribute("type", "button");
  contactDeleteBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"
  fill="#B0B0B0" /></svg>`;

  contactFieldsWrapper.append(contactSelect, contactInput, contactDeleteBtn);
  wrapper.append(contactErrorMessage, contactFieldsWrapper);
  contactsWrapper.append(wrapper);
  contactDeleteBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    contactFieldsWrapper.remove();
  });
  customSelect = NiceSelect.bind(contactSelect);
}

function createTableRow(client) {
  const tbody = document.querySelector(".tbody");
  const tr = document.createElement("tr");
  tr.classList.add("table__content-row", "content-row");
  tbody.append(tr);

  for (let i = 0; i < 6; ++i) {
    let td = document.createElement("td");
    td.classList.add("content-row__cell");

    if (i === 0) {
      td.classList.add("content-row__cell--id");
      td.textContent = client.id;
    }

    if (i === 1) {
      td.classList.add("content-row__cell--name");
      td.textContent = `${client.surname} ${client.name} ${client.lastName}`;
    }

    if (i === 2) {
      td.classList.add("content-row__cell--create-time");
      const span1 = document.createElement("span");
      span1.textContent = `${client.createdAt.slice(8, 10)}
      .${client.createdAt.slice(5, 7)}
      .${client.createdAt.slice(0, 4)} `;
      const span2 = document.createElement("span");
      span2.textContent = client.createdAt.slice(11, 16);
      span1.append(span2);
      td.append(span1);
    }

    if (i === 3) {
      td.classList.add("content-row__cell--change-time");
      const span1 = document.createElement("span");
      span1.textContent = `${client.updatedAt.slice(8, 10)}
      .${client.updatedAt.slice(5, 7)}
      .${client.updatedAt.slice(0, 4)} `;
      const span2 = document.createElement("span");
      span2.textContent = client.updatedAt.slice(11, 16);
      span1.append(span2);
      td.append(span1);
    }

    if (i === 4) {
      td.classList.add("content-row__cell--contacts", "contacts");
      if (client.contacts) {
        for (let n = 0; n < client.contacts.length; ++n) {
          const btn = document.createElement("button");
          btn.classList.add("contacts__icon", "btn-reset");
          btn.setAttribute("data-microtip-position", "top");
          btn.setAttribute("role", "tooltip");
          btn.setAttribute(
            "aria-label",
            `${client.contacts[n].type}: ${client.contacts[n].value}`
          );

          if (client.contacts[n].type === "Телефон") {
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg"> <g opacity="0.7">
              <circle cx="8" cy="8" r="8" fill="#9873FF" />
              <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white" /></g></svg>`;
          } else if (client.contacts[n].type === "Email") {
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd"
              d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF" /> </svg>`;
          } else if (client.contacts[n].type === "Vk") {
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g opacity="0.7">
              <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF" /> </g> </svg>`;
          } else if (client.contacts[n].type === "Facebook") {
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg"> <g opacity="0.7">
              <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF" /> </g> </svg>`;
          } else {
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd"
              d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF" /> </svg>`;
          }
          td.append(btn);
        }
      }
    }

    if (i === 5) {
      td.classList.add("content-row__cell--actions", "actions");
      const btnChacnge = document.createElement("button");
      btnChacnge.classList.add("actions__btn", "btn-reset");
      btnChacnge.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g opacity="0.7">
        <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873FF" /> </g> </svg> <span>Изменить</span>`;

      btnChacnge.addEventListener("click", () => {
        modalChange.classList.add("modal--is-active");
        modalChange.querySelector('.server-error-message').textContent = null;
        modalChange
          .querySelector(".add-contact__btn")
          .classList.remove("btn-disabled");
        modalChange
          .querySelector(".add-contact__btn")
          .removeAttribute("disabled");
        tr.setAttribute("data-delete", "delete");
        modalChange.querySelector(
          ".modal__client-id"
        ).textContent = `ID: ${client.id}`;
        modalChange.querySelector('[name = "surname"]').value = client.surname;
        modalChange.querySelector('[name = "name"]').value = client.name;
        modalChange.querySelector('[name = "middle-name"]').value =
          client.lastName;
        modalChange
          .querySelectorAll(".add-contact__field-wrapper")
          .forEach((item) => item.remove());
        if (client.contacts) {
          client.contacts.forEach((contact) => {
            createAddContactField(modalChange);
            contactInput.value = contact.value;
            contactSelect
              .querySelectorAll("option")
              .forEach((option) => option.removeAttribute("selected"));
            if (contactSelect.querySelector(`[value = "${contact.type}"]`)) {
              contactSelect
                .querySelector(`[value = "${contact.type}"]`)
                .setAttribute("selected", "true");
            } else {
              contactSelect
                .querySelector('[value = "Другое"]')
                .setAttribute("selected", "true");
            }
            customSelect.update();
          });
        }
        checkContactsAmount(modalChange);
      });

      const btnDelete = document.createElement("button");
      btnDelete.classList.add("actions__btn", "btn-reset");
      btnDelete.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7">
      <path
        d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z"
        fill="#F06A4D" /></g></svg><span>Удалить</span>`;
      btnDelete.addEventListener("click", () => {
        modalDelete.classList.add("modal--is-active");
        tr.setAttribute("data-delete", "delete");
      });
      td.append(btnChacnge, btnDelete);
    }
    tr.append(td);
  }
}

// ---Функции сортировки---

const sortIdBtn = document.querySelector(".sort-btn--id");
const sortNameBtn = document.querySelector(".sort-btn--name");
const sortCreateBtn = document.querySelector(".sort-btn--create");
const sortChangeBtn = document.querySelector(".sort-btn--change");
const allSortBtns = document.querySelectorAll(".sort-btn");
let sortedArray;
let flags = {
  idSortedUpwards: true,
  nameSortedUpwards: false,
  createSortedUpwards: false,
  changeSortedUpwards: false,
};

function sortUpwards(element, param, flag) {
  allSortBtns.forEach((btn) => btn.classList.remove("sort-btn--active"));
  element.classList.add("sort-btn--active");
  element.querySelector(".table-head__arrow").classList.add("sorted-upwards");
  flags[flag] = true;
  getFilteredArray();
  sortedArray = filteredArray.sort((a, b) => (a[param] > b[param] ? 1 : -1));
  clearTable();
  sortedArray.forEach((client) => createTableRow(client));
}

function sortDownwards(element, param, flag) {
  allSortBtns.forEach((btn) => btn.classList.remove("sort-btn--active"));
  element.classList.add("sort-btn--active");
  element
    .querySelector(".table-head__arrow")
    .classList.remove("sorted-upwards");
  flags[flag] = false;
  getFilteredArray();
  sortedArray = filteredArray.sort((a, b) => (a[param] < b[param] ? 1 : -1));
  clearTable();
  sortedArray.forEach((client) => createTableRow(client));
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  // await initialArray.forEach((client) => addNewClient(client));
  const preloader = document.querySelector('.table__preloader');

  await getClientsData();

  clearTable();
  // getFilteredArray();

  // Вывод отсортированной по возрастанию id таблицы при первоначальной загрузке
  let sortedByIdArray = clientsArrayData.sort((a, b) => (a.id > b.id ? 1 : -1));
  sortedByIdArray.forEach((client) => createTableRow(client));

  preloader.style.display = 'none';

  // ---Модальные окна---
  // Закрытие по клику на кнопку

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".modal--is-active").querySelectorAll('.to-validate').forEach(function (input) {
        input.removeEventListener('input', inputListener);
      })
      // console.log(document.querySelector(".modal--is-active"));
      clearModal();
      document.querySelector(".modal--is-active").classList.remove("modal--is-active");
      removeDeleteFlag();
    });
  });

  // Закрытие по клику на оверлей
  document.querySelectorAll(".modal").forEach((modal) =>
    modal.addEventListener("click", (ev) => {
      if (!ev.target.closest(".modal__content")) {
        clearModal();
        document.querySelector(".modal--is-active").classList.remove("modal--is-active");
        removeDeleteFlag();
      }
    })
  );


  // ---"Изменить данные"---
  modalChange
    .querySelector(".modal__form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      if (validateForm(modalChange)) {
        await saveChanges();
        if (responseChange.status.toString().slice(0, 1) !== '2') {
          modalChange.querySelector('.server-error-message').textContent = responseChange.statusText;
        } else {
          modalChange.classList.remove("modal--is-active");
          clearTable();
          await getClientsData();
          clientsArrayData.forEach((client) => createTableRow(client));
        }
      }
    });

  modalChange
    .querySelector(".form__delete-btn")
    .addEventListener("click", () => {
      modalDelete.classList.add("modal--is-active");
    });

  modalChange
    .querySelector(".add-contact__btn")
    .addEventListener("click", () => {
      createAddContactField(modalChange);
      checkContactsAmount(modalChange);
    });


  // ---"Добавить клиента"---
  document.querySelector(".main__btn").addEventListener("click", () => {
    modalAdd.classList.add("modal--is-active");
    modalAdd.querySelector('.server-error-message').textContent = null;
  });

  modalAdd
    .querySelector(".modal__form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      if (validateForm(modalAdd)) {
        await addClientData();
        if (responseAdd.status.toString().slice(0, 1) !== '2') {
          modalAdd.querySelector('.server-error-message').textContent = responseAdd.statusText;
        } else {
          clearModal(modalAdd);
          modalAdd.classList.remove("modal--is-active");
          clearTable();
          await getClientsData();
          clientsArrayData.forEach((client) => createTableRow(client));
        }
      }
    });

  modalAdd
    .querySelector(".form__reset-btn")
    .addEventListener("click", () =>
      modalAdd.classList.remove("modal--is-active")
    );

  modalAdd.querySelector(".add-contact__btn").addEventListener("click", () => {
    createAddContactField(modalAdd);
    checkContactsAmount(modalAdd);
  });

  // ---"Удалить клиента"---
  modalDelete
    .querySelector(".modal-delete__delete-btn")
    .addEventListener("click", async () => {
      await deleteClientData();
      modalDelete.classList.remove("modal--is-active");
      modalChange.classList.remove("modal--is-active");
      clearTable();
      await getClientsData();
      clientsArrayData.forEach((client) => createTableRow(client));
    });

  document
    .querySelector(".modal-delete__cancel-btn")
    .addEventListener("click", () => {
      modalDelete.classList.remove("modal--is-active");
      removeDeleteFlag();
    });


  // Устанавливаем ширину блока с анимацией загрузки по ширине таблицы
  preloader.style.width = `${document.querySelector('.table').offsetWidth}px`;

  window.addEventListener('resize', () => {
    preloader.style.width = `${document.querySelector('.table').offsetWidth}px`;
  })


  // ---Сортировка---

  sortIdBtn.addEventListener("click", () => {
    flags.idSortedUpwards
      ? sortDownwards(sortIdBtn, "id", "idSortedUpwards")
      : sortUpwards(sortIdBtn, "id", "idSortedUpwards");
  });

  sortNameBtn.addEventListener("click", () => {
    flags.nameSortedUpwards
      ? sortDownwards(sortNameBtn, "surname + name + lastName", "nameSortedUpwards")
      : sortUpwards(sortNameBtn, "surname + name + lastName", "nameSortedUpwards");
  });

  sortCreateBtn.addEventListener("click", () => {
    flags.createSortedUpwards
      ? sortDownwards(sortCreateBtn, "createdAt", "createSortedUpwards")
      : sortUpwards(sortCreateBtn, "createdAt", "createSortedUpwards");
  });

  sortChangeBtn.addEventListener("click", () => {
    flags.changeSortedUpwards
      ? sortDownwards(sortChangeBtn, "updatedAt", "changeSortedUpwards")
      : sortUpwards(sortChangeBtn, "updatedAt", "changeSortedUpwards");
  });


  // const allNames = []
  let allNames = [];
  async function getAllNames() {
    const response = await fetch("http://localhost:3000/api/clients");
    const clients = await response.json();
    clients.forEach((client) => {
      let clientName = `${client.surname} ${client.name} ${client.lastName}`;
      allNames.push(clientName);
    })
  }
  // ---Поиск---
  getAllNames();

  function autocomplete(inp, arr) {
    /* функция автозаполнения принимает два аргумента,
    элемент текстового поля и массив возможных значений автозаполнения: */
    let currentFocus;
    /* выполнение функции, когда кто-то пишет в текстовом поле: */
    inp.addEventListener("input", function () {
      let autocompleteList, nameOption, val = this.value;
      /* закрыть все уже открытые списки значений автозаполнения */
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      /* создайте элемент DIV, который будет содержать элементы (значения): */
      autocompleteList = document.createElement("DIV");
      autocompleteList.setAttribute("id", this.id + "autocomplete-list");
      autocompleteList.classList.add('autocomplete-items');
      /* добавьте элемент DIV в качестве дочернего элемента контейнера автозаполнения: */
      this.parentNode.appendChild(autocompleteList);
      /* для каждого элемента в массиве... */
      for (let i = 0; i < arr.length; i++) {
        /* проверьте, включает ли элемент те же буквы, что и значение текстового поля: */
        if (arr[i].toUpperCase().includes(val.toUpperCase())) {
          /* создайте элемент DIV для каждого соответствующего элемента: */
          nameOption = document.createElement("div");
          nameOption.innerHTML = arr[i];
          nameOption.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          nameOption.addEventListener("click", function () {
            /* вставьте значение для текстового поля автозаполнения: */
            inp.value = this.getElementsByTagName("input")[0].value;
            /* закройте список значений автозаполнения,
            (или любые другие открытые списки значений автозаполнения : */
            closeAllLists();
          });
          autocompleteList.appendChild(nameOption);
        }
      }
    });
    /* выполнение функции нажимает клавишу на клавиатуре: */
    inp.addEventListener("keydown", function (e) {
      let autocompleteItems = document.getElementById(this.id + "autocomplete-list");
      if (autocompleteItems) autocompleteItems = autocompleteItems.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /* Если нажата клавиша со стрелкой вниз,
        увеличение текущей переменной фокуса: */
        currentFocus++;
        /* и сделать текущий элемент более видимым: */
        addActive(autocompleteItems);
      } else if (e.keyCode == 38) { //вверх
        /* Если нажата клавиша со стрелкой вверх,
        уменьшите текущую переменную фокуса: */
        currentFocus--;
        /* и сделать текущий элемент более видимым: */
        addActive(autocompleteItems);
      } else if (e.keyCode == 13) {
        /* Если нажата клавиша ENTER, предотвратите отправку формы, */
        if (currentFocus > -1) {
          /* и имитировать щелчок по элементу "active": */
          if (autocompleteItems) autocompleteItems[currentFocus].click();
        }
      }
    });

    function addActive(items) {
      /* функция для классификации элемента как "active": */
      if (!items) return false;
      /* начните с удаления "активного" класса для всех элементов: */
      for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("autocomplete-active");
      }
      if (currentFocus >= items.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (items.length - 1);
      /*добавить класса "autocomplete-active": */
      items[currentFocus].classList.add("autocomplete-active");
    }

    function closeAllLists(elmnt) {
      /* закройте все списки автозаполнения в документе,
      кроме того, который был передан в качестве аргумента: */
      let items = document.querySelectorAll(".autocomplete-items");
      for (let i = 0; i < items.length; i++) {
        if (elmnt != items[i] && elmnt != inp) {
          items[i].parentNode.removeChild(items[i]);
        }
      }
    }
    /* выполнение функции, когда кто-то щелкает в документе: */
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }

  autocomplete(document.getElementById("mainInput"), allNames);







});
