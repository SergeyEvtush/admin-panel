import "../../helpers/iframeLoader.js";
import axios from "axios";
import React, { Component } from "react";
import DOMHelper from "../../helpers/dom-helper.js";
import EditorText from "../editor-text/editor-text.js";
import Spiner from "../spiner";
import UIkit from "uikit";
import ConfirmModal from "../confirm-modal";
import ChooseModal from "../choose-modal";
/* import { useState, useEffect } from "react"; */
export default class Editor extends Component {
  constructor() {
    super();
    this.currentPage = "index.html";
    this.state = {
      pageList: [],
      newPageName: "",
      loading: true,
    };
    this.createNewPage = this.createNewPage.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.isLoaded = this.isLoaded.bind(this);
    this.save = this.save.bind(this);
    this.init = this.init.bind(this);
  }
  componentDidMount() {
    this.init(null, this.currentPage);
  }

  init(e, page) {
    if (e) {
      e.preventDefault();
    }
    this.isLoading(); //спинер
    this.iframe = document.querySelector("iframe");
    this.open(page, this.isLoaded);
    this.loadPageList();
  }

  open(page, cb) {
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
      .then(() => this.iframe.load("../yfuy1g221b_hhg44.html")) //открываем ее в iframe
      .then(() => axios.post("./api/deleteTempPage.php"))
      .then(() => {
        this.enableEditing(this.iframe); //включаем редактирование и слушаем изменения
      })
      .then(() => this.injectStyles()) //придание стилей рамке вокруг редактируемого элемента
      .then(cb);
  }
  save(onSuccess, onError) {
    this.isLoading();
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unWrapTextNodes(newDom);
    const html = DOMHelper.serializeDomToString(newDom);
    axios
      .post("./api/savePage.php", {
        pageName: this.currentPage,
        html: html,
      })
      .then(onSuccess)
      .catch(onError)
      .finally(this.isLoaded);
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
    axios
      .get("./api/pageList.php")
      .then((res) => this.setState({ pageList: res.data }));
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

  isLoading() {
    this.setState({
      loading: true,
    });
  }
  isLoaded() {
    this.setState({
      loading: false,
    });
  }

  render() {
    const { loading, pageList } = this.state;

    const modal = true;

    return (
      <>
        <iframe src={this.currentPage} frameBorder="0"></iframe>
        <Spiner active={loading}></Spiner>
        <div className="panel">
          <button
            className="uk-button uk-button-primary uk-margin-small-right"
            type="button"
            uk-toggle="target: #modal-open"
          >
            Открыть
          </button>
          <button
            className="uk-button uk-button-primary"
            type="button"
            uk-toggle="target: #modal-save"
          >
            Опубликовать
          </button>
        </div>
        <ConfirmModal modal={modal} target={"modal-save"} method={this.save} />
        <ChooseModal
          modal={modal}
          target={"modal-open"}
          data={pageList}
          redirect={this.init}
        />
      </>
    );
  }
}

/* <button onClick={() => this.save()} className="but">
          click
        </button> */

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
