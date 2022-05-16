/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

import { segmenter } from '../helpers/segmenter';
import EditableContent from './EditableContent';

import './Perf.css';

const parser = new DOMParser();

export default function PerfEditor(props) {
  return (
    <div className='perf'>
      <EditableContent {...props} />
    </div>
  );
};

PerfEditor.propTypes = {
  /** Text to be edited whether file, section or block */
  content: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onContent: PropTypes.func,
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
  onSectionClick: PropTypes.func,
  /** Index of section to be show, for app to manage state. -1 to show all. */
  sectionIndex: PropTypes.number,
  /** Object of replacers for html/css decoration of content, done at block level */
  decorators: PropTypes.object,
};

PerfEditor.defaultProps = {
  returnHtml: true,
  documentComponent: ({ children, content, ...props }) => {
    const doc = parser.parseFromString(content, 'text/html');
    const sequenceDiv = doc.getElementById('sequence');
    const dataset = sequenceDiv.dataset;
    const headersDiv = doc.getElementById('headers');
    const __html = headersDiv.innerHTML;
    const headersComponent = <div id='headers' dangerouslySetInnerHTML={{ __html }}></div>;

    return (
      <div id="sequence" className='document' {...dataset} {...props}>
        {/* {headersComponent} */}
        {children}
      </div>
    );
  },
  headingComponent: ({ content, show, index, ...props }) => (
    <div className='sectionHeading' {...props}>
      {show ? '' : <span className='expand'>...{index ? `Chapter ${index}` : 'Title & Introduction'}...</span>}
    </div>
  ),
  blockComponent: ({ content, style, ..._props }) => (
    <div {..._props} contentEditable={content.includes(`class="block p"`)} />
  ),
  sectionParser: (_content) => {
    const doc = parser.parseFromString(_content, 'text/html');
    const content = doc.getElementById('content').innerHTML;

    return segmenter({ content, regex: /(^|<div class="block p"><span class="chapter">)(\n|.)+?(\n|$)?(?=(<div class="block p"><span class="chapter">|$))/g })
  },
  sectionJoiner: '',
  blockParser: (_content) => (
    segmenter({ content: _content, regex: /(^|<div)(\n|.)+?(\n|$)?(?=(<div|$))/g })
  ),
  blockJoiner: '',
  decorators: {
    chapter: [/\\c\s+(\d*)/g, '<span class="chapter">$1</span>'],
    verses: [/\\v\s+(\d*)/g, '<span class="verses">$1</span>'],
  },
};