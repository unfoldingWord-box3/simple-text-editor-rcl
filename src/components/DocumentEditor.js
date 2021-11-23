import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareCallback } from 'use-deep-compare';

import SectionEditor from './SectionEditor';

export default function DocumentEditor ({
  text,
  onText,
  editable,
  documentComponent,
  sectionComponent,
  headingComponent,
  blockComponent,
  sectionable,
  sectionParser,
  sectionJoiner,
  sectionIndex,
  onSectionClick,
  blockable,
  blockParser,
  blockJoiner,
  onBlockClick,
  decorators,
  ...props
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

  const sectionComponents = sections.map((section, index) => {
    const sectionProps = {
      text: section,
      // component: sectionComponent,
      onText: (_section) => { onSectionEdit(_section, index); },
      show: (index === sectionIndex),
      onShow: () => { onSectionClick({text: section, index}); },
      sectionComponent,
      headingComponent,
      blockComponent,
      blockable,
      blockParser,
      blockJoiner,
      editable,
      onSectionClick,
      onBlockClick,
      decorators,
    };
    return <SectionEditor key={ section + index } {...sectionProps} />;
  });
  
  return (
    <>
      {documentComponent({...props, children: sectionComponents})}
    </>
  );
};

DocumentEditor.propTypes = {
  /** Text to be edited whether file, section or block */
  text: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onText: PropTypes.func,
  /** Editable? */
  editable: PropTypes.bool,
  /** Component to wrap all sections of the document */
  documentComponent: PropTypes.func,
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
  /** Callback triggered on Block click, provides block text and index. */
  onBlockClick: PropTypes.func,
  /** Component to be the section wrapper */
  sectionComponent: PropTypes.func,
  /** Function to parse the text into sections */
  sectionParser: PropTypes.func,
  /** Parse text by sections using sectionParser */
  sectionable: PropTypes.bool,
  /** String to join the sections to text */
  sectionJoiner: PropTypes.string,
  /** Callback triggered on Section Heading click, provides section text and index. */
  onSectionClick: PropTypes.func.isRequired,
  /** Index of section to be show, for app to manage state. */
  sectionIndex: PropTypes.number,
  /** Object of replacers for html/css decoration of text, done at block level */
  decorators: PropTypes.object,
};

DocumentEditor.defaultProps = {
  text: '',
  editable: true,
  documentComponent: ({children, ...props}) => (<div class='document' {...props}>{children}</div>),
  onText: (text) => { console.warn('DocumentEditor.onText() not provided:\n\n', text); },
  blockable: true,
  blockJoiner: '\n',
  blockParser: (text) => (text.split('\n')),
  onBlockClick: ({text, index}) => { console.warn('DocumentEditor.onBlockClick({text, index}) not provided.\n\n', index); },
  sectionable: true,
  sectionJoiner: '\n\n',
  sectionParser: (text) => (text.split('\n\n')),
  onSectionClick: ({text, index}) => { console.warn('DocumentEditor.onSectionClick({text, index}) not provided:\n\n', index); },
  sectionIndex: 0,
};

