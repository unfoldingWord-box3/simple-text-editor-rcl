import React from 'react';

import DocumentEditor from './DocumentEditor';
import { segmenter } from '../helpers/segmenter';

import './Usfm.css';

export default function UsfmEditor (props) {
  return <DocumentEditor {...props} />;
};

UsfmEditor.propTypes = DocumentEditor.propTypes;

UsfmEditor.defaultProps = {
  headingComponent: ({ text, ...props }) => (
    <div class='heading' {...props}>
      <span class='text'>{text.replace(/^\n+/, '').split('\n')[0]}</span>
    </div>
  ),
  blockComponent: (_props) => (
    <><div class='block' {..._props} style={{width: '100%', whiteSpace: 'pre-wrap'}} /></>
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
    embededHtml: [ /</g, "&lt;"], // same as default but overrideable
    psuedoBlock: [ /(\\([cspv])(\n|.|$)+?)(?=(\\[cspv]|$))/g, "<span class='pseudo-block $2'>$1</span>" ],
    footnotes: [ /(\\f (.|\n)+?(\\f\*))/g, "<span class='footnote'>$1</span>" ],
    endnotes: [ /(\\fe (.|\n)+?(\\fe\*))/g, "<span class='endnote'>$1</span>" ],
    markers: [
      /(\\([\w-]*)\** *)(\d*-?\d*)(?=[^:.])/g,
      "<span class='marker $2'>$1<span class='digit'>$3</span></span>"
    ],
    attributes: [ /(x?-?[\w-]+=".*")/g, "<span class='attribute'>$1</span>" ],
  },
};