/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareCallback } from 'use-deep-compare';

import EditableSection from './EditableSection';

export default function EditableContent({
  content,
  onContent,
  returnHtml,
  editable,
  preview,
  documentComponent,
  sectionComponent,
  sectionBodyComponent,
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
    sectionable ? sectionParser(content) : [content]
  ), [sectionable, sectionParser, content]);

  const onSectionEdit = useDeepCompareCallback((section, index) => {
    let _sections = [...sections];
    _sections[index] = section;
    const _content = _sections.join(sectionJoiner);
    onContent(_content);
  }, [onContent, sections]);

  const sectionComponents = sections.map((section, index) => {
    const sectionProps = {
      content: section,
      onContent: (_section) => { onSectionEdit(_section, index); },
      returnHtml,
      show: (!sectionable || sectionIndex === -1 || index === sectionIndex),
      onShow: () => { onSectionClick({ content: section, index }); },
      index,
      sectionComponent,
      sectionBodyComponent,
      headingComponent,
      blockComponent,
      blockable,
      blockParser,
      blockJoiner,
      editable,
      sectionable,
      onSectionClick,
      onBlockClick,
      decorators,
    };
    return <EditableSection key={section + index} {...sectionProps} />;
  });

  let documentProps = { content, ...props };

  if (preview) documentProps.className = 'preview';

  return (
    <>
      {documentComponent({ ...documentProps, children: sectionComponents })}
    </>
  );
};

EditableContent.propTypes = {
  /** Text to be edited whether file, section or block */
  content: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onContent: PropTypes.func,
  /** Return html instead of text */
  returnHtml: PropTypes.bool,
  /** Editable? */
  editable: PropTypes.bool,
  /** Preview? */
  preview: PropTypes.bool,
  /** Component to wrap all sections of the document */
  documentComponent: PropTypes.func,
  /** Component to wrap the first line of a section */
  headingComponent: PropTypes.func,
  /** Component to be the block editor */
  blockComponent: PropTypes.func,
  /** Function to parse the content into blocks */
  blockParser: PropTypes.func,
  /** Parse content by blocks using blockParser */
  blockable: PropTypes.bool,
  /** String to join the blocks to content */
  blockJoiner: PropTypes.string,
  /** Callback triggered on Block click, provides block content and index. */
  onBlockClick: PropTypes.func,
  /** Component to be the section wrapper */
  sectionComponent: PropTypes.func,
  /** Component to be the section body */
  sectionBodyComponent: PropTypes.func,
  /** Function to parse the content into sections */
  sectionParser: PropTypes.func,
  /** Parse content by sections using sectionParser */
  sectionable: PropTypes.bool,
  /** String to join the sections to content */
  sectionJoiner: PropTypes.string,
  /** Callback triggered on Section Heading click, provides section content and index. */
  onSectionClick: PropTypes.func.isRequired,
  /** Index of section to be show, for app to manage state. -1 to show all. */
  sectionIndex: PropTypes.number,
  /** Object of replacers for html/css decoration of content, done at block level */
  decorators: PropTypes.object,
};

EditableContent.defaultProps = {
  content: '',
  editable: true,
  preview: false,
  documentComponent: ({ children, content, ...props }) => (<div className='document' {...props}>{children}</div>),
  onContent: (content) => { console.warn('EditableContent.onContent() not provided:\n\n', content); },
  blockable: true,
  blockJoiner: '\n',
  blockParser: (content) => (content.split('\n')),
  onBlockClick: ({ content, index }) => { console.warn('EditableContent.onBlockClick({content, index}) not provided.\n\n', index); },
  sectionable: true,
  sectionJoiner: '\n\n',
  sectionParser: (content) => (content.split('\n\n')),
  onSectionClick: ({ content, index }) => { console.warn('EditableContent.onSectionClick({content, index}) not provided:\n\n', index); },
  sectionIndex: 0,
};

