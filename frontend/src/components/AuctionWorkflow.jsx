import { Tag, Gavel, Timer, HandCoins } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Container from "./Container";

const steps = [
    {
        icon: Tag,
        title: "Seller Listing",
        description:
            "Sellers create detailed listings, uploads images, setting starting prices, reserve limits, and auction duration via our intuitive tools.",
    },
    {
        icon: Gavel,
        title: "Live Bidding",
        description:
            "Buyers place bids in real time. The current price rises with each new bid—no algorithms, just fair and transparent bidding.",
    },
    {
        icon: Timer,
        title: "Real-time Tracking",
        description:
            "Participants receive live updates, instant outbid alerts, and countdown notifications to stay engaged until the final second.",
    },
    {
        icon: HandCoins,
        title: "Close & Settlement",
        description:
            "Highest valid bid/offer wins instantly. Funds are secured with the platform and released only upon verified delivery.",
    },
];

function AuctionWorkflow() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.25 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="relative pb-16 bg-bg-secondary dark:bg-bg-primary text-text-primary dark:text-text-primary-dark overflow-hidden">
            <Container>
                <div className="container mx-auto">

                    {/* Heading */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-pure-black dark:text-pure-white">
                            The Journey of Every Lot
                        </h2>

                        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-3">
                            A seamless path from listing to fulfillment—automated, transparent, and built for confidence at every turn. We handle the automation. You handle the wins.
                        </p>
                    </div>

                    {/* Workflow */}
                    <div className="relative">

                        <div className="grid gap-12 lg:grid-cols-4">

                            {steps.map((step, index) => {
                                const Icon = step.icon;

                                return (
                                    <div
                                        key={index}
                                        className={`relative text-center group transition-all duration-700 ${
                                            visible
                                                ? "opacity-100 translate-y-0"
                                                : "opacity-0 translate-y-10"
                                        }`}
                                        style={{ animationDelay: `${index * 120}s` }}
                                    >
                                        {/* circle icon */}
                                        <div className="relative mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-bg-primary dark:bg-bg-primary-light border border-bg-primary dark:border-bg-primary-light backdrop-blur-md transition-all duration-300 group-hover:bg-bg-primary-light dark:group-hover:bg-bg-border-bg-primary-light group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                                            <Icon size={30} className="text-pure-white dark:text-text-primary-dark" />

                                            {/* number bubble */}
                                            <span className="absolute top-0 right-0 text-sm bg-bg-secondary-dark dark:bg-bg-secondary text-pure-black dark:text-pure-black rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                                                {index + 1}
                                            </span>
                                        </div>

                                        {/* text */}
                                        <div className="mt-8">
                                            <h3 className="text-xl font-medium mb-3 text-text-primary dark:text-text-primary-dark">
                                                {step.title}
                                            </h3>

                                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm font-light leading-relaxed max-w-xs mx-auto">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default AuctionWorkflow;