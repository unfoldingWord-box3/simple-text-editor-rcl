import React from 'react';
import PropTypes from 'prop-types';

import { isRtl } from '../helpers/detectRTL';

export default function BlockEditor ({text, style, onEdit, editable, component}) {

  let dir = 'auto';
  if (isRtl(text)) dir = 'rtl';

  const editorProps = {
    contentEditable: editable,
    style,
    onBlur: (e) => {onEdit(e.target.innerText)},
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
  onEdit: PropTypes.func,
  /** Editable? */
  editable: PropTypes.bool,
  /** Component to wrap the editor */
  component: PropTypes.func,
  /** css styles for the editable component */
  style: PropTypes.object,
};

BlockEditor.defaultProps = {
  text: '',
  onEdit: (text) => { console.warn('BlockEditor.onEdit() not provided:\n\n', text); },
  editable: true,
  style: {whiteSpace: 'pre', padding: '1em'},
  component: (props) => ( <div {...props} /> ),
};