```js
import {useState} from 'react';
const _text = `Section to be edited with multiple lines.
Line 2
Line 3

Line 5`;

// const component = (props) => (<p {...props}></p>);
const [ text, setText ] = useState(_text);

console.log('SectionEditor.md:\n\n', text);

const [ show, setShow ] = useState(true);

const onShow = () => { setShow(!show); };
const headingComponent = (props) => (<h4 {...props}>{props.text.split('\n')[0]}</h4>);

<SectionEditor text={text} onText={setText} show={show} onShow={onShow} headingComponent={headingComponent} />;
```