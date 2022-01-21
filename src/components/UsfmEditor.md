```js
import {useState} from 'react';
import { loremIpsumBook } from 'lorem-ipsum-usfm';

const usfm = loremIpsumBook({
  bookCode: '1LI',
  bookName: '1 Lorem Ipsum',
  chapterMin: 1,
  chapterMax: 20,
  chapterBias: 5,
  // chapterCount: 3,
  paragraphChance: 0.3,
  verseMin: 1,
  verseMax: 100,
  verseBias: 10,
  // verbose: true,
});

function Component () {
  const [text, setText] = useState(usfm);
  const [sectionIndex, setSectionIndex] = useState(1);
  const [sectionable, setSectionable] = useState(true);
  const [blockable, setBlockable] = useState(true);
  const [editable, setEditable] = useState(true);
  const [preview, setPreview] = useState(false);

  const onSectionable = () => { setSectionable(!sectionable); };
  const onBlockable = () => { setBlockable(!blockable); };
  const onEditable = () => { setEditable(!editable); };
  const onPreview = () => { setPreview(!preview); };


  const getSectionChapter = (_text) => {
    const match = /\\c *(\d+)/.exec(_text);
    const chapter = match && match[1];
    return chapter;
  };

  const onSectionClick = ({text: _text, index}) => {
    setSectionIndex(index);
    const chapter = getSectionChapter(_text);
    console.log('chapter: ', chapter);
  };

  const getBlockVerse = (_text) => {
    const match = /\\v *(\d+-?\d*)/.exec(_text);
    const verse = match && match[1];
    return verse;
  };

  const onBlockClick = ({text: _text, index}) => {
    const verse = getBlockVerse(_text);
    console.log('verse: ', verse);
  };

  const props = {
    text,
    onText: setText,
    sectionable,
    blockable,
    editable,
    preview,
    sectionIndex,
    onSectionClick,
    onBlockClick,
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
    <UsfmEditor {...props} />
    {buttons}
  </>);
};

<Component />;
```