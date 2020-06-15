import { List } from "./list";
import { resetForm } from "./reset-form";

export class Form {
  constructor(form) {
    this.form = form;
    this.idField = document.querySelector('[name="id"]');
    this.dateField = document.querySelector('[name="date"]');

    this.btnSubmit = document.querySelector('[type="submit"]');
    this.listContainer = document.querySelector("#list");

    this.handleSubmit = this._submit.bind(this);

    this._init();
  }

  _init() {
    this.btnSubmit.addEventListener("click", this.handleSubmit);
  }

  // Добавить ноль перед числом
  _parseNumber(num) {
    let parsedNum = num;

    return parsedNum < 10 ? "0" + parsedNum : parsedNum;
  }

  _buildDate(date) {
    // dd.mm.YYYY hh:mm
    let day = this._parseNumber(date.getDate());
    let month = this._parseNumber(date.getMonth() + 1);
    let year = date.getFullYear();

    let hours = this._parseNumber(date.getHours());
    let minutes = this._parseNumber(date.getMinutes());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  // Метод отправки зависит от аргумента method
  _send(data, method) {
    let url = "/api/data";

    if (method == "PUT") url = url + `/${data.id}`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => new List(this.listContainer, data.list))
      .catch((error) => console.error(error));
  }

  _setMetaData(id, date) {
    // Если мы редактирует, то метаданные уже есть и менять их не будем
    if (this.idField.value && this.dateField.value) return;

    this.idField.value = id;
    this.dateField.value = date;
  }

  _submit(event) {
    event.preventDefault();

    if (!this.form.checkValidity()) {
      this.form.classList.add("invalid");
    } else {
      this.form.classList.remove("invalid");

      const currentMethod = this.form.getAttribute("data-method");

      const currentDate = new Date();
      this._setMetaData(currentDate.getTime(), this._buildDate(currentDate));

      const formData = new FormData(this.form);
      const data = {};

      for (const [name, value] of formData) {
        data[name] = value;
      }

      this._send(data, currentMethod);

      resetForm(this.form);
      $("#formModal").modal("hide"); // Открыть модальное окно
    }
  }
}
