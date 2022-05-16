/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

import { isRtl } from '../helpers/detectRTL';

export default function EditableBlock({
  content,
  decorators,
  style,
  onContent,
  returnHtml,
  onClick,
  editable,
  component,
  ...props
}) {

  let dir = '';

  if (isRtl(content)) dir = 'rtl';

  let __html = content;

  if (!returnHtml) {
    decorators = {
      embededHtml: [/</g, "&lt;"],
      ...decorators
    };
  };

  if (Object.keys(decorators).length > 0) {
    Object.keys(decorators).forEach((name) => {
      const [regex, replacer] = decorators[name];
      __html = __html.replace(regex, replacer);
    });
  };

  const onBlur = (event) => {
    let _content;

    if (returnHtml) _content = event.target.innerHTML;

    if (!returnHtml) _content = event.target.textContent.replace(/&lt;/g, '<');

    onContent(_content);
  };

  const editorProps = {
    contentEditable: editable,
    style,
    onClick,
    onBlur,
    dir,
    suppressContentEditableWarning: true,
    dangerouslySetInnerHTML: { __html },
    content,
    ...props,
  };

  return (
    <>
      {component(editorProps)}
    </>
  );
};

EditableBlock.propTypes = {
  /** Text to be edited whether file, section or block */
  content: PropTypes.string.isRequired,
  /** Callback triggered on Block click, provides block text and index. */
  onClick: PropTypes.func,
  /** Function triggered on edit */
  onContent: PropTypes.func,
  /** Return html instead of text */
  returnHtml: PropTypes.bool,
  /** Editable? */
  editable: PropTypes.bool,
  /** Component to wrap the editor */
  component: PropTypes.func,
  /** css styles for the editable component */
  style: PropTypes.object,
  /** Object of replacers for html/css decoration of text */
  decorators: PropTypes.object,
};

EditableBlock.defaultProps = {
  content: '',
  onContent: (content) => { console.warn('EditableBlock.onContent() not provided:\n\n', content); },
  editable: true,
  style: { whiteSpace: 'pre-wrap', padding: '1em' },
  component: ({ content, ...props }) => (<div className='block' {...props} />),
  decorators: {},
};