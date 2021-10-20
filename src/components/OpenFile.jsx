import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useFilePicker } from 'use-file-picker';

export default function OpenFile ({onFile}) {
  const [openFileSelector, { filesContent }] = useFilePicker({
    accept: '.md, .txt, .usfm', multiple: false, readAs: 'Text'
  });
  const openedFile = filesContent[0] || {};

  useEffect(() => {
    onFile({
      name: openedFile.name,
      content: openedFile.content,
      lastModified: openedFile.lastModified,
    });
  }, [onFile, openedFile.name, openedFile.content, openedFile.lastModified]);

  return (
    <button onClick={openFileSelector}>Open File</button>
  );
};

OpenFile.propTypes = {
  /** Function triggered on file open */
  onFile: PropTypes.func,
};

OpenFile.defaultProps = {
  component: (file) => {},
};