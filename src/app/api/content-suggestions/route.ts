import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { title, excerpt, blogs } = await req.json();

        if (!title && !excerpt) {
            return NextResponse.json({ error: 'No content provided' }, { status: 400 });
        }

        const prompt = `You are an expert SEO strategist and content editor for a blog platform.

Given the following blog:
Title: "${title || 'Untitled'}"
Excerpt: "${excerpt?.slice(0, 600) || 'No excerpt yet'}"

And the user's existing published blogs:
${(blogs || []).slice(0, 8).map((b: any, i: number) => `${i + 1}. ${b.blog_title}`).join('\n') || 'None'}

Please respond with ONLY valid JSON in this exact structure (no markdown, no explanation):
{
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "internalLinks": [
    {"title": "existing blog title to link", "reason": "short reason why this is relevant"}
  ],
  "contentGaps": [
    {"prompt": "brief suggestion of what to add", "section": "section heading suggestion"}
  ]
}

Rules:
- keywords: 5 specific long-tail SEO keywords the blog should target
- internalLinks: up to 3 titles from the existing blogs list that are relevant to link from this blog. Only include blogs that exist in the list above.
- contentGaps: 3 short suggestions for sections or angles this blog is missing`;

        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            prompt,
            maxTokens: 600,
            temperature: 0.4,
        });

        // Parse the JSON response
        const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
        const parsed = JSON.parse(cleaned);

        return NextResponse.json(parsed);
    } catch (err: any) {
        console.error('[content-suggestions] Error:', err?.message || err);
        return NextResponse.json(
            { error: 'Failed to generate suggestions', detail: err?.message },
            { status: 500 }
        );
    }
}
