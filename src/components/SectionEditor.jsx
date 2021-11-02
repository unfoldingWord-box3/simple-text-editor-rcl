import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareCallback } from 'use-deep-compare';

import BlockEditor from './BlockEditor';
import { isRtl } from '../helpers/detectRTL';

export default function SectionEditor ({
  text,
  onText,
  editable,
  headingComponent,
  blockComponent,
  blockable,
  blockParser,
  blockJoiner,
  onShow,
  show,
}) {
  const blocks = useMemo(() => (
    blockable ? blockParser(text) : [text]
  ), [blockable, blockParser, text]);

  const onBlockEdit = useDeepCompareCallback((block, index) => {
    let _blocks = [...blocks];
    _blocks[index] = block;
    const _text = _blocks.join(blockJoiner);
    onText(_text);
  }, [blocks, blockJoiner, onText]);


  const blockComponents = useMemo(() => {
    let _blockComponents = <></>;
    if (show) {
      _blockComponents = blocks.map((block, index) => {
        const blockProps = {
          text: block,
          component: blockComponent,
          onText: (_block) => { onBlockEdit(_block, index); },
          editable,
        };
        return <BlockEditor key={ block + index } {...blockProps} />;
      });
    };
    return _blockComponents;
  }, [blockComponent, blocks, editable, onBlockEdit, show]);


  const headingStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  let dir = 'auto';
  if (isRtl(text)) dir = 'rtl';
  
  return (
    <>
      {headingComponent({ dir, style: headingStyle, onClick: onShow, text: blocks[0] })}
      {blockComponents}
    </>
  )
};

SectionEditor.propTypes = {
  /** Text to be edited whether file, section or block */
  text: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onText: PropTypes.func,
  /** Editable? */
  editable: PropTypes.bool,
  /** Component to wrap the first line of a section */
  headingComponent: PropTypes.func,
  /** Component to be the block editor */
  blockComponent: PropTypes.func,
  /** Function to parse the text into blocks */
  blockParser: PropTypes.func,
  /** Parse text by blocks using blockParser */
  blockable: PropTypes.bool,
  /** String to join the blocks to text */
  blockJoiner: PropTypes.string,
  /** Function triggered on Heading click */
  onShow: PropTypes.func,
  /** Show this section */
  show: PropTypes.bool,
};

SectionEditor.defaultProps = {
  editable: true,
  headingComponent: (props) => (<h2 {...props}> {props.text}</h2>),
  blockComponent: (props) => (
    <div {...props} style={{ padding: '0 0.2em' }}></div>
  ),
  onText: (text) => { console.warn('SectionEditor.onText() not provided:\n\n', text); },
  blockable: true,
  blockJoiner: '\n',
  blockParser: (text) => (text.split('\n')),
  onShow: () => { console.warn('SectionEditor.onShow() not provided.'); },
  show: true,
  text: '',
};

