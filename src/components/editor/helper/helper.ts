type ValidationResult =
  | true
  | 'Please add a title and content to publish your blog post.'
  | 'Please add a title to publish your blog post'
  | 'Add  some content before publishing.';

export function validateBlogContent(data: any[]): ValidationResult {
  const hasNoData = !Array.isArray(data) || data.length === 0;

  // Find first h1
  const firstH1 = hasNoData ? null : data.find((node) => node?.type === 'h1');

  // Extract title text
  const title = firstH1
    ? extractText(firstH1)
        .replace(/\s+/g, ' ')
        .trim()
    : '';

  // Validate title
  const isTitleEmpty = !title || title.toLowerCase() === 'untitled';

  // Combine all non-h1 content
  const contentText = hasNoData
    ? ''
    : data
        .filter((node) => node?.type !== 'h1')
        .map(extractText)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

  const isContentEmpty = !contentText;

  if (isTitleEmpty && isContentEmpty) {
    return 'Please add a title and content to publish your blog post.';
  }

  if (isTitleEmpty) {
    return 'Please add a title to publish your blog post';
  }

  if (isContentEmpty) {
    return 'Add  some content before publishing.';
  }

  return true;
}

function extractText(node: any): string {
  if (!node) return '';

  // Text node
  if (typeof node.text === 'string') {
    return node.text;
  }

  // Recursive children parsing
  if (Array.isArray(node.children)) {
    return node.children
      .map(extractText)
      .join(' ');
  }

  return '';
}