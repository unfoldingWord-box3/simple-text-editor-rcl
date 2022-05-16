# EditableBlock

This component is what the EditableSection component uses after it segments the content into blocks. It uses the component prop to inject content editable logic.

```js
const _content = `content to be edited with multiple lines.
Line 2
Line 3

Line 5`;

const [content, setContent] = React.useState(_content);

console.log('EditableBlock.md:\n', content);

const style = {
  whiteSpace: 'pre',
  padding: '0.9em',
  border: '1px solid red',
}
;
const component = (props) => (<p {...props}></p>);

const props = {
  content,
  onContent: setContent,
  component,
  style,
};

<EditableBlock {...props} />;
```