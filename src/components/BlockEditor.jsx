import React from 'react';
import PropTypes from 'prop-types';

import { isRtl } from '../helpers/detectRTL';

export default function BlockEditor ({text, style, onText, editable, component}) {

  let dir = 'auto';
  if (isRtl(text)) dir = 'rtl';

  const editorProps = {
    contentEditable: editable,
    style,
    onBlur: (e) => {onText(e.target.innerText)},
    dir,
    dangerouslySetInnerHTML: { __html: text },
  };

  const editorComponent = component(editorProps);

  return (<>{editorComponent}</>);
};

BlockEditor.propTypes = {
  /** Text to be edited whether file, section or block */
  text: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onText: PropTypes.func,
  /** Editable? */
  editable: PropTypes.bool,
  /** Component to wrap the editor */
  component: PropTypes.func,
  /** css styles for the editable component */
  style: PropTypes.object,
};

BlockEditor.defaultProps = {
  text: '',
  onText: (text) => { console.warn('BlockEditor.onText() not provided:\n\n', text); },
  editable: true,
  style: {whiteSpace: 'pre', padding: '1em'},
  component: (props) => ( <div {...props} /> ),
};