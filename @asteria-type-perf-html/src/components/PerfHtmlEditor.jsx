/* eslint-disable react/prop-types */
import React, { useCallback, useState, useMemo } from "react";
import { useDeepCompareCallback, useDeepCompareMemo } from "use-deep-compare";

import { embedPreviewTextInGrafts } from "../core/nestPerf";
import { getTypeFromSequenceHtml } from "../core/getType";
import Block from "./Block";

import SequenceEditor from "./SequenceHtmlEditor";

export default function PerfHtmlEditor({
  sequenceId,
  addSequenceId,
  options,
  perfHtml,
  onPerfHtml,
  components,
}) {
  const [sectionIndices, setSectionIndices] = useState({});

  const sequenceHtml = useDeepCompareMemo(() => (
    embedPreviewTextInGrafts({ perfHtml, sequenceId })
  ), [perfHtml, sequenceId]);

  const sequenceType = useMemo(() => getTypeFromSequenceHtml({ sequenceHtml }), [sequenceHtml]);

  const sectionIndex = useDeepCompareMemo(() => (
    sectionIndices[sequenceId] || 0
  ), [sectionIndices, sequenceId]);

  // eslint-disable-next-line no-unused-vars
  const onSectionClick = useDeepCompareCallback(({ content: _content, index }) => {
    let _sectionIndices = { ...sectionIndices };
    _sectionIndices[sequenceId] = index;
    setSectionIndices(_sectionIndices);
  }, [setSectionIndices, sectionIndices]);

  // eslint-disable-next-line no-unused-vars
  const onBlockClick = useCallback(({ content: _content, element }) => {
    const _sequenceId = element?.dataset?.target;

    if (_sequenceId) {
      addSequenceId(_sequenceId);
    };
  }, [addSequenceId]);

  const onContentHandler = useCallback((_content) => {
    if (sequenceHtml !== _content) {
      onPerfHtml({ sequenceId, sequenceHtml: _content });
    };
  }, [onPerfHtml, sequenceHtml, sequenceId]);


  const props = {
    content: sequenceHtml,
    onContent: onContentHandler,
    components: {
      ...components,
      sectionHeading: (props) => components.sectionHeading({ type: sequenceType, ...props }),
      block: Block,
    },
    options,
    handlers: {
      onSectionClick,
      onBlockClick
    },
    decorators: {},
    sectionIndex,
  };

  return (
    <div className="PerfHtmlEditor" key={sequenceId}>
      <SequenceEditor key={sequenceId} {...props} />
    </div>
  );
};
