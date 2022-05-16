# EditableContent

This component is what other editors can be built on by overriding default props. It uses EditableSection by segmenting the content into sections first.

```js
import {useState} from 'react';

const title = 'Lorem Ipsum';
const _content = `What is Lorem Ipsum?
Lorem Ipsum is simply dummy content of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy content ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model content, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`;

const [content, setText] = useState(_content);
const [sectionIndex, setSectionIndex] = useState(0);

console.log('EditableContent.md:\n\n', content);

const headingComponent = ({ show, ...props}) => (<h3 {...props}><hr/>{props.content.split('\n')[0]}<hr/></h3>);
const blockComponent = (props) => (<p {...props} style={{ padding: '0 0.2em', whiteSpace: 'pre-wrap' }}></p>);

const onSectionClick = ({content: _content, index}) => {
  setSectionIndex(index);
};

const props = {
  content,
  onContent: setText,
  headingComponent,
  blockComponent,
  sectionable: true,
  blockable: true,
  sectionIndex,
  onSectionClick,
};

<EditableContent {...props} />;
```