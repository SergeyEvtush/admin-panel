export default class DOMHelper {
  static parseStringToDom(str) {
    const parser = new DOMParser();
    return parser.parseFromString(str, "text/html");
  }
  static wrapTextNodes(dom) {
    const body = dom.body;
    let textNodes = [];
    function recursy(element) {
      element.childNodes.forEach((node) => {
        if (
          node.nodeName === "#text" &&
          node.nodeValue.replace(/\s+/g, "").length > 0
        ) {
          textNodes.push(node);
        } else {
          recursy(node);
        }
      });
      return dom;
    }
    recursy(body);
    textNodes.forEach((node, i) => {
      const wraper = dom.createElement("text-editor");
      node.parentNode.replaceChild(wraper, node);
      wraper.appendChild(node);
      wraper.setAttribute("nodeid", i);
    });
    return dom;
  }
  static serializeDomToString(dom) {
    const seriaizer = new XMLSerializer();
    return seriaizer.serializeToString(dom);
  }
  static unWrapTextNodes(dom) {
    dom.body.querySelectorAll("text-editor").forEach((element) => {
      element.parentNode.replaceChild(element.firstChild, element);
    });
  }
}
