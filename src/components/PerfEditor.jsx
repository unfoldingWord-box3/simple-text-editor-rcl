/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

import { segmenter } from '../helpers/segmenter';
import EditableContent from './EditableContent';

import './Perf.css';

const parser = new DOMParser();

export default function PerfEditor({
  content: _content,
  onContent: _onContent,
  options: _options,
  components: _components,
  parsers: _parsers,
  joiners: _joiners,
  decorators: _decorators,
  ...props
}) {
  const doc = parser.parseFromString(_content, 'text/html');
  // parse the full content by divs for rendering
  const divs = {
    document: () => doc.getElementById("document"),
    sequence: () => doc.getElementById("sequence"),
    headers: () => doc.getElementById("headers"),
    content: () => doc.getElementById("content"),
  };

  const content = divs.content().innerHTML;

  const options = { returnHtml: true, ..._options };

  const components = {
    document: ({ children, _content, ...props }) => (
      <div id="document" {...divs.document()?.dataset || {}}>
        <div id="sequence" {...divs.sequence()?.dataset || {}}>
          <div id="headers" dangerouslySetInnerHTML={{ __html: divs.headers()?.innerHTML }} />
          <div id="content">
            {children}
          </div>
        </div>
      </div>
    ),
    sectionHeading: ({ content, show, index, ...props }) => (
      <div className='sectionHeading' {...props}>
        {show ? '' : <span className='expand'>...{index ? `Chapter ${index}` : 'Title & Introduction'}...</span>}
      </div>
    ),
    block: ({ content, style, ..._props }) => (
      <div {..._props} contentEditable={!!content.match(/class="[\w\s]*block[\w\s]*"/)} />
    ),
    ..._components
  };

  const parsers = {
    section: (_content) => (
      segmenter({ content: _content, regex: /(^|(\s*<div class="graft heading.*?<\/div>\n)*?\s*<div class="block p"><span class="chapter">)(\n|.)+?(\n|$)?(?=((\s*<div class="graft heading.*?<\/div>\n)*?\s*<div class="block p"><span class="chapter">|$))/g })
    ),
    block: (_content) => (
      segmenter({ content: _content, regex: /(^|<div)(\n|.)+?(\n|$)?(?=(<div|$))/g })
    ),
    ..._parsers
  };

  const joiners = {
    section: '',
    block: '',
    ..._joiners
  };

  const decorators = {
    chapter: [/\\c\s+(\d*)/g, '<span class="chapter">$1</span>'],
    verses: [/\\v\s+(\d*)/g, '<span class="verses">$1</span>'],
    ..._decorators,
  };

  const onContent = (_content) => {
    divs.content().innerHTML = _content;
    const __content = divs.document().outerHTML;
    _onContent(__content);
  };

  const perfProps = {
    content,
    onContent,
    options,
    components,
    parsers,
    joiners,
    decorators,
    ...props
  };

  return (
    <div className='perf'>
      <EditableContent {...perfProps} />
    </div>
  );
};

PerfEditor.propTypes = {
  /** Text to be edited whether file, section or block */
  content: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onContent: PropTypes.func,
  /** Options for the editor */
  options: PropTypes.shape({
    /** Parse content by sections using sectionParser */
    sectionable: PropTypes.bool,
    /** Parse content by blocks using blockParser */
    blockable: PropTypes.bool,
    /** Editable? */
    editable: PropTypes.bool,
    /** Preview? */
    preview: PropTypes.bool,
  }),
  /** Components to wrap all sections of the document */
  components: PropTypes.shape({
    /** Component to wrap all sections of the document */
    document: PropTypes.func,
    /** Component to be the section wrapper */
    section: PropTypes.func,
    /** Component to wrap the first line of a section */
    sectionHeading: PropTypes.func,
    /** Component to be the section body */
    sectionBody: PropTypes.func,
    /** Component to be the block editor */
    block: PropTypes.func,
  }),
  /** Functions to parse the content into sections and blocks */
  parsers: PropTypes.shape({
    /** Function to parse the content into sections */
    section: PropTypes.func,
    /** Function to parse the content into blocks */
    block: PropTypes.func,
  }),
  /** Strings to join the blocks to content */
  joiners: PropTypes.shape({
    /** String to join the sections to content */
    section: PropTypes.string,
    /** String to join the blocks to content */
    block: PropTypes.string,
  }),
  /** Object of replacers for html/css decoration of content, done at block level */
  decorators: PropTypes.object,
  /** Callback handlers such as block and section click */
  handlers: PropTypes.shape({
    /** Callback triggered on Section Heading click, provides section content and index. */
    onSectionClick: PropTypes.func,
    /** Callback triggered on Block click, provides block content and index. */
    onBlockClick: PropTypes.func,
  }),
  /** Index of section to be show, for app to manage state. -1 to show all. */
  sectionIndex: PropTypes.number,
};

PerfEditor.defaultProps = {

};