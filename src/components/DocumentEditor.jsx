import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';

import SectionEditor from './SectionEditor';

export default function DocumentEditor ({
  text,
  onText,
  editable,
  titleComponent,
  headingComponent,
  blockComponent,
  sectionable,
  sectionParser,
  sectionJoiner,
  sectionIndex,
  onSectionIndex,
  blockable,
  blockParser,
  blockJoiner,
}) {
  const sections = useMemo(() => (
    sectionable ? sectionParser(text) : [text]
  ), [sectionable, sectionParser, text]);

  const onSectionEdit = useDeepCompareCallback((section, index) => {
    let _sections = [...sections];
    _sections[index] = section;
    const _text = _sections.join(sectionJoiner);
    onText(_text);
  }, [onText, sections]);

  const sectionComponents = useDeepCompareMemo(()=> (
    sections.map((section, index) => {
      const sectionProps = {
        text: section,
        // component: sectionComponent,
        onText: (_section) => { onSectionEdit(_section, index); },
        show: (index === sectionIndex),
        onShow: () => { onSectionIndex(index); },
        headingComponent,
        blockComponent,
        blockable,
        blockParser,
        blockJoiner,
        editable,
      };
      return <SectionEditor key={ section + index } {...sectionProps} />;
    })
  ), [
    sections,
    onSectionEdit,
    sectionIndex,
    onSectionIndex,
    headingComponent,
    blockComponent,
    blockable,
    blockParser,
    blockJoiner,
    editable,
  ]);
  
  return (
    <>
      {titleComponent()}
      {sectionComponents}
    </>
  )
};

DocumentEditor.propTypes = {
  /** Text to be edited whether file, section or block */
  text: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onText: PropTypes.func,
  /** Editable? */
  editable: PropTypes.bool,
  /** Component to render the title of the document */
  titleComponent: PropTypes.func,
  /** Component to wrap the first line of a section */
  headingComponent: PropTypes.func,
  /** Component to be the block editor */
  blockComponent: PropTypes.func,
  /** Function to parse the text into blocks */
  blockParser: PropTypes.func,
  /** Parse text by blocks using blockParser */
  blockable: PropTypes.bool,
  /** String to join the blocks to text */
  blockJoiner: PropTypes.string,
  /** Component to be the section wrapper */
  sectionComponent: PropTypes.func,
  /** Function to parse the text into sections */
  sectionParser: PropTypes.func,
  /** Parse text by sections using sectionParser */
  sectionable: PropTypes.bool,
  /** String to join the sections to text */
  sectionJoiner: PropTypes.string,
  /** Function triggered on Section Heading click, for app to manage state. */
  onSectionIndex: PropTypes.func.isRequired,
  /** Index of section to be show, for app to manage state. */
  sectionIndex: PropTypes.number,
};

DocumentEditor.defaultProps = {
  text: '',
  editable: true,
  titleComponent: (props) => (<h1 {...props}>{props?.text}</h1>),
  headingComponent: (props) => (<h2 {...props}>{props.text}</h2>),
  blockComponent: (props) => (
    <div {...props} style={{ padding: '0 0.2em' }}></div>
  ),
  onText: (text) => { console.warn('DocumentEditor.onText() not provided:\n\n', text); },
  blockable: true,
  blockJoiner: '\n',
  blockParser: (text) => (text.split('\n')),
  sectionable: true,
  sectionJoiner: '\n\n',
  sectionParser: (text) => (text.split('\n\n')),
  onSectionIndex: (text) => { console.warn('DocumentEditor.onSectionIndex() not provided:\n\n', text); },
  sectionIndex: 0,
};

