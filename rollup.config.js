import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    name: 'my-virtual-dom.js',
    input: './index.js',
    output: {
        file: './dist/my-virtual-dom.js',
        format: 'umd'
    },
    plugins: [
        resolve(),
        commonjs(),
    ]
}