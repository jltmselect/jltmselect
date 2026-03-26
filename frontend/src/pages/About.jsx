import { Verified, Gavel, BadgeCheck, UserPlus, Clock, Heart, Shield, Users, Calendar, Cpu, CheckCircle, TrendingUp, Search, ShieldCheck, Wallet, Globe, BarChart3, Smile, Handshake, BadgeDollarSign, HandHelping, PackageCheck, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Container, HowItWorksCard } from "../components";
import { useEffect, useRef, useState } from "react";
import { otherData } from "../assets";

const highlights = [
    {
        icon: Handshake,
        title: "Unbeatable Selection",
        desc: "Thousands of fashion lots. Browse different categories—find exactly what you're looking for.",
    },
    {
        icon: Gavel,
        title: "Trade Your Way",
        desc: "Auctions, Buy Now, or Make Offer — three ways to win. The flexibility you deserve, the fashion you love.",
    },
    {
        icon: BadgeDollarSign,
        title: "Zero Hidden Fees",
        desc: "Transparent pricing. What you bid is what you pay. No surprises. No fine print. Just honest pricing.",
    },
    {
        icon: HandHelping,
        title: "Expert Support",
        desc: "From your first bid to final delivery — our team is here to help. We're with you every step.",
    },
];

const stats = [
    { icon: Smile, value: "500+", label: "Customer", sub: "Total Customer" },
    { icon: PackageCheck, value: "450", label: "Auctions", sub: "Total Product" },
    { icon: Users, value: "600+", label: "Bidder", sub: "Number Of Total Bidder" },
    { icon: UserCheck, value: "1.2k", label: "Accounts", sub: "User Helped" },
];

const features = [
    {
        number: "01",
        icon: ShieldCheck,
        title: "Verified Listings",
        desc: "Every fashion lot is reviewed to ensure authenticity and transparency across the USA. Know exactly what you're bidding on.",
    },
    {
        number: "02",
        icon: Gavel,
        title: "Real-Time Bidding",
        desc: "Experience live auctions with instant outbid alerts and countdown timers — the excitement of the floor, wherever you are.",
    },
    {
        number: "03",
        icon: Wallet,
        title: "Secure Payments",
        desc: "Bank-level encryption and trusted payment gateways protect every transaction. Your funds, your data, always safe.",
    },
    {
        number: "04",
        icon: Globe,
        title: "Global Marketplace",
        desc: "Connect with buyers and sellers across all 50 states. Seamless cross-country trading made simple.",
    },
    {
        number: "05",
        icon: Handshake,
        title: "Simple & Transparent",
        desc: "Clear fees, straightforward bidding, and honest listings. No hidden costs. No complicated fine print.",
    },
    {
        number: "06",
        icon: Smile,
        title: "Customer Satisfaction",
        desc: "From first listing to final delivery, our team ensures a smooth experience — because your success matters.",
    },
];

