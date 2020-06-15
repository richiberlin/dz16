export class Content {
  constructor(container, data) {
    this.container = container;
    this.data = data;

    this._init();
  }

  _init() {
    this._render();
  }

  _clear() {
    this.container.innerHTML = "";
  }

  _createEditButton(id) {
    const btnNode = document.createElement("button");

    btnNode.classList.value = "btn btn-warning mt-auto";
    btnNode.textContent = "Редактировать";
    btnNode.setAttribute("data-id", id);

    btnNode.addEventListener("click", this._clickEditBtn);

    return btnNode;
  }

  _clickEditBtn(event) {
    const id = event.currentTarget.getAttribute("data-id");
    const form = document.querySelector("#form");
    const titleField = form.querySelector('[name="title"]');
    const contentField = form.querySelector('[name="content"]');
    const idField = form.querySelector('[name="id"]');
    const dateField = form.querySelector('[name="date"]');

    form.setAttribute("data-method", "PUT");

    fetch("/api/data", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        data.list.forEach((item) => {
          if (item.id == id) {
            titleField.value = item.title;
            contentField.value = item.content;
            idField.value = item.id;
            dateField.value = item.date;

            $("#formModal").modal("show");
          }
        });
      })
      .catch((error) => console.error(error));
  }

  _render() {
    const btEdit = this._createEditButton(this.data.id);
    const template = `
      <h3>${this.data.title}</h3>
      <h6 class="text-muted">${this.data.date}</h6>
      <div>${this.data.content}</div>
    `;

    this._clear();
    this.container.innerHTML = this.container.innerHTML + template;
    this.container.append(btEdit);
  }
}
