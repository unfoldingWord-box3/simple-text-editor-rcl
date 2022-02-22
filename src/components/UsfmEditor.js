/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

import { segmenter } from '../helpers/segmenter';
import DocumentEditor from './DocumentEditor';

import './Usfm.css';

export default function UsfmEditor(props) {
  return (
    <div className='usfm'>
      <DocumentEditor {...props} />
    </div>
  );
};

UsfmEditor.propTypes = {
  /** Text to be edited whether file, section or block */
  text: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onText: PropTypes.func,
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
  /** Component to be the section body */
  sectionBodyComponent: PropTypes.func,
  /** Function to parse the text into sections */
  sectionParser: PropTypes.func,
  /** Parse text by sections using sectionParser */
  sectionable: PropTypes.bool,
  /** String to join the sections to text */
  sectionJoiner: PropTypes.string,
  /** Callback triggered on Section Heading click, provides section text and index. */
  onSectionClick: PropTypes.func.isRequired,
  /** Index of section to be show, for app to manage state. -1 to show all. */
  sectionIndex: PropTypes.number,
  /** Object of replacers for html/css decoration of text, done at block level */
  decorators: PropTypes.object,
};

UsfmEditor.defaultProps = {
  headingComponent: ({ text, ...props }) => (
    <div className='heading' {...props}>
      <span className='text'>{text.replace(/^\n+/, '').split('\n')[0]}</span>
    </div>
  ),
  blockComponent: ({ text, ..._props }) => (
    <><div className='block' {..._props} style={{ width: '100%', whiteSpace: 'pre-wrap' }} /></>
  ),
  sectionParser: (_text) => (
    segmenter({ text: _text, regex: /(^|\\c +\d+)(\n|.)+?(\n|$)?(?=(\\c +\d+|$))/g })
  ),
  sectionJoiner: '',
  blockParser: (_text) => (
    segmenter({ text: _text, regex: /(^|\\[cspv])(\n|.)+?(\n|$)?(?=(\\[cspv]|$))/g })
  ),
  blockJoiner: '',
  decorators: {
    embededHtml: [/</g, "&lt;"], // same as default but overrideable
    header: [/(\\(id|ide|h|toc\d?|mt)(\n|.|$)+?)(?=(\\(id|ide|h|toc\d?|mt|[cspvr])|$))/g, "<span class='header $2'>$1</span>"],
    psuedoBlock: [/(\\([cspvr]\d?)(\n|.|$)+?)(?=(\\[cspvr]|$))/g, "<span class='pseudo-block $2'>$1</span>"],
    footnotes: [/(\\f (.|\n)+?(\\f\*))/g, "<span class='footnote'>$1</span>"],
    endnotes: [/(\\fe (.|\n)+?(\\fe\*))/g, "<span class='endnote'>$1</span>"],
    numberForMarkers: [/(\\([\w]+)\** +)(\d+-?\d*)(?=[^:.])/g, "$1<span class='number'>$3</span>"],
    markers: [/(\\([\w-]+\d*)\\?\** *)(?=[^:.])/g, "<span class='marker $2'>$1</span>"],
    attributes: [/(\|? ?x?-?[\w-]+=".*")/g, "<span class='attribute'>$1</span>"],
  },
};