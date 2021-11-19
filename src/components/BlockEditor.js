import React from 'react';
import PropTypes from 'prop-types';

import { isRtl } from '../helpers/detectRTL';

export default function BlockEditor ({text, style, onText, onClick, editable, component}) {

  let dir = '';
  if (isRtl(text)) dir = 'rtl';

  const editorProps = {
    contentEditable: editable,
    style,
    onClick,
    onBlur: (e) => { onText(e.target.innerText.replace(/&lt;/g, '<')) },
    dir,
    suppressContentEditableWarning: true,
    dangerouslySetInnerHTML: { __html: text.replace(/</g, '&lt;') },
    text,
  };

  const editorComponent = component(editorProps);

  return (<>{editorComponent}</>);
};

BlockEditor.propTypes = {
  /** Text to be edited whether file, section or block */
  text: PropTypes.string.isRequired,
  /** Callback triggered on Block click, provides block text and index. */
  onClick: PropTypes.func,
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