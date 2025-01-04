import "../../helpers/iframeLoader.js";
import axios from "axios";
import React, { Component } from "react";
import DOMHelper from "../../helpers/dom-helper.js";
import EditorText from "../editor-text/editor-text.js";
import Spiner from "../spiner";
import bootstrap from "bootstrap";
import ConfirmModal from "../confirm-modal";
import ChooseModal from "../choose-modal";
import Panel from "../panel";
import EditorMeta from "../editor-meta";
import EditorImages from "../editor-images";
import Notification from "../notification";
import Login from "../login";
import { setTimeout } from "core-js";

export default class Editor extends Component {
  currentPage = "index.html";
  state = {
    notification: {
      show: false,
      variant: "danger",
      text: "test",
    },
    bdListProducts: [],
    menuListProducts: [],
    pageList: [],
    backupsList: [],
    newPageName: "",
    loading: true,
    auth: false,
    loginError: false,
    loginLengthError: false,
  };

  componentDidMount() {
    this.checkAuth();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.auth !== prevState.auth) {
      this.init(null, this.currentPage);
    }
  }
  checkAuth = () => {
    axios.get("./api/checkAuth.php").then((res) => {
      this.setState({
        auth: res.data.auth,
      });
    });
  };
  login = (pass) => {
    if (pass.length > 5) {
      axios.post("./api/login.php", { password: pass }).then((res) => {
        this.setState({
          auth: res.data.auth,
          loginError: !res.data.auth,
          loginLengthError: false,
        });
      });
    } else {
      this.setState({
        loginError: false,
        loginLengthError: true,
      });
    }
  };
  logout = () => {
    axios.get("./api/logout.php").then(() => {
      window.location.replace("/");
    });
  };

  init = (e, page) => {
    if (e) {
      e.preventDefault();
    }
    if (this.state.auth) {
      this.isLoading(); //спинер
      this.iframe = document.querySelector("iframe");
      this.open(page, this.isLoaded);
      this.loadPageList();
      this.loadBackapsList();
    }
  };

  open = (page, cb) => {
    this.currentPage = page; //записываем ту страницу которую открываем
    axios
      .get(`../${page}?rnd=${Math.random()}`) //посыл запрса на сервер и получ страницы
      .then((res) => DOMHelper.parseStringToDom(res.data)) //модифицируем ее из строки в dom
      .then(DOMHelper.wrapTextNodes) //оборачиваем кеатомными тегами текстовые ноды
      .then(DOMHelper.wrapImages) //оборачиваем кеатомными тегами картинки
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
    this.loadBackapsList();
  };

  save = async () => {
    this.isLoading();
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unWrapTextNodes(newDom);
    DOMHelper.unwrapImages(newDom);
    const html = DOMHelper.serializeDomToString(newDom);
    await axios
      .post("./api/savePage.php", {
        pageName: this.currentPage,
        html: html,
      })
      .then(this.showNotifications("sucess", "Изменения сохранены"))
      .catch((error) => {
        this.showNotifications("danger", `"Ошибка: "${error}`);
      })
      .finally(this.isLoaded);
    this.loadBackapsList();
  };
  enableEditing = (d) => {
    d.contentWindow.document.body
      .querySelectorAll("text-editor")
      .forEach((el) => {
        const id = el.getAttribute("nodeid");
        const virtualElement = this.virtualDom.body.querySelector(
          `[nodeid="${id}"]`
        );

        new EditorText(el, virtualElement);
      });

    d.contentWindow.document.body
      .querySelectorAll("[editableimgid]")
      .forEach((el) => {
        const id = el.getAttribute("editableimgid");
        const virtualElement = this.virtualDom.body.querySelector(
          `[editableimgid="${id}"]`
        );

        new EditorImages(
          el,
          virtualElement,
          this.isLoading,
          this.isLoaded
          /* this.showNotifications("Успешно сохранено", "success", "true") */
        );
      });
  };
  injectStyles = () => {
    const style = this.iframe.contentWindow.document.createElement("style");
    style.innerHTML = `
	  text-editor:hover{
	  outline:3px solid orange;
	  outline-offset:8px;
	  }
	  text-editor:focus{
	  outline:3px solid red;
	  outline-offset:8px;
	  }
	  [editableimgid]:hover{
	  outline:3px solid green;
	  outline-offset:8px;
	  }`;
    this.iframe.contentWindow.document.head.appendChild(style);
  };

  loadPageList = () => {
    axios
      .get("./api/pageList.php")
      .then((res) => this.setState({ pageList: res.data }));
  };
  loadBackapsList = () => {
    axios.get("./backups/backups.json").then((res) =>
      this.setState({
        backupsList: res.data.filter((backup) => {
          return backup.page === this.currentPage;
        }),
      })
    );
  };
  confirmModal = () => {
    return confirm(
      "Вы действительно хотите восстановить страницу из этой резервной копии? Все несохраненные изменения будут утеряны!",
      { Labels: { ok: "Восстановить", cansel: "Отменить восстановление" } }
    );
  };
  restoreBackup = (e, backup) => {
    if (e) {
      e.preventDefault();
    }
    this.confirmModal();
    new Promise(() => {
      this.isLoading();
      return axios
        .post("./api/restoreBackup.php", {
          page: this.currentPage,
          file: backup,
        })
        .then(() => {
          this.open(this.currentPage, this.isLoaded);
        });
    });
  };
  isSHowing = (variant, text) => {
    if (variant && text != "undefined") {
      this.setState({
        notification: {
          show: true,
          variant: variant,
          text: text,
        },
      });
    } else {
      this.setState({
        notification: { show: true },
      });
    }
  };
  showed = () => {
    this.setState({
      notification: { show: false },
    });
  };
  isLoading = () => {
    this.setState({
      loading: true,
    });
  };
  isLoaded = () => {
    this.setState({
      loading: false,
    });
  };
  showNotifications(vari, text) {
    this.isSHowing(vari, text);
    setTimeout(() => {
      this.showed();
    }, 1000);
  }

  render() {
    const {
      notification,
      loading,
      pageList,
      backupsList,
      auth,
      loginError,
      loginLengthError,
    } = this.state;
    if (!auth) {
      return (
        <Login
          login={this.login}
          lengthErr={loginLengthError}
          logErr={loginError}
        />
      );
    }

    return (
      <>
        <iframe src={null} frameBorder="0"></iframe>

        <input
          id="img-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        ></input>
        <Notification prop={notification} />
        <Spiner active={loading}></Spiner>
        <Panel />
        <ConfirmModal
          target={"modal-save"}
          method={this.save}
          text={{
            title: "Сохранение",
            description: "Уверены что хотите сохранить изменения",
            btn: "Опубликовать",
          }}
        />
        <ConfirmModal
          target={"modal-logout"}
          method={this.logout}
          text={{
            title: "Выход",
            description: "Уверены что хотите выйти",
            btn: "Выход",
          }}
        />
        <ChooseModal
          target={"modal-open"}
          data={pageList}
          redirect={this.init}
          bstoggle={"modal"}
        />
        <ChooseModal
          bstoggle={"modal"}
          target={"modal-backup"}
          data={backupsList}
          redirect={this.restoreBackup}
        />
        {this.virtualDom ? (
          <EditorMeta target={"modal-meta"} virtualDom={this.virtualDom} />
        ) : (
          false
        )}
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
