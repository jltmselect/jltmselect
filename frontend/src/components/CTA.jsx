import { useNavigate } from "react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import Container from "./Container";
import { useRef, useEffect, useState } from "react";

function CTA() {
    const navigate = useNavigate();

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
        <section ref={ref} className="relative py-10 bg-bg-primary border-b border-gray-800 overflow-hidden">

            {/* Subtle texture - white dots */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Grid overlay - white lines */}
            <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path
                                d="M 40 0 L 0 0 0 40"
                                fill="none"
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <Container>
                <div className="relative z-10 max-w-3xl mx-auto text-center">

                    {/* Badge */}
                    <span
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-300 bg-bg-primary-light border border-gray-700 rounded-full mb-8 tracking-wider transition-all duration-700 ${
                            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                    >
                        <Sparkles size={14} />
                        Fashion marketplace
                    </span>

                    {/* Heading */}
                    <h2
                        className={`text-4xl md:text-5xl font-semibold text-white leading-tight transition-all duration-700 delay-100 ${
                            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                    >
                        Start trading
                        <span className="block text-pure-white/80">
                            premium fashion
                        </span>
                    </h2>

                    {/* Subtext */}
                    <p
                        className={`text-lg text-pure-white/80 mt-5 mb-10 max-w-xl mx-auto transition-all duration-700 delay-200 ${
                            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                    >
                        The thrill of the bid. The joy of the find. The ease of the sale. Experience fashion trading the way it should be.
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={() => navigate("/register")}
                        className={`group relative overflow-hidden bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-white/10 transition-all duration-500 ${
                            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                    >
                        <span className="relative z-10 flex items-center gap-2 justify-center">
                            Create your account
                            <ArrowRight
                                size={20}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </span>

                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Stats */}
                    <div
                        className={`flex flex-wrap justify-center gap-8 mt-12 text-sm transition-all duration-700 delay-300 ${
                            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                    >
                        <div>
                            <span className="font-semibold text-pure-white">10k+</span>
                            <span className="text-pure-white/80 ml-2">members</span>
                        </div>

                        <div>
                            <span className="font-semibold text-pure-white">5k+</span>
                            <span className="text-pure-white/80 ml-2">items listed</span>
                        </div>

                        <div>
                            <span className="font-semibold text-pure-white">24/7</span>
                            <span className="text-pure-white/80 ml-2">live auctions</span>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}

export default CTA;