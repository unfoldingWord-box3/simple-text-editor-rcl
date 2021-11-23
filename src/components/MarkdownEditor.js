import React from 'react';

import DocumentEditor from './DocumentEditor';
import { segmenter } from '../helpers/segmenter';

export default function MarkdownEditor (props) {
  return <DocumentEditor {...props} />;
};

MarkdownEditor.propTypes = DocumentEditor.propTypes;

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
    segmenter({ text: _text, regex: /(.+\n)+?(\n+|$)?(?=(\n.+|$))/g })
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
    // blockquote: [ /(^ *> +.*$)/g, "<blockquote>$1</blockquote>" ],
    strong: [ /(\*\*.*\*\*|__.*__)/g, "<strong>$1</strong>" ],
    em: [ /(\*.*\*|_.*_)/g, "<em>$1</em>" ],
    strike: [ /(~~.*~~)/g, "<strike>$1</strike>" ],
  },
};