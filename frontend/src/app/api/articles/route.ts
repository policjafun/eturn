import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, readdirSync } from 'fs';
import { Converter } from 'showdown';
import path from 'path';

// Depending on environment, the path may be either "/public/articles" or "/articles"
function resolveArticlesPath() {
    if (readdirSync(path.join(process.cwd(), 'public', 'articles'))) {
        return path.join(process.cwd(), 'public', 'articles');
    } else if (readdirSync(path.join(process.cwd(), 'articles'))) {
        return path.join(process.cwd(), 'articles');
    } else {
        throw new Error('Articles directory not found');
    }
}

function getArticleMetadata(article: string) {
    const articleContents = readFileSync(
        path.join(resolveArticlesPath(), `${article}.md`),
        'utf-8',
    );
    const articleMetadata = articleContents.split('---')[1];

    const name = articleMetadata.match(/name: (.*)/)![1];
    const description = articleMetadata.match(/description: (.*)/)![1];
    const image = articleMetadata.match(/image: (.*)/)![1];
    const author = articleMetadata.match(/author: (.*)/)![1];
    const date = articleMetadata.match(/date: (.*)/)![1];

    const timestamp = new Date(date).getTime();

    return {
        name,
        rawName: article,
        description,
        image,
        author,
        date,
        timestamp,
    };
}

function getArticleContentParsed(article: string) {
    const articleContents = readFileSync(
        path.join(resolveArticlesPath(), `${article}.md`),
        'utf-8',
    );
    const articleContent = articleContents.split('---')[2];

    const converter = new Converter({
        emoji: true,
        ghMentions: true,
        noHeaderId: true,
        openLinksInNewWindow: true,
        simplifiedAutoLink: true,
        tables: true,
        tasklists: true,
        underline: true,
    });

    converter.setFlavor('github');

    return converter.makeHtml(articleContent);
}

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const name = searchParams.get('name');

    if (name) {
        const articles = readdirSync(path.join(resolveArticlesPath()));

        const article = articles.find((article) => {
            return article.replace('.md', '') === name;
        });

        if (!article) {
            return NextResponse.json({
                error: 'Article not found',
            });
        }

        const articleMetadata = getArticleMetadata(article.replace('.md', ''));

        return NextResponse.json({
            metadata: articleMetadata,
            content: getArticleContentParsed(article.replace('.md', '')),
        });
    } else {
        const articles = readdirSync(path.join(resolveArticlesPath()));

        const articleMetadata = articles.map((article) => {
            return getArticleMetadata(article.replace('.md', ''));
        });

        return NextResponse.json({
            articles: articleMetadata,
        });
    }
}
