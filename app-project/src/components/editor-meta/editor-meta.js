import React, { Component } from "react";
//закончил на 7,46
export default class EditorMeta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meta: {
        title: "",
        keywords: "",
        description: "",
      },
    };
  }
  componentDidMount() {
    this.getMeta(this.props.virtualDom);
  }
  componentDidUpdate(prevProps) {
    if (this.props.virtualDom !== prevProps.virtualDom) {
      this.getMeta(this.props.virtualDom);
    }
  }
  getMeta(virtualDom) {
    this.title = virtualDom.head.querySelector("title");
    if (!this.title) {
      this.title = virtualDom.head.appendChild(
        virtualDom.createElement("title")
      );
    }

    this.keywords = virtualDom.head.querySelector('meta[name="keywords"]');
    if (!this.keywords) {
      this.keywords = virtualDom.head.appendChild(
        virtualDom.createElement("meta")
      );
      this.keywords.setAttribute("name", "keywords");
      this.keywords.setAttribute("content", "");
    }
    this.description = virtualDom.head.querySelector(
      'meta[name="description"]'
    );
    if (!this.description) {
      this.description = virtualDom.head.appendChild(
        virtualDom.createElement("meta")
      );
      this.description.setAttribute("name", "description");
      this.description.setAttribute("content", "");
    }
    this.setState({
      meta: {
        title: this.title.innerText,
        keywords: this.keywords.getAttribute("content"),
        description: this.description.getAttribute("content"),
      },
    });
  }

  applyMeta() {
    this.title.innerText = this.state.meta.title;
    this.keywords.setAttribute("content", this.state.meta.keywords);
    this.description.setAttribute("content", this.state.meta.description);
  }
  onValueChange(e) {
    e.persist();
    if (e.target.getAttribute("data-title")) {
      this.setState(({ meta }) => {
        const newMeta = {
          ...meta,
          title: e.target.value,
        };
        return {
          meta: newMeta,
        };
      });
    } else if (e.target.getAttribute("data-key")) {
      this.setState(({ meta }) => {
        const newKey = {
          ...meta,
          keywords: e.target.value,
        };
        return {
          meta: newKey,
        };
      });
    } else {
      this.setState(({ meta }) => {
        const newDesc = {
          ...meta,
          description: e.target.value,
        };
        return {
          meta: newDesc,
        };
      });
    }
  }
  render() {
    const { modal, target } = this.props;
    const { title, keywords, description } = this.state.meta;
    return (
      <div id={target} uk-modal={modal.toString()} container="false">
        <div className="uk-modal-dialog uk-modal-body">
          <h2 className="uk-modal-title">Редактирование МетаТегов</h2>
          <form>
            <div className="uk-margin">
              <input
                data-title
                className="uk-input"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => this.onValueChange(e)}
              />
            </div>
            <div className="uk-margin">
              <textarea
                data-key
                className="uk-textarea"
                rows="5"
                placeholder="KeyWords"
                value={keywords}
                onChange={(e) => this.onValueChange(e)}
              />
            </div>
            <div className="uk-margin">
              <textarea
                data-description
                className="uk-textarea"
                rows="5"
                placeholder="Description"
                value={description}
                onChange={(e) => this.onValueChange(e)}
              />
            </div>
          </form>
          <p className="uk-text-right">
            <button
              className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
              type="button"
            >
              Отменить
            </button>
            <button
              className="uk-button uk-button-primary uk-modal-close"
              type="button"
              onClick={() => {
                this.applyMeta();
              }}
            >
              Применить
            </button>
          </p>
        </div>
      </div>
    );
  }
}
