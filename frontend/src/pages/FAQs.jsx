import { Container } from "../components";
import { MessageCircleQuestion, Search, Shield, HelpCircle, Phone, Mail, Car, CreditCard, Truck, Store, FileText, Clock, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { otherData } from "../assets";

const { phone, email, address } = otherData;

const faqs = [
    {
        category: "Bidder",
        icon: <Gavel size={20} />,
        questions: [
            {
                question: `Who can bid on ${otherData?.brandName}?`,
                answer: `${otherData?.brandName} is open to everyone—luxury shoppers, vintage collectors, resellers, and fashion enthusiasts across the United States and beyond. Anyone can register and start bidding.`
            },
            {
                question: `Are there any fees for buyers?`,
                answer: `Yes. A buyer's premium (a small percentage of the winning bid amount) is added to all successful purchases. The exact percentage is clearly displayed before you bid—no surprises.`
            },
            {
                question: `What is the deposit required to bid?`,
                answer: `A deposit is required before placing your first bid. This can be a fixed amount or a percentage of your bid, depending on the listing. It secures your bidding power on the platform.`
            },
            {
                question: `Can I inspect items before bidding?`,
                answer: `In-person inspection is not available. However, sellers are responsible for providing accurate descriptions and photos. If you have questions about a listing, contact us and we'll help where we can.`
            },
            {
                question: `Are items sold with a return policy?`,
                answer: `All sales are final. Items are sold 'as-is' based on seller descriptions. Be sure to review all photos and details carefully before placing your bid.`
            },
            {
                question: `How does the 'Make Offer' feature work?`,
                answer: `On eligible listings, you can submit an offer below the asking price. If the seller accepts, a binding agreement is formed and payment must be completed promptly.`
            },
            {
                question: `Are bids and Buy Now purchases binding?`,
                answer: `Yes. All bids, accepted offers, and Buy Now purchases are legally binding contracts. Bid retractions are not permitted.`
            }
        ]
    },
    {
        category: `Payments`,
        icon: <CreditCard size={20} />,
        questions: [
            {
                question: `What payment methods do you accept?`,
                answer: `We accept card payments through Stripe and bank transfers via Wise. All transactions are processed securely in USD.`
            },
            {
                question: `How does escrow work?`,
                answer: `${otherData?.brandName} holds all payments securely after a winning bid. Funds are only released to the seller once you confirm delivery or the transaction is finalized. This protects both buyers and sellers.`
            },
            {
                question: `How long do I have to make payment?`,
                answer: `Payment terms vary by listing. Check the specific auction or item for your payment deadline. Prompt payment ensures smooth delivery.`
            },
            {
                question: `Is off-platform communication or payment allowed?`,
                answer: `No. All communication, offers, and payments must go through ${otherData?.brandName}. Off-platform activity violates our terms and may result in account suspension.`
            }
        ]
    },
    {
        category: `Shipping & Delivery`,
        icon: <Truck size={20} />,
        questions: [
            {
                question: `Who handles shipping?`,
                answer: `Buyers and sellers arrange delivery directly with each other. ${otherData?.brandName} facilitates payment through escrow but does not handle physical shipping.`
            },
            {
                question: `When is payment released to the seller?`,
                answer: `Funds are held in escrow until you confirm receipt of your items or the delivery process is finalized. Once confirmed, payment is released to the seller.`
            },
            {
                question: `What if something goes wrong with delivery?`,
                answer: `Since buyers and sellers arrange shipping directly, we recommend agreeing on shipping terms before bidding. If issues arise, contact our support team and we'll help mediate.`
            }
        ]
    },
    {
        category: `Sellers`,
        icon: <Store size={20} />,
        questions: [
            {
                question: `How do I start selling on ${otherData?.brandName}?`,
                answer: `Register as a seller and start listing your fashion closeouts—from luxury overstock to vintage collections. Our platform makes it easy to reach serious buyers.`
            },
            {
                question: `What are your seller fees?`,
                answer: `We charge a small percentage-based commission on successful sales. The exact rate depends on the category and listing type—competitive and transparent.`
            },
            {
                question: `How do I get paid?`,
                answer: `Once the buyer confirms delivery, funds are released from escrow to your account. You can then withdraw via bank transfer or card through our secure payment partners.`
            },
            {
                question: `Do you provide authentication or inspection services?`,
                answer: `Sellers are responsible for their own listings, including descriptions and photos. We recommend providing clear, accurate information to build trust with buyers.`
            }
        ]
    },
    {
        category: `Support`,
        icon: <Clock size={20} />,
        questions: [
            {
                question: `What are your support hours?`,
                answer: `We're available 24/7 US time. Our team is always here to help with questions, concerns, or guidance.`
            },
            {
                question: `What languages do you support?`,
                answer: `Our support team is available in multiple languages, including: English, Spanish, Chinese, Korean, Indonesian, Vietnamese, and Bengali.`
            },
            {
                question: `How can I contact ${otherData?.brandName}?`,
                answer: `Email: ${otherData?.email} | Phone: ${otherData?.phoneCode} ${otherData?.formatPhone(otherData?.phone)} | We're here 24/7 to assist you.`
            }
        ]
    }
];

function FAQsPage() {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("Bidder");

    const filteredFaqs = faqs.flatMap(category =>
        category.questions.filter(q =>
            (activeCategory === "all" || category.category === activeCategory) &&
            (q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchTerm.toLowerCase()))
        ).map(q => ({ ...q, category: category.category }))
    );

    return (
        <section className="pt-24 md:pt-32 bg-bg-secondary dark:bg-bg-primary max-w-full">
            {/* Hero Section */}
            <div className="animate-[fadeUp_0.7s_ease_forwards] opacity-0">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-primary dark:bg-bg-secondary rounded-full mb-4">
                            <span className="w-2 h-2 bg-text-primary-dark dark:bg-text-primary rounded-full"></span>
                            <span className="text-sm font-semibold text-text-primary-dark dark:text-text-primary">FAQ Center</span>
                        </div>
                        <div className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-text-primary-dark">
                                Frequently Asked <span className="italic text-text-secondary dark:text-text-secondary-dark">Questions</span>
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-12">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search for answers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-bg-secondary dark:bg-bg-primary border border-gray-200 dark:border-bg-primary-light rounded-xl shadow-sm focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent outline-none text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="pb-16">
                <div className="grid lg:grid-cols-[320px,1fr] gap-10">

                    {/* LEFT SIDEBAR */}
                    <div className="space-y-6 animate-[slideLeft_0.7s_ease_forwards] opacity-0">

                        {/* Category Box */}
                        <div className="bg-gradient-to-b from-bg-primary/[0.03] to-transparent dark:from-white/[0.03] dark:to-transparent rounded-2xl p-6 space-y-2 border border-gray-200 dark:border-bg-primary-light">
                            {faqs.map((cat) => (
                                <button
                                    key={cat.category}
                                    onClick={() => setActiveCategory(cat.category)}
                                    className={`w-full text-left px-5 py-4 rounded-xl border-b border-gray-200 dark:border-bg-primary-light transition font-medium
                                        ${activeCategory === cat.category
                                            ? "bg-bg-primary dark:bg-bg-secondary text-text-primary-dark dark:text-text-primary shadow"
                                            : "text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                                >
                                    {cat.category}
                                </button>
                            ))}
                        </div>

                        {/* Help Card */}
                        <div className="bg-gradient-to-b from-bg-primary/[0.03] to-transparent dark:from-white/[0.03] dark:to-transparent rounded-2xl p-6 text-center border border-gray-200 dark:border-bg-primary-light">
                            <h3 className="font-semibold text-lg mb-4 text-text-primary dark:text-text-primary-dark">
                                Didn't find your answer? Ask directly!
                            </h3>

                            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center border rounded-full text-text-primary dark:text-text-primary-dark border-gray-300 dark:border-bg-primary-light">
                                <Mail size={22} />
                            </div>

                            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">To Send Mail</p>
                            <Link to={`mailto:${otherData.email}`} className="font-semibold hover:underline text-text-primary dark:text-text-primary-dark">{otherData?.email}</Link>
                        </div>

                    </div>

                    {/* RIGHT SIDE QUESTIONS */}
                    <div className="space-y-5">

                        {faqs
                            .filter(cat => activeCategory === "all" || cat.category === activeCategory)
                            .flatMap(cat =>
                                cat.questions.map(q => ({
                                    ...q,
                                    category: cat.category
                                }))
                            )
                            .filter(faq =>
                                faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((faq, index) => (

                                <div
                                    key={index}
                                    className="bg-bg-secondary dark:bg-bg-primary border border-gray-200 dark:border-bg-primary-light rounded-2xl overflow-hidden opacity-0 animate-[fadeUp_0.6s_ease_forwards]"
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full flex items-center justify-between px-6 py-5 text-left"
                                    >
                                        <span className="font-semibold text-text-primary dark:text-text-primary-dark">
                                            {faq.question}
                                        </span>

                                        <span className={`w-9 h-9 flex items-center justify-center rounded-full transition
                                            ${openIndex === index
                                                ? "bg-bg-primary dark:bg-bg-secondary-dark rotate-45"
                                                : "bg-bg-primary-light dark:bg-bg-secondary hover:bg-bg-primary dark:hover:bg-bg-secondary-dark"}`}
                                        >
                                            <span className="text-xl font-bold text-text-primary-dark dark:text-text-primary">+</span>
                                        </span>
                                    </button>

                                    <div className={`transition-all duration-300 overflow-hidden
                                        ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                                    >
                                        <p className="px-6 pb-6 text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </Container>

        </section>
    );
}

export default FAQsPage;