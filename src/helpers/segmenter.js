export const segmenter = ({text, regex}) => {
  let segments = [text];
  segments = [];
  var match = regex.exec(text);
  while (match !== null) {
    // console.log(`match(${regex}): `, match[0]);
    const segment = match[0];
    segments = [...segments, segment];
    match = regex.exec(text);
  };
  return segments;
};