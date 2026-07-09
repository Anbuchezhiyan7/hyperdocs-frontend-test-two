import katex from 'katex';
import 'katex/dist/katex.min.css';

interface EquationProps {
  block: any;
  index: number;
}

const Equation = ({ block, index }: EquationProps) => {
  // Add null checks for block and its properties
  if (!block || !block.texExpression) return null;

  let html = '';
  try {
    html = katex.renderToString(block.texExpression, {
      displayMode: true,
      errorColor: '#cc0000',
      output: 'htmlAndMathml',
      strict: 'warn',
      throwOnError: false,
      trust: false,
    });
  } catch {
    html = `<span style="color:#cc0000">${block.texExpression}</span>`;
  }
  
  return (
    <div 
      key={index} 
      className="equation-block my-2 flex justify-center overflow-x-auto overflow-y-hidden py-4 select-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Equation;
