import React from 'react';

import DocumentEditor from './DocumentEditor';
import { segmenter } from '../helpers/segmenter';

export default function TableEditor (props) {
  return <DocumentEditor {...props} />;
};

TableEditor.propTypes = DocumentEditor.propTypes;

TableEditor.defaultProps = {
  documentComponent: ({children, text, ...props}) => (
    <table class='document' {...props}>
      <th class='heading' {...props}>
        {
          text.split(`\n`)[0].split(`\t`).map(col => (
            <td class='text'>{col}</td>
          ))
        }
      </th>
      {children}
    </table>
  ),
  headingComponent: ({text, dir, ...props}) => (
    <tr class={ 'heading ' + dir } dir={dir} {...props}>
      {
        text.split(`\n`)[0].split(`\t`).map(col => (
          <td class='text'>{col}</td>
        ))
      }
    </tr>
  ),
  sectionParser: (_text) => (
    segmenter({ text: _text, regex: /(.+?)(?=\n)/g })
  ),
  sectionComponent: ({children, dir, ...props}) => (
    <tr class={ 'section ' + dir } dir={dir} {...props}>
      {children}
    </tr>
  ),
  sectionJoiner: '\n',
  blockParser: (_text) => (
    segmenter({ text: _text, regex: /(.+?)(?=\t)/g })
  ),
  blockComponent: (_props) => (
    <td class='block' {..._props} style={{whiteSpace: 'pre-wrap'}}></td>
  ),
  blockJoiner: '\t',
  decorators: {
    embededHtml: [ /</g, "&lt;"], // same as default but overrideable
    cell: [ /(.+?)(\t)/g, "<span class='pseudo-block $2'>$1</span>" ],
    h6: [ /(^###### +.*)/gm, "<h6>$1</h6>" ],
  },
};