function About() {
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const highlightsRef = useRef(null);

    const [heroVisible, setHeroVisible] = useState(false);
    const [featuresVisible, setFeaturesVisible] = useState(false);
    const [highlightsVisible, setHighlightsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target === heroRef.current && entry.isIntersecting) {
                        setHeroVisible(true);
                    }
                    if (entry.target === featuresRef.current && entry.isIntersecting) {
                        setFeaturesVisible(true);
                    }
                    if (entry.target === highlightsRef.current && entry.isIntersecting) {
                        setHighlightsVisible(true);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (heroRef.current) observer.observe(heroRef.current);
        if (featuresRef.current) observer.observe(featuresRef.current);
        if (highlightsRef.current) observer.observe(highlightsRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <section className="pt-16 md:pt-16 max-w-full bg-bg-secondary dark:bg-bg-primary">
            <div className="bg-gray-50 dark:bg-bg-primary">
                <section
                    ref={heroRef}
                    className={`relative overflow-hidden bg-bg-secondary dark:bg-bg-primary py-8 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    {/* floating soft glow */}
                    <div className="absolute -top-32 -left-32 w-80 h-80 bg-bg-primary/20 opacity-30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-32 -right-32 w-80 h-80 bg-bg-primary/20 opacity-30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="max-w-full mx-auto text-center px-6 py-8">
                        {/* headline */}
                        <h1 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-text-primary-dark leading-tight">
                            Built on Trust — <br />
                            <span className="text-text-secondary dark:text-text-secondary-dark">Confidence in Every Click</span>
                        </h1>

                        {/* description */}
                        <p className="mt-6 text-lg text-text-secondary dark:text-text-secondary-dark max-w-3xl mx-auto">
                            From the moment you place your first bid to the instant your win arrives, {otherData?.brandName} delivers complete transparency. Real-time updates, secure payments, and verified listings mean you can focus on the thrill of the find—not the worry behind it.
                        </p>

                        {/* buttons */}
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <Link
                                to="/auctions"
                                className="px-8 py-3 bg-bg-primary dark:bg-bg-secondary text-text-primary-dark dark:text-text-primary rounded-full font-semibold shadow hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                            >
                                Explore Auctions
                            </Link>

                            <Link
                                to="/contact"
                                className="px-8 py-3 border border-gray-300 dark:border-bg-primary-light rounded-full font-semibold text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                Contact Us
                            </Link>
                        </div>

                        {/* stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-20">
                            {stats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center opacity-0 animate-[fadeUp_0.7s_ease_forwards]"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                    >
                                        <Icon className="text-text-primary dark:text-text-primary-dark mb-3" size={30} />
                                        <div className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
                                            {stat.value}
                                        </div>
                                        <div className="text-text-secondary dark:text-text-secondary-dark text-sm">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>

            {/* Why choose us */}
            <Container className="bg-bg-secondary dark:bg-bg-primary">
                <section
                    ref={featuresRef}
                    className={`bg-bg-secondary dark:bg-bg-primary ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <div className="max-w-full mx-auto">
                        {/* Heading */}
                        <div className="text-left mb-8">
                            <p className="text-text-secondary dark:text-text-secondary-dark font-semibold tracking-widest uppercase text-sm">
                                Why Choose Us
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary-dark mt-2">
                                Trade Smarter, Not Harder
                            </h2>
                        </div>

                        {/* Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={i}
                                        className="group bg-gradient-to-b from-bg-primary/[0.03] to-transparent dark:from-white/[0.03] dark:to-transparent rounded-2xl p-8 shadow-sm hover:shado relative overflow-hidden border border-gray-200 dark:border-bg-primary-light"
                                    >
                                        {/* top accent line */}
                                        <div className="absolute left-0 top-0 h-1 w-0 bg-text-primary dark:bg-text-primary-dark group-hover:w-full"></div>

                                        {/* Number */}
                                        <span className="absolute right-5 top-12 text-5xl font-extrabold text-transparent stroke-text group-hover:text-gray-200 dark:group-hover:text-gra">
                                            {item.number}
                                        </span>

                                        {/* Icon */}
                                        <div className="mt-4 w-12 h-12 flex items-center justify-center rounded-xl bg-bg-primary dark:bg-bg-secondary text-text-primary-dark dark:text-text-primary hover:bg-gray-800 dark:hover:bg-gray-200 transition">
                                            <Icon size={24} />
                                        </div>

                                        {/* Title */}
                                        <h3 className="mt-5 text-xl font-semibold text-text-primary dark:text-text-primary-dark">
                                            {item.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="mt-3 text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </Container>

            {/* Our Values */}
            <Container className={`pt-14`}>
                <div className="">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary-dark">Our Core Values</h2>
                    <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mb-8 mt-4">
                        We don't compromise on what matters most.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-full mx-auto">
                        {[
                            { icon: "🔒", title: "Privacy First", desc: "Your data never leaves our secure platform." },
                            { icon: "⚡", title: "Simplicity", desc: "No learning curve. No complicated forms." },
                            { icon: "🚀", title: "Efficiency", desc: "Time is money—especially in fashion closeouts." },
                            { icon: "🤝", title: "Trust", desc: "Transparency isn't just a feature; it's our foundation." }
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-b from-bg-primary/[0.03] to-transparent dark:from-white/[0.03] dark:to-transparent p-6 rounded-xl border border-gray-200 dark:border-bg-primary-light shadow-sm hover:shadow-md transition duration-300"
                            >
                                <div className="text-3xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-text-primary dark:text-text-primary-dark">{value.title}</h3>
                                <p className="text-text-secondary dark:text-text-secondary-dark">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>

            {/* Highlights */}
            <section
                ref={highlightsRef}
                className={`dark:bg-bg-primary py-14 ${highlightsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
            >
                <Container>
                    {/* label */}
                    <div className="inline-flex items-center gap-2 bg-bg-primary dark:bg-bg-secondary text-text-primary-dark dark:text-text-primary text-sm px-4 py-1.5 rounded-md mb-6 font-semibold tracking-wide">
                        → HIGHLIGHTED
                    </div>

                    {/* heading */}
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
                        Our Featured <span className="text-text-secondary dark:text-text-secondary-dark font-medium italic">Highlights.</span>
                    </h2>

                    {/* features */}
                    <div className="grid md:grid-cols-4 mt-8 border-t border-b border-gray-200 dark:border-bg-primary-light">
                        {highlights.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className={`py-10 px-6 text-center md:text-left ${i !== highlights.length - 1
                                        ? "md:border-r border-gray-200 dark:border-bg-primary-light"
                                        : ""
                                        }`}
                                >
                                    <Icon size={40} strokeWidth={1} className="text-text-primary dark:text-text-primary-dark mb-6 mx-auto md:mx-0" />

                                    <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-3">
                                        {item.title}
                                    </h3>

                                    <p className="text-text-secondary dark:text-text-secondary-dark leading-relaxed text-sm max-w-xs mx-auto md:mx-0">
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left mt-14">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                                    <Icon size={40} strokeWidth={1} className="text-text-secondary dark:text-text-secondary-dark" />

                                    <div>
                                        <div className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                                            {stat.value}{" "}
                                            {/* <span className="text-base font-medium text-text-secondary dark:text-text-secondary-dark">
                                                {stat.label}
                                            </span> */}
                                        </div>
                                        <p className="text-text-secondary dark:text-text-secondary-dark text-xs">{stat.sub}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Container>
            </section>
        </section>
    );
}

export default About;