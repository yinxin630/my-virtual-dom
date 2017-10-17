(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['my-virtual-dom'] = global['my-virtual-dom'] || {}, global['my-virtual-dom'].js = factory());
}(this, (function () { 'use strict';

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
            });
        }
        return $dom;
    }
}

function patch($dom, patches) {
    const index = {
        value: 0
    };
    dfsWalk$1($dom, index, patches);
}
patch.NODE_DELETE = 'NODE_DELETE';
patch.NODE_TEXT_MODIFY = 'NODE_TEXT_MODIFY';
patch.NODE_REPLACE = 'NODE_REPLACE';
patch.NODE_ADD = 'NODE_ADD';
patch.NODE_ATTRIBUTE_MODIFY = 'NODE_ATTRIBUTE_MODIFY';
patch.NODE_ATTRIBUTE_ADD = 'NODE_ATTRIBUTE_ADD';
patch.NODE_ATTRIBUTE_DELETE = 'NODE_ATTRIBUTE_DELETE';

function dfsWalk$1($node, index, patches, isEnd = false) {
    if (patches[index.value]) {
        patches[index.value].forEach(p => {
            switch(p.type) {
                case patch.NODE_ATTRIBUTE_MODIFY: {
                    $node.setAttribute(p.key, p.value);
                    break;
                }
                case patch.NODE_ATTRIBUTE_DELETE: {
                    $node.removeAttribute(p.key.toLowerCase());
                    break;
                }
                case patch.NODE_ATTRIBUTE_ADD: {
                    $node.setAttribute(p.key, p.value);
                    break;
                }
                case patch.NODE_ADD: {
                    $node.appendChild(p.value.render());
                    break;
                }
                case patch.NODE_TEXT_MODIFY: {
                    $node.textContent = p.value;
                    break;
                }
                case patch.NODE_REPLACE: {
                    $node.replaceWith(p.value.render());
                    break;
                }
                case patch.NODE_DELETE: {
                    $node.remove();
                    break;
                }
                default: {
                    console.log(p);
                }
            }
        });
    }
    if (isEnd) {
        return;
    }
    if ($node.children.length > 0) {
        for (let i = 0; i < $node.children.length; i++) {
            index.value++;
            dfsWalk$1($node.children[i], index, patches);
        }
    } else {
        index.value++;
        dfsWalk$1($node, index, patches, true);
    }
}

function diff(oldTree, newTree) {
    const patches = {};
    const index = {value: 0};
    dfsWalk(oldTree, newTree, index, patches);
    return patches;
}

function diffProps(oldProps, newProps, index, currentIndexPatches) {
    for (const propKey in oldProps) {
        if (!newProps.hasOwnProperty(propKey)) {
            currentIndexPatches.push({
                type: patch.NODE_ATTRIBUTE_DELETE,
                key: propKey,
            });
        } else if (newProps[propKey] !== oldProps[propKey]) {
            currentIndexPatches.push({
                type: patch.NODE_ATTRIBUTE_MODIFY,
                key: propKey,
                value: newProps[propKey]
            });
        }
    }
    for (const propKey in newProps) {
        if (!oldProps.hasOwnProperty(propKey)) {
            currentIndexPatches.push({
                type: patch.NODE_ATTRIBUTE_ADD,
                key: propKey,
                value: newProps[propKey]
            });
        }
    }
}

function diffChildren(oldChildren, newChildren, index, currentIndexPatches, patches) {
    if (oldChildren.length < newChildren.length) {
        let i = 0;
        for (; i < oldChildren.length; i++) {
            index.value++;
            dfsWalk(oldChildren[i], newChildren[i], index, patches);
        }
        for (; i < newChildren.length; i++) {
            currentIndexPatches.push({
                type: patch.NODE_ADD,
                value: newChildren[i]
            });
        }
    } else {
        for (let i = 0; i < oldChildren.length; i++) {
            index.value++;
            dfsWalk(oldChildren[i], newChildren[i], index, patches);
        }
    }
}

function dfsWalk(oldNode, newNode, index, patches) {
    const currentIndex = index.value;
    const currentIndexPatches = [];
    if (newNode === undefined) {
        currentIndexPatches.push({
            type: patch.NODE_DELETE,
        });
    } else if (typeof oldNode === 'string' && typeof newNode === 'string') {
        if (oldNode !== newNode) {
            currentIndexPatches.push({
                type: patch.NODE_TEXT_MODIFY,
                value: newNode
            });
        }
    } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
        diffProps(oldNode.props, newNode.props, index, currentIndexPatches);
        diffChildren(oldNode.children, newNode.children, index, currentIndexPatches, patches);
    } else {
        currentIndexPatches.push({
            type: patch.NODE_REPLACE,
            value: newNode
        });
    }
    if (currentIndexPatches.length > 0) {
        patches[currentIndex] = currentIndexPatches;
    }
}

const MyVdom = {
    Element,
    diff,
    patch
};
window.MyVdom = MyVdom;

return MyVdom;

})));
