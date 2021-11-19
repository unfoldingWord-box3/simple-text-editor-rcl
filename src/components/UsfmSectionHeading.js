export default function SectionHeading ({ text, onSection, ...props }) {
  
  const onClick = (e) => {
    if (onSection) {
      const regex = /\\c *(\d+)/;
      const _text = e.target.innerText;
      const match = regex.exec(_text);
      const chapter = match && match[1];
      onSection && onSection(chapter);
    }
  };

  const headingText = text.replace(/^\n+/, '').split('\n')[0];

  return (
    <div {...props}>
      <button onClick={onClick}>{headingText}</button>
      <hr />
    </div>
  );
};