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