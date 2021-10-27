```js
import {useState} from 'react';
const text = `Section to be edited with multiple lines.
Line 2
Line 3

Line 5`;

// const component = (props) => (<p {...props}></p>);
const [ show, setShow ] = useState(true);
const onShow = () => { setShow(!show); };
const headingComponent = (props) => (<h4 {...props}> {props.text}</h4>);


<SectionEditor text={text} show={show} onShow={onShow} headingComponent={headingComponent} />;
```