class Element {
    constructor(tagName, ...args) {
        this.tagName = tagName;
        if (Array.isArray(args[0])) {
            this.props = {};
            this.children = args[0];
        } else {
            this.props = args[0];
            this.children = args[1];
        }
        this.key = this.props.key || void 0;
    }
    render() {
        const $dom = document.createElement(this.tagName);
        for (const propKey in this.props) {
            $dom.setAttribute(propKey, this.props[propKey]);
        }
        if (this.children) {
            this.children.forEach(child => {
                if (child instanceof Element) {
                    $dom.appendChild(child.render());
                } else {
                    $dom.appendChild(document.createTextNode(child));
                }
            })
        }
        return $dom;
    }
}

export default Element