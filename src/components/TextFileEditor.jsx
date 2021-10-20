import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import OpenFile from './OpenFile';
import SaveFile from './SaveFile';
import TextEditor from './TextEditor';

export default function TextFileEditor ({file, onFile, editable}) {
  const initialState = file || {
    name: undefined, content: undefined, lastModified: undefined
  };
  const [state, setState] = useState(initialState);

  const onEdit = useCallback((text) => {
    setState({
      name: state.name,
      content: text,
      lastModified: state.lastModified,
    });
  }, [state.name, state.lastModified]);

  const textEditor = useMemo(() => {
    return <TextEditor text={state.content} onEdit={onEdit} editable={editable} />
  }, [state.content, onEdit, editable]);

  return (
    <>
      
      <h2 style={{textAlign: 'center'}}>
        <OpenFile onFile={setState} />
        <span style={{margin: '0 2em'}}>{state.name}</span>
        <SaveFile file={state} />
      </h2>
      <hr />
      {textEditor}
    </>
  );
};

TextFileEditor.propTypes = {
  /** Preload file content if need to file open bypass */
  file: PropTypes.object,
  /** Function triggered on file open */
  onFile: PropTypes.func,
  /** Editable? */
  editable: PropTypes.bool,
};

TextFileEditor.defaultProps = {
  file: {},
  onFile: (file) => {},
};