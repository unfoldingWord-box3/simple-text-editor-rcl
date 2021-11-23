import React from 'react';

import DocumentEditor from './DocumentEditor';
import { segmenter } from '../helpers/segmenter';

export default function UsfmDocumentEditor (props) {
  return <DocumentEditor {...props} />;
};

UsfmDocumentEditor.propTypes = DocumentEditor.propTypes;

UsfmDocumentEditor.defaultProps = {
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
    markers: [
      /(\\([\w-]*)\** *)(\d*-?\d*)(?=[^:.])/g,
      "<span class='marker $2'>$1<span class='digit'>$3</span></span>"
    ],
    attributes: [ /(x?-?[\w-]+=".*")/g, "<span class='attribute'>$1</span>" ],
  },
};