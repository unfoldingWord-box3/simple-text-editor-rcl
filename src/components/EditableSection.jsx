/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareCallback } from 'use-deep-compare';
import md5 from 'md5';

import { isRtl } from '../helpers/detectRTL';
import EditableBlock from './EditableBlock';

export default function EditableSection({
  content,
  onContent,
  returnHtml,
  editable,
  sectionable,
  index,
  sectionComponent,
  sectionBodyComponent,
  headingComponent,
  blockComponent,
  blockable,
  blockParser,
  blockJoiner,
  onBlockClick,
  onShow,
  show,
  decorators,
}) {
  let dir = '';

  if (isRtl(content)) dir = 'rtl';

  const blocks = useMemo(() => (
    blockable ? blockParser(content) : [content]
  ), [blockable, blockParser, content]);

  const onBlockEdit = useDeepCompareCallback((block, index) => {
    let _blocks = [...blocks];
    _blocks[index] = block;
    const _content = _blocks.join(blockJoiner);
    onContent(_content);
  }, [blocks, blockJoiner, onContent]);

  let blockComponents = <></>;

  if (show) {
    blockComponents = blocks.map((block, index) => {
      const blockProps = {
        content: block,
        component: blockComponent,
        onContent: (_block) => { onBlockEdit(_block, index); },
        returnHtml,
        editable,
        onClick: () => { onBlockClick({ content: block, index }); },
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

  if (sectionable) {
    children.push(headingComponent({ dir, style: headingStyle, show, onClick: onShow, content, index, key: `heading-${md5(index + content)}` }));
  };

  children.push(sectionBodyComponent({ dir, children: blockComponents, index, key: `body-${md5(index + content)}` }));

  return (
    <>
      {sectionComponent({ dir, children, index })}
    </>
  );
};

EditableSection.propTypes = {
  /** content to be edited whether file, section or block */
  content: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onContent: PropTypes.func,
  /** Return html instead of text */
  returnHtml: PropTypes.bool,
  /** Editable? */
  editable: PropTypes.bool,
  /** Parse content by sections using sectionParser */
  sectionable: PropTypes.bool,
  /** Component to be the section wrapper */
  sectionComponent: PropTypes.func,
  /** Component to be the section body */
  sectionBodyComponent: PropTypes.func,
  /** Component to wrap the first line of a section */
  headingComponent: PropTypes.func,
  /** Component to be the block editor */
  blockComponent: PropTypes.func,
  /** Function to parse the content into blocks */
  blockParser: PropTypes.func,
  /** Parse content by blocks using blockParser */
  blockable: PropTypes.bool,
  /** String to join the blocks to content */
  blockJoiner: PropTypes.string,
  /** Callback triggered on Block click, provides block content and index. */
  onBlockClick: PropTypes.func.isRequired,
  /** Function triggered on Heading click */
  onShow: PropTypes.func,
  /** Show this section */
  show: PropTypes.bool,
  /** Object of replacers for html/css decoration of content, done at block level */
  decorators: PropTypes.object,
};

EditableSection.defaultProps = {
  editable: true,
  sectionComponent: ({ children, dir, ...props }) => (<div className={'section ' + dir} dir={dir} {...props}>{children}</div>),
  headingComponent: ({ show, content, ...props }) => (<h2 className='heading' {...props}>{content}</h2>),
  sectionBodyComponent: ({ children, ...props }) => (<div className='body' {...props}>{children}</div>),
  onContent: (content) => { console.warn('EditableSection.onContent() not provided:\n\n', content); },
  blockable: true,
  blockJoiner: '\n',
  blockParser: (content) => (content.split('\n')),
  onBlockClick: ({ content, index }) => { console.warn('EditableSection.onBlockClick({content, index}) not provided.\n\n', index); },
  onShow: () => { console.warn('EditableSection.onShow() not provided.'); },
  show: true,
  content: '',
};

