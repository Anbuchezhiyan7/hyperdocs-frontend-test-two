import { editorPlugins } from '@/components/editor/plugins/editor-plugins';
import { createPlateEditor } from '@udecode/plate/react';
import { XMLParser } from 'fast-xml-parser';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { getEditorDOMFromHtmlString } from '@udecode/plate';
import mammoth from 'mammoth';
import { toast } from 'sonner';

interface WordPressPost {
    blog_title: string;
    content: string;
    slug_url: string;
}

const useImportService = () => {
    const editor = createPlateEditor({
        plugins: [...editorPlugins()],
    });

    const handleImport = async (res: any) => {
        const type = res?.filesContent[0]?.name?.split('.').pop();
        let plateContent = null;
        console.log('res', res);
        if (type === 'docx') {
            plateContent = await handleImportDocx(res.plainFiles[0]);
        } else if (type === 'md') {
            plateContent = await handleImportMd(res.plainFiles[0]);
        } else if (type === 'html') {
            plateContent = await handleImportHtml(res.plainFiles[0]);
        }

        return plateContent;
    };

    const handleConvertWordPressXML = async (xmlContent: string): Promise<WordPressPost[]> => {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '',
            processEntities: true,
            preserveOrder: false,
        });

        // Create a basic Plate editor with common plugins

        const jsonObj = parser.parse(xmlContent);
        const items = jsonObj.rss?.channel?.item || [];
        const posts: WordPressPost[] = [];

        for (const item of items) {
            const title = item.title || 'Untitled';
            const content = item['content:encoded'] || item['excerpt:encoded'] || '';
            const slug = item['wp:post_name'] || `post-${posts.length}`;
            const htmlContent = content.includes('<p>') ? content : `<p>${content}</p>`;

            if (!content.trim()) continue;

            try {
                // Create a temporary div to parse the HTML content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlContent;

                // Convert the HTML content to Plate.js format
                const plateContent = editor.api.html.deserialize({ element: tempDiv.innerHTML });

                posts.push({
                    blog_title: title,
                    content: JSON.stringify(plateContent),
                    slug_url: slug.replace(/[^a-z0-9\-]/gi, '_').toLowerCase(),
                });

                console.log('PLATE CONTENT =>>', plateContent);

                console.log(`Successfully converted post: ${title}`);
            } catch (error) {
                console.error(`Error converting post "${title}":`, error);
            }
        }

        return posts;
    };

    const handleImportDocx = async (file: File) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const htmlContent = result.value;

            // Convert HTML to Plate.js format
            const plateContent = editor.api.html.deserialize({
                element: htmlContent,
            });

            console.log('PLATE CONTENT =>>', plateContent);

            // Ensure we have valid Plate.js content
            if (!plateContent || !Array.isArray(plateContent) || plateContent.length === 0) {
                // If conversion fails, create a basic structure with the text content
                toast.error('No content found in the DOCX file');
                throw new Error('No content found in the DOCX file');
            }

            return {
                blog_title: file.name.replace('.docx', ''),
                content: JSON.stringify(plateContent),
                slug_url: file.name
                    .replace('.docx', '')
                    .replace(/[^a-z0-9\-]/gi, '_')
                    .toLowerCase(),
            };
        } catch (error) {
            console.error('Error importing DOCX file:', error);
            throw error;
        }
    };

    const handleImportMd = async (file: File) => {
        try {
            const text = await file.text();
            const plateContent = editor.getApi(MarkdownPlugin).markdown.deserialize(text);

            return {
                blog_title: file.name.replace('.md', ''),
                content: JSON.stringify(plateContent),
                slug_url: file.name
                    .replace('.md', '')
                    .replace(/[^a-z0-9\-]/gi, '_')
                    .toLowerCase(),
            };
        } catch (error) {
            console.error('Error importing Markdown file:', error);
            throw error;
        }
    };

    const handleImportHtml = async (file: File) => {
        try {
            const text = await file.text();
            const editorNode = getEditorDOMFromHtmlString(text);
            const plateContent = editor.api.html.deserialize({
                element: editorNode,
            });

            return {
                blog_title: file.name.replace('.html', ''),
                content: JSON.stringify(plateContent),
                slug_url: file.name
                    .replace('.html', '')
                    .replace(/[^a-z0-9\-]/gi, '_')
                    .toLowerCase(),
            };
        } catch (error) {
            console.error('Error importing HTML file:', error);
            throw error;
        }
    };

    return {
        handleImport,
        handleConvertWordPressXML,
        handleImportDocx,
        handleImportMd,
        handleImportHtml,
    };
};

export default useImportService;
