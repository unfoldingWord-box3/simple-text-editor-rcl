import PropTypes from 'prop-types';

export default function BlockEditor ({ text, dangerouslySetInnerHTML, ...props }) {

  const editorStyle = {
    width: '100%',
    whiteSpace: 'pre-wrap',
    padding: '0 0.2em'
  };

  const decorators = [
    {
      name: 'embededHtml',
      regex: /</g,
      replacer: "&lt;",
    },
    {
      name: 'block',
      regex: /(\\([cspv])(\n|.|$)+?)(?=(\\[cspv]|$))/g,
      replacer: "<div class='block $2'>$1</div>"
    },
    {
      name: 'markers',
      regex: /(\\([\w-]*)\** *)(\d*-?\d*)(?=[^:.])/g,
      replacer: "<span class='marker $2'>$1<span class='digit'>$3</span></span>",
    },
    {
      name: 'attributes',
      regex: /(x?-?[\w-]+=".*")/g,
      replacer: "<span class='attribute'>$1</span>",
    },
  ];

  let __html = text;
  decorators.forEach( ({ name, regex, replacer }) => {
    __html = __html.replace(regex, replacer);
  });
  
  return (
    <>
      <div
        {...props}
        style={editorStyle}
        dangerouslySetInnerHTML={{ __html }}
      >
      </div>
      <hr />
    </>
  );
};

BlockEditor.propTypes = {
  /** Function called when block is clicked and verse returned*/
  onBlockClick: PropTypes.func,
  /** String of text for the block. */
  text: PropTypes.string,
  /** HTML Attribute for setting editable loop. */
  dangerouslySetInnerHTML: PropTypes.object,
}

BlockEditor.defaultProps = {
  text: '',
};