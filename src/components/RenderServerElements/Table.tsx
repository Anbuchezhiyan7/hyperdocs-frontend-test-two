import RichText from './RichText';

interface TableProps {
  block: any;
  index: number;
}

const Table = ({ block, index }: TableProps) => { 
  // Add null checks for block and its properties
  if (!block || !block.children || !Array.isArray(block.children) || block.children.length === 0) return null;
  
  // Filter for valid rows only to ensure correct rowIndex (index 0 is always the top row)
  const validRows = block.children.filter((row: any) => 
    row && row.type === 'tr' && Array.isArray(row.children)
  );

  if (validRows.length === 0) return null;

  const renderTableCell = (cell: any, cellIndex: number, rowIndex: number) => {
    // Add null checks for cell and its properties
    if (!cell || !cell.children || !Array.isArray(cell.children)) {
      const isFR = rowIndex === 0;
      const isFC = cellIndex === 0;
      let bC = "before:border-b before:border-b-border before:border-r before:border-r-border";
      if (isFR) bC += " before:border-t before:border-t-border";
      if (isFC) bC += " before:border-l before:border-l-border";

      return (
        <td 
          key={cellIndex} 
          className={`slate-td h-full overflow-visible border-none p-0 bg-background relative ${bC} before:size-full before:absolute before:box-border before:content-[''] before:select-none`}
          style={{ position: 'relative', maxWidth: '240px', minWidth: '120px' }}
        ></td>
      );
    }

    const isFirstRow = rowIndex === 0;
    const isFirstColumn = cellIndex === 0;
    
    // Replicate Slate's border logic: bottom/right always, top for 1st row, left for 1st column
    let borderClasses = "before:border-b before:border-b-border before:border-r before:border-r-border";
    if (isFirstRow) borderClasses += " before:border-t before:border-t-border";
    if (isFirstColumn) borderClasses += " before:border-l before:border-l-border";
    
    return (
      <td 
        key={cellIndex} 
        className={`slate-td h-full overflow-visible border-none p-0 bg-background relative ${borderClasses} before:size-full before:absolute before:box-border before:content-[''] before:select-none`}
        style={{ position: 'relative', maxWidth: '240px', minWidth: '120px' }}
      >
        <div className="relative z-20 box-border h-full px-3 py-2">
          {cell.children.map((child: any, childIdx: number) => {
            // Replicate Slate's paragraph rendering within tables
            if (child.type === 'p') {
              return (
                <div key={childIdx} className="slate-p my-0 py-0.5 relative">
                  <RichText children={child.children} />
                </div>
              );
            }
            return <RichText key={childIdx} children={[child]} />;
          })}
        </div>
      </td>
    );
  };
  
  const tableContent = validRows.map((row: any, rowIndex: number) => {
    const cells = row.children.map((cell: any, cellIndex: number) => 
      renderTableCell(cell, cellIndex, rowIndex)
    ).filter((cell: any) => cell !== null);
    
    // Only render row if it has valid cells
    if (cells.length === 0) return null;
    
    return (
      <tr key={rowIndex} className="slate-tr group/row relative" style={{ position: 'relative' }}>
        {cells}
      </tr>
    );
  });
  
  return (
    <div key={index} className="my-8 overflow-x-auto not-prose">
      <table 
        className="table h-px border-collapse w-fit mr-auto" 
        itemScope 
        itemType="https://schema.org/Table"
      >
        <tbody className="w-fit">
          {tableContent}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
