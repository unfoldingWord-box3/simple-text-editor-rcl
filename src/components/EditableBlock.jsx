/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

import useEditableBlockProps from '../hooks/useEditableBlockProps';

const DEFAULT_PROPS = {
  ...useEditableBlockProps.defaultProps,
  style: { whiteSpace: 'pre-wrap', padding: '1em' },
  components: {
    block: ({ content, ...props }) => (<div className='block' {...props} />),
  },
};

export default function EditableBlock({
  content,
  onContent,
  decorators,
  style,
  onClick,
  components: _components,
  options,
  ...props
}) {
  const components = { ...DEFAULT_PROPS.components, ..._components };

  const editableBlockProps = useEditableBlockProps({ content, onContent, decorators, options })

  const editorProps = {
    content,
    style,
    onClick,
    ...editableBlockProps,
    ...props
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