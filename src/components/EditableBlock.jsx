/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

import { isRtl } from '../helpers/detectRTL';

const DEFAULT_PROPS = {
  content: '',
  onContent: (content) => { console.warn('EditableBlock.onContent() not provided:\n\n', content); },
  options: {
    editable: true,
  },
  style: { whiteSpace: 'pre-wrap', padding: '1em' },
  components: {
    block: ({ content, ...props }) => (<div className='block' {...props} />),
  },
  decorators: {},
};

export default function EditableBlock({
  content,
  onContent,
  decorators,
  style,
  onClick,
  components: _components,
  options: _options,
  ...props
}) {
  const components = { ...DEFAULT_PROPS.components, ..._components };
  const options = { ...DEFAULT_PROPS.options, ..._options };

  let dir = '';

  if (isRtl(content)) dir = 'rtl';

  let __html = content;

  if (!options.returnHtml) {
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

    if (options.returnHtml) _content = event.target.innerHTML;

    if (!options.returnHtml) _content = event.target.textContent.replace(/&lt;/g, '<');

    onContent(_content);
  };

  const editorProps = {
    contentEditable: options.editable,
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
      {components.block(editorProps)}
    </>
  );
};

EditableBlock.propTypes = {
  /** Text to be edited whether file, section or block */
  content: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onContent: PropTypes.func,
  /** Options for the editor */
  options: PropTypes.shape({
    /** Editable? */
    editable: PropTypes.bool,
    /** Return html instead of text */
    returnHtml: PropTypes.bool,
  }),
  /** Components to wrap all sections of the document */
  components: PropTypes.shape({
    /** Component to be the block editor */
    block: PropTypes.func,
  }),
  /** Object of replacers for html/css decoration of text */
  decorators: PropTypes.object,
  /** Callback triggered on Block click, provides block text and index. */
  onClick: PropTypes.func,
  /** css styles for the editable component */
  style: PropTypes.object,
};

EditableBlock.defaultProps = DEFAULT_PROPS;