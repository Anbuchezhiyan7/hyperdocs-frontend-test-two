interface RichTextProps {
  children: any[];
}

import { formatSmartDate } from '@/utils/time';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';

const RichText = ({ children }: RichTextProps) => {
  if (!Array.isArray(children)) return null;

  return (
    <>
      {children.map((child: any, index: number) => {
        if (!child) return null;

        let content: any = child.text;

        // Skip if there's no text (strictly undefined) but there's no children and it's not a link or date or image
        if (content === undefined && !child.children && !['a', 'date', 'img', 'image'].includes(child.type)) return null;

        // If it has children and is not an image, parse them recursively instead of using text
        if (child.children && !['img', 'image'].includes(child.type)) {
          content = <RichText children={child.children} />;
        }

        // Handle date elements
        if (child.type === 'date' && child.date) {
          content = (
            <span className="inline-flex items-center rounded-sm bg-muted/50 px-1.5 py-0.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80">
              {formatSmartDate(child.date)}
            </span>
          );
        }

        // Handle image elements
        if (['img', 'image']?.includes(child?.type) && child?.url) {
          content = (
            <img
              src={optimizeCloudinaryImage(child?.url, child?.width ? Math.min(Number(child?.width) * 2, 1600) : 1000)}
              alt={child?.alt || ''}
              className="inline-block rounded-md max-w-full h-auto align-middle my-1 shadow-sm"
              style={{ width: child?.width ? `${child?.width}px` : 'auto' }}
              loading="lazy"
              decoding="async"
            />
          );
        }

        // Apply formatting wrappers
        if (child.code) {
          content = <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{content}</code>;
        }
        if (child.strikethrough) {
          content = <s>{content}</s>;
        }
        if (child.underline) {
          content = <u>{content}</u>;
        }
        if (child.italic) {
          content = <em>{content}</em>;
        }
        if (child.bold) {
          content = <strong>{content}</strong>;
        }

        // Handle links
        if (child.type === 'a' && child.url) {
          content = (
            <a
              href={child.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 hover:opacity-80"
            >
              {content}
            </a>
          );
        }

        return (
          <span
            key={index}
            style={{
              color: child.color,
              backgroundColor: child.backgroundColor,
              fontSize: child.fontSize,
              fontFamily: child.fontFamily
            }}
          >
            {content === '' && !child.children ? '\u00A0' : content}
          </span>
        );
      })}
    </>
  );
};

export default RichText;
