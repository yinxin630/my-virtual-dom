function patch($dom, patches) {
    const index = {
        value: 0
    }
    dfsWalk($dom, index, patches);
}
patch.NODE_DELETE = 'NODE_DELETE';
patch.NODE_TEXT_MODIFY = 'NODE_TEXT_MODIFY';
patch.NODE_REPLACE = 'NODE_REPLACE';
patch.NODE_ADD = 'NODE_ADD';
patch.NODE_ATTRIBUTE_MODIFY = 'NODE_ATTRIBUTE_MODIFY';
patch.NODE_ATTRIBUTE_ADD = 'NODE_ATTRIBUTE_ADD';
patch.NODE_ATTRIBUTE_DELETE = 'NODE_ATTRIBUTE_DELETE';

function dfsWalk($node, index, patches, isEnd = false) {
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
        })
    }
    if (isEnd) {
        return;
    }
    if ($node.children.length > 0) {
        for (let i = 0; i < $node.children.length; i++) {
            index.value++;
            dfsWalk($node.children[i], index, patches);
        }
    } else {
        index.value++;
        dfsWalk($node, index, patches, true);
    }
}

export default patch;