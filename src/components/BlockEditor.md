```js
const _text = `Text to be edited with multiple lines.
Line 2
Line 3

Line 5`;

const [text, setText] = React.useState(_text);

console.log('BlockEditor.md:\n', text);

const style = { whiteSpace: 'pre', padding: '0.9em', border: '1px solid red', };
const component = (props) => (<p {...props}></p>);

<BlockEditor text={text} onText={setText} style={style} component={component} />;
```