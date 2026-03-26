import { heroImg, otherData } from "../assets";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center text-center text-white">

            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={heroImg}
                    alt="Fashion Auction"
                    className="absolute inset-0 w-full h-full object-cover animate-slowZoom"
                />
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl px-6 animate-fadeUp">

                {/* Small Badge */}
                <div className="inline-block border border-white/40 px-6 py-2 text-sm tracking-widest mb-6">
                    WHERE STYLE MEETS STRATEGY
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold mb-4">
                    {otherData?.brandName}
                </h1>

                {/* Sub Heading */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl italic font-serif tracking-wide mb-6">
                    The No. 1 Anti-Garment Waste Web
                </h2>

                {/* Description */}
                <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed mb-6">
                    Every year, 100 billion garments are crafted worldwide. Yet, 30% never find a owner—never draped, never worn. At {otherData?.brandName}, we give these pieces a second chance to become part of your story.
                </p>

                <p className="inline-block">
                    <Link to="/auctions" className="text-white font-medium transition duration-300 flex items-center gap-2 group relative">
                        <span className="">Explore Auctions</span>
                        <ArrowRightIcon className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </p>

            </div>

            <style>{`
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slowZoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
  }
}

.animate-fadeUp {
  animation: fadeUp 1s ease forwards;
}

.animate-slowZoom {
  animation: slowZoom 20s ease-in-out infinite alternate;
}
`}</style>
        </section>
    );
}

export default Hero;