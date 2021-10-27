```js
const text = `Text to be edited with multiple lines.
Line 2
Line 3

Line 5`;

const style = { whiteSpace: 'pre', padding: '0.9em', border: '1px solid red', };
const component = (props) => (<p {...props}></p>);

<BlockEditor text={text} style={style} component={component} />;
```