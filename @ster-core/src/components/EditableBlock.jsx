/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import useEditableBlockProps from '../hooks/useEditableBlockProps';
import EditableContextMenu from './EditableContextMenu';

const DEFAULT_PROPS = {
  ...useEditableBlockProps.defaultProps,
  style: { whiteSpace: 'pre-wrap', padding: '1em' },
  components: {
    block: ({ content, verbose, ...props }) => (<div className='block' {...props} />),
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
  index,
  verbose = false,
  ...props
}) {
  const components = { ...DEFAULT_PROPS.components, ..._components };
  const { block: Block } = components || {};

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (verbose) console.log('EditableBlock First Render'); }, []);

  const { editIndex, save, ...editableBlockProps } = useEditableBlockProps({ content, onContent, decorators, options });

  const blockProps = {
    content,
    style,
    onClick,
    index,
    verbose,
    ...editableBlockProps,
    ...props
  };

  return (
    <EditableContextMenu components={components} save={save}>
      <Block key={editIndex + content} {...blockProps} />
    </EditableContextMenu>
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
  /** Index to use and reference for rendering */
  index: PropTypes.number,
  /** Flag to enable logging  */
  verbose: PropTypes.bool,
};

EditableBlock.defaultProps = DEFAULT_PROPS;