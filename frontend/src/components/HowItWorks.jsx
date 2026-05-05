import { UserCheck, Car, DollarSign, Tractor, Sofa, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function HowItWorks() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const steps = [
        {
            icon: UserCheck,
            title: "Subscribe to JLTM Select",
            desc: "Subscribe and instantly access 15% discounts, auctions, free storage, and much more."
        },
        {
            icon: Sofa,
            title: "Bid on Items",
            desc: "Bid on items starting at 85% or more off retail price."
        },
        {
            icon: Truck,
            title: "Pickup Winning Bids",
            desc: "Pay Online, Free 7-day storage, Pickup items at the JLTM Costa Mesa showroom."
        }
    ];

    return (
        <section ref={ref} className="pt-10 pb-14 bg-secondary/10 rounded-xl overflow-hidden">
            <div className="text-center mb-16">
                <p className="text-sm text-secondary font-semibold tracking-widest uppercase mb-2">
                    Start now
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-pure-white">
                    How It Works
                </h2>
            </div>

            <div className="relative max-w-full px-10 mx-auto grid md:grid-cols-3 gap-12 text-center">

                <svg
                    className="hidden md:block absolute z-40 opacity-25 top-16 left-[20%] pointer-events-none"
                    width="220"
                    height="140"
                    viewBox="0 0 220 140"
                    fill="none"
                >
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="10"
                            refX="5"
                            refY="5"
                            orient="auto"
                        >
                            <path d="M0,0 L10,5 L0,10 Z" fill="#C9A84C" />
                        </marker>
                    </defs>

                    <path
                        d="M10 20 C 140 -10, 90 140, 200 100"
                        stroke="#C9A84C"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="7 7"
                        markerEnd="url(#arrowhead)"
                        className="animate-dash"
                    />
                </svg>

                <svg
                    className="hidden md:block absolute bottom-6 opacity-25 z-40 right-[20%] pointer-events-none"
                    width="220"
                    height="140"
                    viewBox="0 0 220 140"
                    fill="none"
                >
                    <path
                        d="M10 110 C 140 150, 90 -20, 200 30"
                        stroke="#C9A84C"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="7 7"
                        markerEnd="url(#arrowhead)"
                        className="animate-dash"
                    />
                </svg>


                {steps.map((step, i) => {
                    const Icon = step.icon;

                    return (
                        <div
                            key={i}
                            className={`transition-all duration-700 bg-white p-5 rounded-xl ${visible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-12"
                                }`}
                            style={{ transitionDelay: `${i * 200}ms` }}
                        >
                            {/* Icon Card */}
                            <div className="relative inline-flex items-center justify-center mb-6">
                                <div className="absolute w-24 h-24 bg-red-100 rounded-2xl blur-xl opacity-60"></div>

                                <div className="w-20 h-20 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 hover:-translate-y-1">
                                    <Icon size={34} />
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {step.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed z-50 text-sm max-w-xs mx-auto">
                                {step.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default HowItWorks;
