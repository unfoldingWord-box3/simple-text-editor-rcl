```js
import {useState} from 'react';

const title = 'Lorem Ipsum';
const _text = `\\h Titus
\\id TIT, Bhadrawahi_Bhadrawahi_ltr, EN_ULB, Sat Jul 15 2017 21:23:37 GMT-0400 (EDT)
\\c 1
\\p
\\v 1 पौलुसेरे|
\\v 2-4 तैस हमेंशरी|
\\s क्रेते
\\v 5 मीं तू|
\\c 2
\\p
\\v 1 पण तू एरी गल्लां ज़ो, ज़ैना रोड़ी तालीमारे काबलन|
\\p
\\v 2 मतलब बुडडे मड़द, प्रहेज़ केरने बाले, ते समझ़दार ते संयमी भोंन, ते तैन केरो विशवास ते प्रेम, ते सबर पक्की भोए|`;

const [text, setText] = useState(_text);
const [sectionIndex, setSectionIndex] = useState(0);

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
  sectionable: true,
  blockable: true,
  preview: false,
  sectionIndex,
  onSectionClick,
  onBlockClick,
};

<UsfmEditor {...props} />;
```