import React from 'react';
import PropTypes from 'prop-types';

import DocumentEditor from './DocumentEditor';
import { segmenter } from '../helpers/segmenter';

import './Markdown.css';

export default function MarkdownEditor (props) {
  return (
    <div class='markdown'>
      <DocumentEditor {...props} />
    </div>
  );
};

MarkdownEditor.propTypes = {
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

MarkdownEditor.defaultProps = {
  headingComponent: ({ text, ...props }) => (
    <div class='heading' {...props}>
      <span class='text'>{text.replace(/^\n+/, '').split('\n')[0]}</span>
    </div>
  ),
  blockComponent: (_props) => (
    <><div class='block' {..._props} style={{width: '100%', whiteSpace: 'pre-wrap'}} /></>
  ),
  sectionParser: (_text) => (
    segmenter({ text: _text, regex: /(\n|.)+?(\n|$)(?=(#{1,4} +.+\n*|$))/g })
  ),
  sectionJoiner: '',
  blockParser: (_text) => (
    segmenter({ text: _text, regex: /(.+\n)+?(\n+|$)(?=(.+|$))/g })
  ),
  blockJoiner: '',
  decorators: {
    embededHtml: [ /</g, "&lt;"], // same as default but overrideable
    // psuedoBlock: [ /(\n|.)+?(\n\n|$)/g, "<span class='pseudo-block $2'>$1</span>" ],
    h6: [ /(^###### +.*)/gm, "<h6>$1</h6>" ],
    h5: [ /(^##### +.*)/gm, "<h5>$1</h5>" ],
    h4: [ /(^#### +.*)/gm, "<h4>$1</h4>" ],
    h3: [ /(^### +.*)/gm, "<h3>$1</h3>" ],
    h2: [ /(^## +.*)/gm, "<h2>$1</h2>" ],
    h1: [ /(^# +.*)/gm, "<h1>$1</h1>" ],
    blockquote: [ /(^ *>+ +.*$)/gm, "<blockquote>$1</blockquote>" ],
    // li3: [ /(^ {6,}[+\-*]+ +.*$)/gm, "<li><li><li>$1</li></li></li>" ],
    // li2: [ /(^ {4,5}[+\-*]+ +.*$)/gm, "<li><li>$1</li></li>" ],
    // li1: [ /(^ {2,3}[+\-*]+ +.*$)/gm, "<li>$1</li>" ],
    li: [ /(^ *[+\-*]+ +.*$)/gm, "<ul><li>$1</li></ul>" ],
    // ul: [ /((^<li>.*<\/li>$)+)/gm, "<ul>$1</ul>" ],
    strong: [ /(\*\*.*\*\*|__.*__)/g, "<strong>$1</strong>" ],
    link: [ /(\[.*?\]\((.*?)\))/g, "<a href='$2' target='blank'>$1</a>" ],
    em: [ /(\*.*\*|_.*_)/g, "<em>$1</em>" ],
    strike: [ /(~~.*~~)/g, "<strike>$1</strike>" ],
  },
};