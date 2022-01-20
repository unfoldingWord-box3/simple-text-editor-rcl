import React from 'react';
import PropTypes from 'prop-types';

import { isRtl } from '../helpers/detectRTL';

export default function BlockEditor ({text, decorators, style, onText, onClick, editable, component, props}) {

  let dir = '';
  if (isRtl(text)) dir = 'rtl';

  let __html = text;
  if (Object.keys(decorators).length > 0) {
    Object.keys(decorators).forEach( (name) => {
      const [regex, replacer] = decorators[name];
      __html = __html.replace(regex, replacer);
    });
  };

  const editorProps = {
    contentEditable: editable,
    style,
    onClick,
    onBlur: (e) => { onText(e.target.textContent.replace(/&lt;/g, '<')) },
    dir,
    suppressContentEditableWarning: true,
    dangerouslySetInnerHTML: { __html },
    text,
    ...props,
  };

  return (<>{component(editorProps)}</>);
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
  /** Object of replacers for html/css decoration of text */
  decorators: PropTypes.object,
};

BlockEditor.defaultProps = {
  text: '',
  onText: (text) => { console.warn('BlockEditor.onText() not provided:\n\n', text); },
  editable: true,
  style: {whiteSpace: 'pre', padding: '1em'},
  component: ({ text, ...props}) => ( <div {...props} /> ),
  decorators: {
    embededHtml: [ /</g, "&lt;"],
  },
};