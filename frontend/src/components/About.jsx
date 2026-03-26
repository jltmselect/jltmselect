import { Search, Gavel, Shield, Gem, Shirt, Heart, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { about, otherData } from "../assets";
import Container from "./Container";

function About() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="grid lg:grid-cols-5 min-h-[650px] lg:min-h-[700px]">

            {/* LEFT IMAGE + TEXT */}
            <div className="relative lg:col-span-2">
                <img
                    src={about}
                    alt="fashion"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-pure-black/50"></div>

                <div
                    className={`relative z-10 h-full flex items-center text-pure-white transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <Container className="py-16">
                        <p className="tracking-[0.35em] text-sm uppercase text-pure-white/70 mb-6">
                            Our Vision
                        </p>

                        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight mb-6 max-w-xl text-pure-white">
                            A world where fashion never goes to waste—with style and integrity.
                        </h2>

                        <p className="text-base md:text-xl font-light text-pure-white/80 max-w-lg">
                            {otherData?.brandName} connects those who seek with those who sell—turning unworn inventory into discovered treasures through a seamless, auction-driven marketplace.
                        </p>
                    </Container>
                </div>
            </div>

            {/* RIGHT CONTENT PANEL */}
            <div className="bg-bg-secondary dark:bg-bg-primary text-text-primary dark:text-text-primary-dark flex items-center lg:col-span-3">
                <Container className="pt-10 lg:py-10 w-full">

                    {/* VALUE PROPOSITION */}
                    <div
                        className={`transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            }`}
                    >
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-10 border-b-2 border-gray-300 dark:border-gray-600 inline-block pb-4 text-text-primary dark:text-text-primary-dark">
                            Value Proposition
                        </h3>

                        <div className="space-y-8">

                            {/* ITEM */}
                            <div className="flex gap-4 md:gap-6 group">
                                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-bg-primary dark:bg-bg-primary-light flex items-center justify-center group-hover:border-pure-black transition">
                                    <Search size={20} className="text-text-primary-dark dark:text-pure-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-text-primary dark:text-text-primary-dark">
                                        Discover Unique Pieces
                                    </h4>
                                    <p className="text-text-secondary dark:text-text-secondary-dark mt-1">
                                        Access a constantly moving inventory of fashion closeouts—from overstock luxury to vintage rarities. Every piece has a story.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 md:gap-6 group">
                                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-bg-primary dark:bg-bg-primary-light flex items-center justify-center group-hover:border-pure-black transition">
                                    <Gavel size={20} className="text-text-primary-dark dark:text-purw-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-text-primary dark:text-text-primary-dark">
                                        Real-Time Bidding Thrills
                                    </h4>
                                    <p className="text-text-secondary dark:text-text-secondary-dark mt-1">
                                        Experience the energy of real-time auctions. Whether you win or walk away, you always know where you stand.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 md:gap-6 group">
                                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-bg-primary dark:bg-bg-primary-light flex items-center justify-center group-hover:border-pure-black transition">
                                    <Shield size={20} className="text-text-primary-dark dark:text-pure-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-text-primary dark:text-text-primary-dark">
                                        Trade with Confidence
                                    </h4>
                                    <p className="text-text-secondary dark:text-text-secondary-dark mt-1">
                                        Every transaction is protected by secured gateways and authentication. From warehouse to wardrobe, we've got you covered.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TARGET AUDIENCE */}
                    <div
                        className={`mt-10 lg:mt-12 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            }`}
                    >
                        <h3 className="text-2xl md:text-3xl lg:text-4xl inline-block font-semibold mb-8 border-b-2 border-gray-300 dark:border-gray-600 pb-4 text-text-primary dark:text-text-primary-dark">
                            Target Audience
                        </h3>

                        <div className="flex flex-wrap gap-4">
                            <div className="px-6 py-3 font-light bg-bg-primary dark:bg-bg-primary-light rounded-full flex items-center gap-2 hover:bg-pure- dark:hover:bg-bg-primary-light/90 transition text-pure-white dark:text-pure-white">
                                <Gem size={16} />
                                Luxury Shoppers
                            </div>

                            <div className="px-6 py-3 font-light bg-bg-primary dark:bg-bg-primary-light rounded-full flex items-center gap-2 hover:bg-pure- dark:hover:bg-bg-primary-light/90 transition text-pure-white dark:text-pure-white">
                                <Shirt size={16} />
                                Vintage Collectors
                            </div>

                            <div className="px-6 py-3 font-light bg-bg-primary dark:bg-bg-primary-light rounded-full flex items-center gap-2 hover:bg-pure- dark:hover:bg-bg-primary-light/90 transition text-pure-white dark:text-pure-white">
                                <Store size={16} />
                                Resellers
                            </div>

                            <div className="px-6 py-3 font-light bg-bg-primary dark:bg-bg-primary-light rounded-full flex items-center gap-2 hover:bg-pure- dark:hover:bg-bg-primary-light/90 transition text-pure-white dark:text-pure-white">
                                <Heart size={16} />
                                Fashion Enthusiasts
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    );
}

export default About;