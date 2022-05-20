# PerfEditor

PerfEditor is and editor for the PERF (Proskomma Editor Ready Format) based on the EditableContent by overriding its default props. 

No UI library (such as MaterialUI or TailwindCSS) is required but they are supported. React components are passed in to customize the UI to your needs. 

## Example 1 (Custom UI)
To see a reference implementation Proof of Concept using MaterialUI see: 
- Code: https://codesandbox.io/s/perf-html-editor-vkejn8
- Demo: https://vkejn8.csb.app/

## Example 2 (Tailwind CSS)
If you would like to contribute an example implementation using TailwindCSS please do so on codesandbox.io and submit a PR with links right here.

## Exampe 3 (Bare Minimum)
This example shows the bare minimum use case and uses default components to render the editor.

```js
import {useState} from 'react';
import { loremIpsumBook } from 'lorem-ipsum-usfm';

import {perfHtml} from '../data/perf-html.js';

function Component () {
  const [content, setContent] = useState(perfHtml);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [sectionable, setSectionable] = useState(false);
  const [blockable, setBlockable] = useState(true);
  const [editable, setEditable] = useState(true);
  const [preview, setPreview] = useState(false);

  const onSectionable = () => { setSectionable(!sectionable); };
  const onBlockable = () => { setBlockable(!blockable); };
  const onEditable = () => { setEditable(!editable); };
  const onPreview = () => { setPreview(!preview); };

  const onSectionClick = ({content: _content, index}) => {
    console.log(index, _content);
    setSectionIndex(index);
  };

  const onBlockClick = ({content: _content, index, element}) => {
    console.log(element.dataset.target);
  };

  const onContent = (_content) => {
    console.log(_content);
    setContent(_content);
  };

  const props = {
    content,
    onContent,
    options: {
      sectionable,
      blockable,
      editable,
      preview,
    },
    handlers: {
      onSectionClick,
      onBlockClick,
    },
    sectionIndex,
  };

  const buttons = (
    <>
      <button style={(sectionable ? {borderStyle: 'inset'} : {})} onClick={onSectionable}>Sectionable</button>
      <button style={(blockable ? {borderStyle: 'inset'} : {})} onClick={onBlockable}>Blockable</button>
      <button style={(editable ? {borderStyle: 'inset'} : {})} onClick={onEditable}>Editable</button>
      <button style={(preview ? {borderStyle: 'inset'} : {})} onClick={onPreview}>Preview</button>
    </>
  );

  return (<>
    {buttons}
    <PerfEditor {...props} />
    {buttons}
  </>);
};

<Component />;
```