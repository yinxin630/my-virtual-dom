import Element from './lib/element';
import diff from './lib/diff';
import patch from './lib/patch';

const MyVdom = {
    Element,
    diff,
    patch
};
window.MyVdom = MyVdom;
export default MyVdom;
