import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareCallback } from 'use-deep-compare';

import BlockEditor from './BlockEditor';
import { isRtl } from '../helpers/detectRTL';

export default function SectionEditor ({
  text,
  onText,
  editable,
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
  if (isRtl(text)) dir = 'rtl';

  const blocks = useMemo(() => (
    blockable ? blockParser(text) : [text]
  ), [blockable, blockParser, text]);

  const onBlockEdit = useDeepCompareCallback((block, index) => {
    let _blocks = [...blocks];
    _blocks[index] = block;
    const _text = _blocks.join(blockJoiner);
    onText(_text);
  }, [blocks, blockJoiner, onText]);

  let blockComponents = <></>;
  if (show) {
    blockComponents = blocks.map((block, index) => {
      const blockProps = {
        text: block,
        component: blockComponent,
        onText: (_block) => { onBlockEdit(_block, index); },
        editable,
        onClick: () => { onBlockClick({text: block, index}); },
        decorators,
      };
      return <BlockEditor key={ block + index } {...blockProps} />;
    });
  };

  const headingStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const children = (<>
    {headingComponent({ dir, style: headingStyle, onClick: onShow, text, index })}
    {sectionBodyComponent({ dir, children: blockComponents, index }) }
  </>);
  
  return (<>
    {sectionComponent({ dir, children, index })}
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
  /** Component to be the section body */
  sectionBodyComponent: PropTypes.func,
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
  /** Object of replacers for html/css decoration of text, done at block level */
  decorators: PropTypes.object,
};

SectionEditor.defaultProps = {
  editable: true,
  sectionComponent: ({children, dir, ...props}) => (<div class={ 'section ' + dir } dir={dir} {...props}>{children}</div>),
  headingComponent: (props) => (<h2 class='heading' {...props}>{props.text}</h2>),
  sectionBodyComponent: ({children, ...props}) => (<div class='body' {...props}>{children}</div>),
  onText: (text) => { console.warn('SectionEditor.onText() not provided:\n\n', text); },
  blockable: true,
  blockJoiner: '\n',
  blockParser: (text) => (text.split('\n')),
  onBlockClick: ({text, index}) => { console.warn('SectionEditor.onBlockClick({text, index}) not provided.\n\n', index); },
  onShow: () => { console.warn('SectionEditor.onShow() not provided.'); },
  show: true,
  text: '',
};

