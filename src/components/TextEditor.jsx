import React from 'react';
import PropTypes from 'prop-types';

export default function TextEditor ({text, style, onEdit, editable, component}) {

  const editorProps = {
    contentEditable: editable,
    style: { whiteSpace: 'pre', padding: '1em', ...style},
    onBlur: (e) => {onEdit(e.target.innerText)},
    dir: 'auto',
    dangerouslySetInnerHTML: { __html: text },
  };

  const editorComponent = component(editorProps);

  return (<>{editorComponent}</>);
};

TextEditor.propTypes = {
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

TextEditor.defaultProps = {
  text: '',
  onEdit: (text) => { console.warn('TextEditor.onEdit() not provided:\n\n', text); },
  editable: true,
  style: {},
  component: (props) => ( <div {...props} /> ),
};