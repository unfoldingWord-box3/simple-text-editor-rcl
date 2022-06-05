/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import EditableContent from './EditableContent';

import './Perf.css';

const parser = new DOMParser();

const DEFAULT_PROPS = {
  decorators: {
    header: [/\\([sr])((\n|.|$)+?)(?=\\[cspvr]|$)/g, '<div data-type="graft" data-new="true" class="block heading $1">$2</div>'],
    chapter: [/\\c\s+(\d*)/g, '<span class="chapter">$1</span>'],
    verses: [/\\v\s+(\d*)/g, '<span class="verses">$1</span>'],
    padding: [/<\/span>/g, "</span>\u200B"],
  },
  joiners: {
    section: '',
    block: '',
  },
};

function Document({ dataset = {}, children, content: _content, className, verbose, ...props }) {
  useEffect(() => { if (verbose) console.log('Document First Render'); }, []);

  return (
    <div id="sequence" className={className} {...dataset}>
      <div id="content">
        {children}
      </div>
    </div>
  );
};

function SectionHeading({ content, show, index, ...props }) {
  useEffect(() => {
    console.log('SectionHeading First Render');
  }, []);

  return (
    <div className='sectionHeading' {...props}>
      {show ? '' : <span className='expand'>...{index ? `Chapter ${index}` : 'Title & Introduction'}...</span>}
    </div>
  );
};

function Block({ content, style, contentEditable, ..._props }) {
  useEffect(() => {
    console.log('Block First Render');
  }, []);

  return (
    <div {..._props} contentEditable={!!content.match(/class="[\w\s]*block[\w\s]*"/) && contentEditable} />
  );
};

export default function PerfEditor({
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (verbose) console.log('EditableBlock First Render'); }, []);

  const doc = parser.parseFromString(content, 'text/html');
  // parse the full content by divs for rendering
  const divs = {
    sequence: () => doc.getElementById("sequence"),
    content: () => doc.getElementById("content"),
  };

  const options = { returnHtml: true, ..._options };

  const parsers = {
    section: () => {
      let sections = [];
      let queue = [];

      Array.from(divs.content().children, (block) => {
        const { type } = block.dataset;
        const isBlock = type === "block";

        if (isBlock) {
          const isChapter = block.firstChild?.dataset?.type === "chapter";

          if (isChapter) {
            // remove last grafts preceding chapter
            let checkLastInQueue = true;
            let headerQueue = [];

            while (checkLastInQueue) {
              if (queue.length > 0) {
                const last = queue.pop();
                const isGraft = last.dataset.type === "graft";
                const isTitle = [...last.classList].includes("title");
                const isIntro = [...last.classList].includes("introduction");

                if (isGraft && !isTitle && !isIntro) {
                  headerQueue = [...headerQueue, last];
                } else {
                  queue = [...queue, last];
                  checkLastInQueue = false;
                }
              } else {
                checkLastInQueue = false;
              }
            };
            sections = [...sections, queue];
            queue = [...headerQueue.reverse()];
          };
        };

        queue = [...queue, block];
        return true;
      });
      sections = [...sections, queue];
      queue = [];

      return sections.map(section => section.map(block => block.outerHTML).join('\n'));
    },
    block: (_content) => {
      const div = document.createElement("div");
      div.innerHTML = _content;
      const blocks = Array.from(div.children, (block) => block.outerHTML);
      return blocks;
    },
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
    let newContent = _content.replaceAll('\u200B', '');
    divs.content().innerHTML = newContent;

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