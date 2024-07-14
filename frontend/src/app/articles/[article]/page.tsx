'use client';

import Loading from '@/app/loading';
import Navbar from '@/components/navbar';
import parseTimestamp from '@/utils/parseTimestamp';
import { useEffect, useState } from 'react';

import './article.css';
import Footer from '@/components/footer';

export default function Article({ params }: { params: { article: string } }) {
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const url = new URL(window.location.href);

        const fetchArticle = async () => {
            try {
                const response = await fetch(
                    `${url.origin}/api/articles?name=${params.article}`,
                    {
                        next: {
                            revalidate: 60,
                        },
                    },
                );
                const data = await response.json();
                setArticle(data);
            } catch (error) {
                console.error('Error fetching article:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [params.article]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div>
                <Navbar />

                <div className="container mx-auto px-6 py-12">
                    <h1 className="text-4xl text-center font-[Coolvetica] tracking-wide">
                        Article not found
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <div className="container mx-auto px-6 py-12 md:w-2/4">
                <img
                    src={article.metadata.image}
                    alt={article.metadata.name}
                    className="w-full h-64 object-cover rounded-lg mb-5"
                />

                <h1 className="text-4xl font-[Coolvetica] tracking-wide">
                    {article.metadata.name}
                </h1>
                <p className="text-neutral-300 mt-2">
                    {article.metadata.description}
                </p>

                <p className="mt-2 text-primary mb-6">
                    <img
                        src="/images/icon.ico"
                        alt="Avatar"
                        className="w-6 h-6 rounded-full inline mr-1 -mt-1"
                    />
                    Written by {article.metadata.author} •{' '}
                    {parseTimestamp(article.metadata.timestamp)}
                </p>

                <hr className="border-neutral-700 mb-6" />

                <div
                    className="max-w-none"
                    id="article-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </div>

            <Footer />
        </div>
    );
}
