import React from 'react';

import EditableContent from './EditableContent';
import { segmenter } from '../helpers/segmenter';

export default function TableEditor(props) {
  return <EditableContent {...props} />;
};

TableEditor.propTypes = EditableContent.propTypes;

TableEditor.defaultProps = {
  documentComponent: ({ children, text, ...props }) => (
    <table className='document' {...props}>
      <th className='heading' {...props}>
        {
          text.split(`\n`)[0].split(`\t`).map(col => (
            <td className='text'>{col}</td>
          ))
        }
      </th>
      {children}
    </table>
  ),
  headingComponent: ({ text, dir, ...props }) => (
    <tr className={'heading ' + dir} dir={dir} {...props}>
      {
        text.split(`\n`)[0].split(`\t`).map(col => (
          <td className='text'>{col}</td>
        ))
      }
    </tr>
  ),
  sectionParser: (_text) => (
    segmenter({ text: _text, regex: /(.+?)(?=\n)/g })
  ),
  sectionComponent: ({ children, dir, ...props }) => (
    <tr className={'section ' + dir} dir={dir} {...props}>
      {children}
    </tr>
  ),
  sectionJoiner: '\n',
  blockParser: (_text) => (
    segmenter({ text: _text, regex: /(.+?)(?=\t)/g })
  ),
  blockComponent: (_props) => (
    <td className='block' {..._props} style={{ whiteSpace: 'pre-wrap' }}></td>
  ),
  blockJoiner: '\t',
  decorators: {
    embededHtml: [/</g, "&lt;"], // same as default but overrideable
    cell: [/(.+?)(\t)/g, "<span className='pseudo-block $2'>$1</span>"],
    h6: [/(^###### +.*)/gm, "<h6>$1</h6>"],
  },
};