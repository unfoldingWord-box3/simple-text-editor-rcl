/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';
import md5 from 'md5';

import { isRtl } from '../helpers/detectRTL';
import EditableBlock from './EditableBlock';

const DEFAULT_PROPS = {
  content: '',
  onContent: (content) => { console.warn('EditableSection.onContent() not provided:\n\n', content); },
  options: {
    blockable: true,
    editable: true,
  },
  components: {
    section: ({ children, dir, ...props }) => (<div className={'section ' + dir} dir={dir} {...props}>{children}</div>),
    sectionHeading: ({ show, content, ...props }) => (<h2 className='sectionHeading' {...props}>{content}</h2>),
    sectionBody: ({ children, ...props }) => (<div className='sectionBody' {...props}>{children}</div>),
  },
  handlers: {
    onBlockClick: ({ content, index }) => { console.warn('EditableSection.onBlockClick({content, index}) not provided.\n\n', index); },
  },
  parsers: {
    block: (content) => (content.split('\n')),
  },
  joiners: {
    block: '\n',
  },
  show: true,
  onShow: () => { console.warn('EditableSection.onShow() not provided.'); },
};

export default function EditableSection({
  content,
  onContent,
  parsers,
  joiners,
  decorators,
  index,
  onShow,
  show,
  ...props
}) {
  const components = { ...DEFAULT_PROPS.components, ...props.components };
  const options = { ...DEFAULT_PROPS.options, ...props.options };
  const handlers = { ...DEFAULT_PROPS.handlers, ...props.handlers };

  let dir = '';

  if (isRtl(content)) dir = 'rtl';

  const blocks = useDeepCompareMemo(() => (
    options.blockable ? parsers.block(content) : [content]
  ), [options, parsers, content]);

  const onBlockEdit = useDeepCompareCallback((block, index) => {
    let _blocks = [...blocks];
    _blocks[index] = block;
    const _content = _blocks.join(joiners.block);
    onContent(_content);
  }, [blocks, joiners, onContent]);

  let blockComponents = <></>;

  if (show) {
    blockComponents = blocks.map((block, index) => {
      const blockProps = {
        content: block,
        components,
        options,
        onContent: (_block) => { onBlockEdit(_block, index); },
        onClick: () => { handlers.onBlockClick({ content: block, index }); },
        decorators,
      };
      return <EditableBlock key={`block-${md5(index + block)}`} {...blockProps} />;
    });
  };

  const headingStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    contentOverflow: 'ellipsis',
  };

  const children = [];

  if (options.sectionable) {
    children.push(components.sectionHeading({ dir, style: headingStyle, show, onClick: onShow, content, index, key: `heading-${md5(index + content)}` }));
  };

  children.push(components.sectionBody({ dir, children: blockComponents, index, key: `body-${md5(index + content)}` }));

  return (
    <>
      {components.section({ dir, children, index })}
    </>
  );
};

EditableSection.propTypes = {
  /** Text to be edited whether file, section or block */
  content: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onContent: PropTypes.func,
  /** Options for the editor */
  options: PropTypes.shape({
    /** Parse content by sections using sectionParser */
    sectionable: PropTypes.bool,
    /** Parse content by blocks using blockParser */
    blockable: PropTypes.bool,
    /** Editable? */
    editable: PropTypes.bool,
    /** Return html instead of text */
    returnHtml: PropTypes.bool,
  }),
  /** Components to wrap all sections of the document */
  components: PropTypes.shape({
    /** Component to be the section wrapper */
    section: PropTypes.func,
    /** Component to wrap the first line of a section */
    sectionHeading: PropTypes.func,
    /** Component to be the section body */
    sectionBody: PropTypes.func,
    /** Component to be the block editor */
    block: PropTypes.func,
  }),
  /** Functions to parse the content into sections and blocks */
  parsers: PropTypes.shape({
    /** Function to parse the content into blocks */
    block: PropTypes.func,
  }),
  /** Strings to join the blocks to content */
  joiners: PropTypes.shape({
    /** String to join the blocks to content */
    block: PropTypes.string,
  }),
  /** Object of replacers for html/css decoration of content, done at block level */
  decorators: PropTypes.object,
  /** Callback handlers such as block and section click */
  handlers: PropTypes.shape({
    /** Callback triggered on Block click, provides block content and index. */
    onBlockClick: PropTypes.func,
  }),
};

EditableSection.defaultProps = DEFAULT_PROPS;

