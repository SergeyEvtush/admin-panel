import "../../helpers/iframeLoader.js";
import axios from "axios";
import React, { Component } from "react";
import DOMHelper from "../../helpers/dom-helper.js";
import EditorText from "../editor-text/editor-text.js";
/* import { useState, useEffect } from "react"; */
export default class Editor extends Component {
  constructor() {
    super();
    this.currentPage = "index.html";
    this.state = {
      pageList: [],
      newPageName: "",
    };
    this.createNewPage = this.createNewPage.bind(this);
  }
  componentDidMount() {
    this.init(this.currentPage);
  }

  init(page) {
    this.iframe = document.querySelector("iframe");
    this.open(page);
    this.loadPageList();
  }

  open(page) {
    this.currentPage = page; //записываем ту страницу которую открываем
    axios
      .get(`../${page}?rnd=${Math.random()}`) //посыл запрса на сервер и получ страницы
      .then((res) => DOMHelper.parseStringToDom(res.data)) //модифицируем ее из строки в dom
      .then(DOMHelper.wrapTextNodes) //оборачиваем кеатомными тегами текстовые ноды
      .then((dom) => {
        this.virtualDom = dom;
        return dom;
      }) //пенрезаписываем ее в virtulDom
      .then(DOMHelper.serializeDomToString) //переводим dom в строку
      .then((html) => axios.post("./api/saveTempPage.php", { html: html })) //отправляем ее на сервер
      .then(() => this.iframe.load("../temp.html")) //открываем ее в iframe
      .then(() => {
        this.enableEditing(this.iframe); //включаем редактирование и слушаем изменения
      })
      .then(() => this.injectStyles()); //придание стилей рамке вокруг редактируемого элемента
  }
  save() {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unWrapTextNodes(newDom);
    const html = DOMHelper.serializeDomToString(newDom);
    axios.post("./api/savePage.php", {
      pageName: this.currentPage,
      html: html,
    });
  }
  enableEditing(d) {
    d.contentWindow.document.body
      .querySelectorAll("text-editor")
      .forEach((el) => {
        const id = el.getAttribute("nodeid");
        const virtualElement = this.virtualDom.body.querySelector(
          `[nodeid="${id}"]`
        );
        new EditorText(el, virtualElement);
      });
  }
  injectStyles() {
    const style = this.iframe.contentWindow.document.createElement("style");
    style.innerHTML = `
	  text-editor:hover{
	  outline:3px solid orange;
	  outline-offset:8px;
	  }
	  text-editor:focus{
	  outline:3px solid red;
	  outline-offset:8px;
	  }`;
    this.iframe.contentWindow.document.head.appendChild(style);
  }

  loadPageList() {
    axios.get("./api/").then((res) => this.setState({ pageList: res.data }));
  }
  createNewPage() {
    axios
      .post("./api/createNewPage.php", { name: this.state.newPageName })
      .then(this.loadPageList())
      .catch(() => {
        alert("Страница уже существует");
      });
  }
  deletePage(page) {
    axios
      .post("./api/deletePage.php", { name: page })
      .then(this.loadPageList())
      .catch(() => {
        alert("Страница не существует");
      });
  }
  render() {
    /* const { pageList } = this.state;
    const pages = pageList.map((page, i) => {
      return (
        <h1 key={i}>
          {page}
          <a href="#" onClick={() => this.deletePage(page)}>
            (x)
          </a>
        </h1>
      );
    });  */
    return (
      <>
        <button onClick={() => this.save()} className="but">
          click
        </button>
        <iframe src={this.currentPage} frameBorder="0"></iframe>
      </>
    );
  }
}

//!тот же функционал только на хуках
/* const Editor = () => {
  const [names, setNewPageName] = useState([]);
  const [value, setValue] = useState();
  useEffect(() => {
    axios.get("./api/").then((res) => {
      const pages = res.data;
      setNewPageName(pages);
    });
  }, [setNewPageName]);

  const loadPageList = () => {
    axios.get("./api/").then((res) => setNewPageName(res.data));
  };
  const createNewPage = () => {
    axios
      .post("./api/createNewPage.php", { name: value })
      .then(loadPageList())
      .catch(() => {
        alert("Страница уже существует");
      });
  };
  const deletePage = (page) => {
    axios
      .post("./api/deletePage.php", { name: page })
      .then(loadPageList())
      .catch(() => {
        alert("Страница не существует");
      });
  };
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const pagesArray = names.map((name, i) => {
    return (
      <li key={i}>
        <h1>
          {name}
          <a href="#" onClick={() => deletePage(name)}>
            (X)
          </a>
        </h1>
      </li>
    );
  });

  return (
    <>
      <input type="text" onChange={handleChange} />
      <button onClick={createNewPage}>Создать</button>
      <ul>{pagesArray}</ul>
    </>
  );
};
export default Editor; */
