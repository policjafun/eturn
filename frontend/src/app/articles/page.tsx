'use client';

import Navbar from '@/components/navbar';
import { useState, useEffect } from 'react';

export default function Articles() {
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = new URL(window.location.href);

        const fetchArticles = async () => {
            try {
                const response = await fetch(`${url.origin}/api/articles`, {
                    next: {
                        revalidate: 60,
                    },
                });
                const data = await response.json();

                data.articles.sort((a: any, b: any) => {
                    return (
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                });

                setArticles(data.articles);
                setFilteredArticles(data.articles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    function handleInput(event: any) {
        const search = event.target.value.toLowerCase();

        if (search === '') {
            setFilteredArticles(articles);
            return;
        }

        const filtered = articles.filter((article: any) => {
            return (
                article.name.toLowerCase().includes(search) ||
                article.description.toLowerCase().includes(search) ||
                article.rawName.toLowerCase().includes(search)
            );
        });

        setFilteredArticles(filtered);
    }

    return (
        <div>
            <Navbar />

            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl text-center font-[Coolvetica] tracking-wide">
                    Articles
                </h1>
                <p className="text-center text-neutral-300 mt-2">
                    Check out our latest articles or search for a specific one.
                </p>

                <div className="flex justify-center mt-10">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="w-full md:w-1/2 px-4 py-2 border border-neutral-800 bg-neutral-900/50 rounded-lg focus:outline-none focus:border-neutral-700 transition-colors"
                        onInput={handleInput}
                    />
                </div>

                {loading ? (
                    <p className="text-white text-center mt-10">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                        {filteredArticles.map((article: any) => (
                            <a
                                key={article.name}
                                href={`/articles/${article.rawName}`}
                                className="flex flex-col items-start p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors"
                            >
                                <img
                                    src={article.image}
                                    alt={article.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                />

                                <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                                    {article.name}
                                </h3>

                                <p className="text-white mt-2 text-neutral-300">
                                    {article.description}
                                </p>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
