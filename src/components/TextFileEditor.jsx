import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import OpenFile from './OpenFile';
import SaveFile from './SaveFile';
import TextEditor from './TextEditor';

export default function TextFileEditor ({file, onFile}) {
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
    return <TextEditor text={state.content} onEdit={onEdit} />
  }, [state.content, onEdit]);

  const saveFile = useMemo(() => {
    let component = <></>;
    if (state.name && state.content) {
      const _file = { name: state.name, content: state.content, lastModified: state.lastModified };
      component = <SaveFile file={_file} />;
    }
    return component;
  }, [state.name, state.content, state.lastModified]);

  return (
    <>
      <OpenFile onFile={setState} />
      <h2>{state.name}</h2>
      {saveFile}
      {textEditor}
    </>
  );
};

TextFileEditor.propTypes = {
  /** Preload file content if need to file open bypass */
  file: PropTypes.object,
  /** Function triggered on file open */
  onFile: PropTypes.func,
};

TextFileEditor.defaultProps = {
  file: {},
  onFile: (file) => {},
};