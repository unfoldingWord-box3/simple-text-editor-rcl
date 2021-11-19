import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareCallback } from 'use-deep-compare';

import BlockEditor from './BlockEditor';
import { isRtl } from '../helpers/detectRTL';

export default function SectionEditor ({
  text,
  onText,
  editable,
  sectionComponent,
  headingComponent,
  blockComponent,
  blockable,
  blockParser,
  blockJoiner,
  onBlockClick,
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
          onClick: () => { onBlockClick({text: block, index}); },
        };
        return <BlockEditor key={ block + index } {...blockProps} />;
      });
    };
    return _blockComponents;
  }, [blockComponent, blocks, onBlockClick, editable, onBlockEdit, show]);

  const headingStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  let dir = '';
  if (isRtl(text)) dir = 'rtl';

  const children = (<>
    {headingComponent({ dir, style: headingStyle, onClick: onShow, text })}
    {blockComponents}
  </>);
  
  return (<>
    {sectionComponent({dir, children})}
  </>);
};

SectionEditor.propTypes = {
  /** Text to be edited whether file, section or block */
  text: PropTypes.string.isRequired,
  /** Function triggered on edit */
  onText: PropTypes.func,
  /** Editable? */
  editable: PropTypes.bool,
  /** Component to be the section wrapper */
  sectionComponent: PropTypes.func,
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
  /** Callback triggered on Block click, provides block text and index. */
  onBlockClick: PropTypes.func.isRequired,
  /** Function triggered on Heading click */
  onShow: PropTypes.func,
  /** Show this section */
  show: PropTypes.bool,
};

SectionEditor.defaultProps = {
  editable: true,
  sectionComponent: ({children, ...props}) => (<div class='section' {...props}>{children}</div>),
  headingComponent: (props) => (<h2 class='heading' {...props}>{props.text}</h2>),
  onText: (text) => { console.warn('SectionEditor.onText() not provided:\n\n', text); },
  blockable: true,
  blockJoiner: '\n',
  blockParser: (text) => (text.split('\n')),
  onBlockClick: ({text, index}) => { console.warn('SectionEditor.onBlockClick({text, index}) not provided.\n\n', index); },
  onShow: () => { console.warn('SectionEditor.onShow() not provided.'); },
  show: true,
  text: '',
};
