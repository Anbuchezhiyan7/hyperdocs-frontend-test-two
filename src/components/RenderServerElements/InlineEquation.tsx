import katex from 'katex';
import 'katex/dist/katex.min.css';

interface InlineEquationProps {
  block: any;
  index: number;
}

const InlineEquation = ({ block, index }: InlineEquationProps) => {
  // Add null checks for block and its properties
  if (!block || !block.children || !Array.isArray(block.children) || block.children.length === 0) return null;
  
  const paragraphContent = block.children.map((child: any, childIndex: number) => {
    // Add null checks for child
    if (!child) return '';
    
    if (child.type === 'inline_equation' && child.texExpression) {
      let html = '';
      try {
        html = katex.renderToString(child.texExpression, {
          displayMode: false,
          errorColor: '#000000',
          output: 'htmlAndMathml',
          strict: 'warn',
          throwOnError: false,
          trust: false,
        });
      } catch {
        html = `<span style="color:#000000">${child.texExpression}</span>`;
      }

      return (
        <span 
          key={childIndex} 
          className="inline-equation mx-1 align-baseline inline-block select-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    return child.text || '';
  });
  
  return (
    <p 
        key={index} 
        className="my-0 py-0.5 leading-relaxed"
        style={block.indent ? { marginLeft: `${block.indent * 24}px` } : {}}
    >
        {paragraphContent}
    </p>
  );
};

export default InlineEquation;
