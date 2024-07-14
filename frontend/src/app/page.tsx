'use client';

import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import {
    ArrowRight,
    ChatCircle,
    HandWaving,
    Ranking,
    Sword,
    Ticket,
    UserFocus,
    UsersThree,
    Wrench,
} from '@phosphor-icons/react/dist/ssr';
import { useEffect, useState } from 'react';
import Loading from './loading';

export default function Home() {
    const loadingArticle = {
        description: 'Loading...',
        image: 'https://via.placeholder.com/300',
        href: '#',
    };

    const [articles, setArticles] = useState<
        {
            name: string;
            description: string;
            image: string;
            href: string;
        }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = new URL(window.location.href);
        const fetchLatestArticles = async () => {
            try {
                const response = await fetch(`${url.origin}/api/articles`, {
                    next: {
                        revalidate: 3600,
                    },
                });

                const data = await response.json();

                const articles = data.articles
                    .sort((a: any, b: any) => {
                        return (
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        );
                    })
                    .slice(0, 3)
                    .map((article: any) => {
                        return {
                            name: article.name,
                            description: article.description,
                            image: article.image,
                            href: `/articles/${article.rawName}`,
                        };
                    });

                console.log(articles);

                setArticles(articles);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching latest articles:', error);
            }
        };

        fetchLatestArticles();
    }, []);

    return loading ? (
        <Loading />
    ) : (
        <div>
            <Navbar />

            <div className="flex flex-col items-center justify-center pt-48 pb-64 px-6 md:px-12 md:pt-64 md:pb-72 gfx">
                <a href="/articles/development-status-of-eturn">
                    <span className="px-4 py-1 text-sm text-white rounded-full border border-primary bg-primary/20 hover:cursor-pointer">
                        Check development status{' '}
                        <ArrowRight
                            size={16}
                            className="inline-block -mt-0.5 -ml-0.5"
                        />
                    </span>
                </a>

                <h1 className="text-6xl text-white text-center font-[Coolvetica] tracking-wide mt-4">
                    eturn
                </h1>

                <p className="text-white text-center mt-1 text-neutral-300 max-w-lg">
                    eturn is best solution for your discord server, with many
                    features and customizations. Get started today!
                </p>

                <div className="flex flex-col items-center mt-6 space-y-3 md:flex-row md:space-x-4 md:space-y-0">
                    <button className="px-4 py-2 text-white bg-neutral-900 border border-neutral-800 rounded-lg items-center hover:bg-neutral-800 hover:border-neutral-700 transition-colors">
                        <a href="#features">Learn More</a>
                    </button>

                    <a href="https://invite.eturn.app">
                        <button className="flex px-4 py-2 text-white bg-primary/20 border border-primary rounded-lg items-center hover:bg-primary/15 hover:border-primary/50 transition-colors">
                            Add to Discord
                            <ArrowRight
                                size={16}
                                weight="bold"
                                style={{ marginLeft: '0.3rem' }}
                            />
                        </button>
                    </a>
                </div>

                <div className="chevronWrapper mt-28">
                    <div className="chevron"></div>
                    <div className="chevron"></div>
                    <div className="chevron"></div>
                </div>
            </div>

            {/* Features */}
            <div
                className="flex flex-col items-center justify-center py-24 px-6 md:px-12 bg-background"
                id="features"
            >
                <h2 className="text-4xl text-white text-center font-[Coolvetica] tracking-wide">
                    Features
                </h2>

                <p className="text-white text-center mt-1 text-neutral-300 max-w-lg">
                    eturn has many features to help you manage your server. Here
                    are some of the features we offer.
                </p>

                <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3 md:gap-8 w-full max-w-5xl">
                    <div className="flex flex-col items-center p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors">
                        <Sword
                            size={36}
                            className="text-primary"
                            weight="fill"
                        />

                        <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                            Moderation
                        </h3>

                        <p className="text-white mt-2 text-neutral-300 text-center">
                            Moderation never has been that easy. With just a few
                            clicks you can set up moderation to work the way you
                            like.
                        </p>
                    </div>

                    <div className="flex flex-col items-center p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors">
                        <UserFocus
                            size={36}
                            className="text-primary"
                            weight="fill"
                        />

                        <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                            Anti-Raid
                        </h3>

                        <p className="text-white mt-2 text-neutral-300 text-center">
                            Ever worried about raids? eturn has you covered with
                            our anti-raid system. Customize every single aspect
                            of it with ease.
                        </p>
                    </div>

                    <div className="flex flex-col items-center p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors">
                        <Wrench
                            size={36}
                            className="text-primary"
                            weight="fill"
                        />

                        <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                            Tools
                        </h3>

                        <p className="text-white mt-2 text-neutral-300 text-center">
                            Our bot offers a wide range of tools to help you
                            with a lot of things. From fun to utility, we have
                            everything you need.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-3 md:gap-8 w-full max-w-5xl">
                    <div className="flex flex-col items-center p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors">
                        <Ranking
                            size={36}
                            className="text-primary"
                            weight="fill"
                        />

                        <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                            Leveling
                        </h3>

                        <p className="text-white mt-2 text-neutral-300 text-center">
                            Leveling is a great way to reward active members.
                            With eturn, you can set up leveling in just a few
                            clicks.
                        </p>
                    </div>

                    <div className="flex flex-col items-center p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors">
                        <HandWaving
                            size={36}
                            className="text-primary"
                            weight="fill"
                        />

                        <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                            Welcome Features
                        </h3>

                        <p className="text-white mt-2 text-neutral-300 text-center">
                            Welcome new members with a custom message, role or
                            both. eturn offers a wide range of welcome features.
                        </p>
                    </div>

                    <div className="flex flex-col items-center p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors">
                        <Ticket
                            size={36}
                            className="text-primary"
                            weight="fill"
                        />

                        <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                            Tickets
                        </h3>

                        <p className="text-white mt-2 text-neutral-300 text-center">
                            Need help with something? eturn offers a ticket
                            system to help you manage support requests with
                            ease.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tutorials, Guides, and More */}
            <div className="flex flex-col items-center justify-center py-24 px-6 md:px-12 bg-background">
                <h2 className="text-4xl text-white text-center font-[Coolvetica] tracking-wide">
                    Tutorials, Guides, and More
                </h2>

                <p className="text-white text-center mt-1 text-neutral-300 max-w-lg">
                    Learn how to use eturn with our guides and tutorials. Get
                    started today!
                </p>

                <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 md:gap-8 w-full max-w-5xl">
                    {articles.map((tutorial) => (
                        <a
                            key={tutorial.name}
                            href={tutorial.href}
                            className="flex flex-col items-start p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors"
                        >
                            <img
                                src={tutorial.image}
                                alt={tutorial.name}
                                className="w-full h-48 object-cover rounded-lg"
                            />

                            <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                                {tutorial.name}
                            </h3>

                            <p className="text-white mt-2 text-neutral-300">
                                {tutorial.description}
                            </p>
                        </a>
                    ))}
                </div>

                <button className="px-4 py-2 text-white mt-12 text-primary">
                    <a href="/articles">View all articles</a>
                </button>
            </div>

            {/* Statistics */}
            <div className="flex flex-col items-center justify-center py-24 px-6 md:px-12 bg-background mb-16">
                <h2 className="text-4xl text-white text-center font-[Coolvetica] tracking-wide">
                    Statistics
                </h2>

                <p className="text-white text-center mt-1 text-neutral-300 max-w-lg">
                    eturn is not all about features. We serve a lot of servers
                    and users. Here are some statistics.
                </p>

                <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3 md:gap-8 w-full max-w-5xl">
                    <div className="flex flex-col items-center p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors">
                        <ChatCircle
                            size={36}
                            className="text-primary"
                            weight="fill"
                        />

                        <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                            Servers
                        </h3>

                        <p className="text-white mt-2 text-neutral-300 text-center">
                            10+
                        </p>
                    </div>

                    <div className="flex flex-col items-center p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors">
                        <UsersThree
                            size={36}
                            className="text-primary"
                            weight="fill"
                        />

                        <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                            Users
                        </h3>

                        <p className="text-white mt-2 text-neutral-300 text-center">
                            100+
                        </p>
                    </div>

                    <div className="flex flex-col items-center p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl hover:border-neutral-700 transition-colors">
                        <Wrench
                            size={36}
                            className="text-primary"
                            weight="fill"
                        />

                        <h3 className="text-2xl text-white font-[Coolvetica] tracking-wide mt-4">
                            Commands
                        </h3>

                        <p className="text-white mt-2 text-neutral-300 text-center">
                            10+
                        </p>
                    </div>
                </div>

                <p className="text-white text-center mt-12">
                    Wanna contribute?{' '}
                    <a href="https://invite.eturn.app" className="text-primary">
                        Add eturn to your server
                    </a>
                </p>
            </div>

            <Footer />
        </div>
    );
}
