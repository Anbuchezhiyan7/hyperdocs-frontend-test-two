interface ListProps {
  items: JSX.Element[];
  type: 'ul' | 'ol';
  index: number;
}

const List = ({ items, type, index }: ListProps) => {
  // Add null checks for items
  if (!items || !Array.isArray(items) || items.length === 0) return null;
  
  // Filter out null/undefined items
  const validItems = items.filter(item => item !== null && item !== undefined);
  
  if (validItems.length === 0) return null;
  
  const ListTag = type;
  const listClasses = `${type === 'ul' ? 'list-disc' : 'list-decimal'} ml-6 my-4 text-[#0A0A0A] marker:text-[#0A0A0A] space-y-1`;

  return (
    <ListTag key={`list-${index}`} className={listClasses}>
      {validItems}
    </ListTag>
  );
};

export default List;
