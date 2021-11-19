import React from 'react';

import DocumentEditor from './DocumentEditor';
import UsfmBlockEditor from './UsfmBlockEditor';
import UsfmSectionHeading from './UsfmSectionHeading';
import { segmenter } from '../helpers/segmenter';

export default function UsfmDocumentEditor (props) {
  return <DocumentEditor {...props} />;
};

UsfmDocumentEditor.propTypes = DocumentEditor.propTypes;

UsfmDocumentEditor.defaultProps = {
  headingComponent: (_props) => (<UsfmSectionHeading {..._props} />),
  blockComponent: (_props) => (<UsfmBlockEditor {..._props} />),
  sectionParser: (_text) => (
    segmenter({ text: _text, regex: /(^|\\c +\d+)(\n|.)+?(\n|$)?(?=(\\c +\d+|$))/g })
  ),
  sectionJoiner: '',
  blockParser: (_text) => (
    segmenter({ text: _text, regex: /(^|\\[cspv])(\n|.)+?(\n|$)?(?=(\\[cspv]|$))/g })
  ),
  blockJoiner: '',
};