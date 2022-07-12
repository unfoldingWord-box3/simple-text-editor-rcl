/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { EditableContent } from 'ste-react-core';

import blockParser from '../core/blockParser';
import sectionParser from '../core/sectionParser';

import Document from './Document';
import SectionHeading from './SectionHeading';
import Block from './Block';

import './SequenceHtmlEditor.css';

const parser = new DOMParser();

const DEFAULT_PROPS = {
  decorators: {
    chapter: [/\\c\s+(\d*)/g, '<span class="chapter">$1</span>'],
    verses: [/\\v\s+(\d*)/g, '<span class="verses">$1</span>'],
  },
  joiners: {
    section: '',
    block: '',
  },
};

export default function SequenceHtmlEditor({
  content,
  onContent: _onContent,
  options: _options,
  components: _components,
  parsers: _parsers,
  joiners: _joiners,
  decorators: _decorators,
  verbose = false,
  ...props
}) {
  const decorators = { ...DEFAULT_PROPS.decorators, ..._decorators };
  const joiners = { ...DEFAULT_PROPS.joiners, ..._joiners };

  useEffect(() => {
    if (verbose) console.log('PerfEditor First Render');
    return (() => {
      if (verbose) console.log('PerfEditor Unmount');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doc = parser.parseFromString(content, 'text/html');
  // parse the full content by divs for rendering
  const divs = {
    sequence: () => doc.getElementById("sequence"),
    content: () => doc.getElementById("content"),
  };

  const options = { returnHtml: true, ..._options };

  const parsers = {
    section: sectionParser({ divs }),
    block: blockParser,
    ..._parsers
  };

  const sequenceDataset = divs.sequence()?.dataset;

  const components = {
    document: (props) => Document({ dataset: sequenceDataset, verbose, ...props }),
    sectionHeading: SectionHeading,
    block: Block,
    ..._components
  };

  const onContent = (_content) => {
    divs.content().innerHTML = _content;
    _onContent(divs.sequence().outerHTML);
  };

  const perfProps = {
    content: divs.content().innerHTML,
    onContent,
    options,
    components,
    parsers,
    joiners,
    decorators,
    verbose,
    ...props
  };

  return (
    <div className='perf' key="1">
      <EditableContent key="1" {...perfProps} />
    </div>
  );
};

SequenceHtmlEditor.propTypes = {
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
  /** Flag to enable logging  */
  verbose: PropTypes.bool,
};

SequenceHtmlEditor.defaultProps = DEFAULT_PROPS;