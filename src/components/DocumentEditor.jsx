import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareEffect } from 'use-deep-compare';

import SectionEditor from './SectionEditor';

export default function DocumentEditor ({
  text,
  onEdit,
  editable,
  titleComponent,
  headingComponent,
  blockComponent,
  sectionable,
  sectionParser,
  sectionJoiner,
  blockable,
  blockParser,
  blockJoiner,
}) {
  const _sections = sectionable ? sectionParser(text) : [text];
  const [sections, setSections] = useState(_sections);
  const [showIndex, setShowIndex] = useState(0);

  const onSectionEdit = (section, index) => {
    let __sections = [...sections];
    __sections[index] = section;
    setSections(__sections);
  };

  useDeepCompareEffect(() => {
    onEdit(sections.join(sectionJoiner));
  }, [sections]);

  let sectionComponents = <></>;
  sectionComponents = sections.map((section, index) => {
    const sectionProps = {
      text: section,
      // component: sectionComponent,
      onEdit: (_section) => { onSectionEdit(_section, index); },
      show: (index === showIndex),
      onShow: () => { setShowIndex(index); },
      headingComponent,
      blockComponent,
      blockable,
      blockParser,
      blockJoiner,
      editable,
    };
    return <SectionEditor key={ section + index } {...sectionProps} />;
  });
  
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
  onEdit: PropTypes.func,
  /** Editable? */
  editable: PropTypes.bool,
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
  /** Function triggered on Heading click */
};

DocumentEditor.defaultProps = {
  editable: true,
  headingComponent: (props) => (<h2 {...props}> {props.text}</h2>),
  blockComponent: (props) => (
    <div {...props} style={{ padding: '0 0.2em' }}></div>
  ),
  onEdit: (text) => { console.warn('DocumentEditor.onEdit() not provided:\n\n', text); },
  blockable: true,
  blockJoiner: '\n',
  blockParser: (text) => (text.split('\n')),
  sectionable: true,
  sectionJoiner: '\n\n',
  sectionParser: (text) => (text.split('\n\n')),
  text: '',
};

