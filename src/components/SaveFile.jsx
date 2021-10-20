import React from 'react';
import PropTypes from 'prop-types';

import fileDownload from 'js-file-download';

export default function SaveFile ({file}) {

  const save = () => {
    fileDownload(file.content, file.name);
  };

  return (
    <button onClick={save}>Save File</button>
  );
};

SaveFile.propTypes = {
  /** Preload file content if need to file open bypass */
  file: PropTypes.object,
};

SaveFile.defaultProps = {
  file: '',
};