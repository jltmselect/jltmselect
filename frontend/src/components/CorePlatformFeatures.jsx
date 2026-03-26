import { Globe, Camera, Gavel, Hand } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Container from "../components/Container";
import { otherData } from "../assets";

function CorePlatformFeatures() {
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

    const features = [
        {
            icon: Globe,
            title: "Discover",
            description:
                "Navigate a constantly refreshing global inventory of fashion closeouts, from warehouse overstock to vintage rarities.",
            points: [
                "Discover by category",
                "Advanced search by brand, price, and auction type",
                "Numerous types of auctions",
            ],
        },
        {
            icon: Camera,
            title: "Sell",
            description:
                `Whether you're clearing a closet or moving pallets of closeouts, ${otherData?.brandName} gives you tools to list with confidence.`,
            points: [
                "Streamlined photo upload & editing",
                "Smart pricing options",
                "Seller dashboard & analytics",
            ],
        },
        {
            icon: Gavel,
            title: "Auction",
            description:
                "Time-limited bidding turns excess inventory into excitement. Every lot has its moment.",
            points: [
                "Flexible pricing settings",
                "Live countdown timers",
                "Multiple auction types",
            ],
        },
        {
            icon: Hand,
            title: "Bid",
            description:
                "Participate in auctions securely with transparent tools designed for the modern collector.",
            points: [
                "Real-time bid tracking",
                "Instant outbid notifications",
                "Secure payment processing",
            ],
        },
    ];

    return (
        <section ref={ref} className="bg-bg-secondary dark:bg-bg-primary text-text-primary dark:text-text-primary-dark py-16 overflow-hidden">
            <Container>

                {/* HEADER */}
                <div
                    className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-pure-black dark:text-pure-white">
                        The {otherData?.brandName} Ecosystem
                    </h2>

                    <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-3">
                        A complete ecosystem built on four essential pillars—connecting sellers, buyers, and collections with effortless precision.
                    </p>

                    <div className="mt-8 border-b border-gray-300 dark:border-pure-white/30"></div>
                </div>

                {/* FEATURES GRID */}
                <div className="grid md:grid-cols-2 gap-8 mt-10">

                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className={`flex flex-col items-start sm:flex-row sm:items-start sm:gap-8 group border border-gray-200 dark:border-pure-white/30 p-8 md:p-10 rounded bg-gradient-to-b from-gray-50 to-transparent  dark:bg-gradient-to-b dark:from-white/[0.03] dark:to-transparent hover:border-gray-300 transition-all duration-500 hover:-translate-y-1 ${visible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                                    }`}
                                style={{
                                    transitionDelay: `${index * 120}ms`,
                                }}
                            >
                                {/* ICON */}
                                <div className="p-5 rounded-full bg-bg-primary dark:bg-bg-primary-light flex items-center justify-center mb-6 group-hover:bg-bg-primary-light dark:group-hover:bg-bg-primary-light/90 transition flex-shrink-0">
                                    <Icon size={30} className="text-pure-white dark:text-pure-white" />
                                </div>

                                <div>
                                    {/* TITLE */}
                                    <h3 className="text-2xl font-semibold mb-3 text-text-primary dark:text-text-primary-dark">
                                        {feature.title}
                                    </h3>

                                    {/* DESCRIPTION */}
                                    <p className="text-text-secondary dark:text-text-secondary-dark font-light mb-6 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* BULLETS */}
                                    <ul className="space-y-2 font-extralight text-text-secondary dark:text-text-secondary-dark text-sm">
                                        {feature.points.map((point, i) => (
                                            <li key={i} className="flex gap-2">
                                                <span>•</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </Container>
        </section>
    );
}

export default CorePlatformFeatures;