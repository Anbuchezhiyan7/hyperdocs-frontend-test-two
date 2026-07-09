interface ColumnGroupProps {
  block: any;
  index: number;
}

const ColumnGroup = ({ block, index }: ColumnGroupProps) => {
  // Add null checks for block and its properties
  if (!block || !block.children || !Array.isArray(block.children) || block.children.length === 0) return null;
  
  const renderColumn = (column: any, columnIndex: number) => {
    // Add null checks for column and its properties
    if (!column || !column.children || !Array.isArray(column.children)) return null;
    
    const columnContent = column.children.map((child: any, childIndex: number) => {
      // Add null checks for child
      if (!child) return null;
      
      if (child.type === 'p' && child.children) {
        // Add null checks for nested children
        if (!Array.isArray(child.children)) return null;
        
        const text = child.children
          .map((textChild: any) => textChild && textChild.text ? textChild.text : '')
          .filter((text: any) => text !== '')
          .join('');
        
        return text ? <p key={childIndex} className="my-0 py-0.5">{text}</p> : null;
      }
      return child.text || '';
    }).filter((content: any) => content !== null && content !== '');
    
    // Only render column if it has valid content
    if (columnContent.length === 0) return null;
    
    return (
      <div 
        key={columnIndex} 
        className="column" 
        style={{ width: column.width || 'auto' }}
      >
        {columnContent}
      </div>
    );
  };
  
  const columns = block.children.map((column: any, columnIndex: number) => {
    if (column.type === 'column') {
      return renderColumn(column, columnIndex);
    }
    return null;
  }).filter((column: any) => column !== null);
  
  // Only render column group if it has valid columns
  if (columns.length === 0) return null;
  
  return (
    <div key={index} className="column-group" style={{ display: 'flex', gap: '16px' }}>
      {columns}
    </div>
  );
};

export default ColumnGroup;
