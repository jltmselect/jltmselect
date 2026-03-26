import { Link } from "react-router";
import { Container } from "../components";
import { otherData } from "../assets";

const { phone, email, address } = otherData;

const SellerAgreement = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <section className="pt-28 pb-16 bg-bg-secondary dark:bg-bg-primary">
            <Container>
                {/* Header */}
                <div className="max-w-full mx-auto mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-3">Seller Agreement</h1>
                    <p className="text-text-secondary dark:text-text-secondary-dark mb-6">{otherData?.brandName} | Last Updated: {formattedDate}</p>

                    <div className="bg-bg-primary dark:bg-bg-secondary border-l-4 border-text-primary dark:border-text-primary-dark p-4 mb-6">
                        <p className="text-text-primary-dark dark:text-text-primary font-semibold mb-2">IMPORTANT – PLEASE READ CAREFULLY</p>
                        <p className="text-text-primary-dark dark:text-text-primary text-sm">
                            This Seller Agreement governs all listings and sales made through {otherData?.brandName}.
                            By listing fashion items on our platform, you agree to be bound by this Agreement.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-full mx-auto">
                    <div className="space-y-8">
                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-text-primary dark:text-text-primary-dark mb-4">
                                <strong>{otherData?.brandName}</strong> ("we", "our", "us") and you, the seller ("Seller"),
                                enter into this Seller Agreement governing all fashion listings and sales made through our closeout auction platform.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark">
                                By creating a listing, you agree to be bound by this Agreement.
                            </p>
                        </div>

                        {/* Section 1 - Eligibility */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">1. Eligibility</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>{otherData?.brandName} is open to boutique owners, vintage dealers, resellers, and individuals</li>
                                <li>All sellers must register and maintain accurate account information</li>
                                <li>We reserve the right to verify identity and eligibility</li>
                                <li>Sellers must be at least 18 years of age</li>
                            </ul>
                        </div>

                        {/* Section 2 - Seller Fees */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">2. Seller Fees</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">{otherData?.brandName} charges sellers:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li><strong className="text-text-primary dark:text-text-primary-dark">Commission-based fee:</strong> A small percentage of the final sale price</li>
                            </ul>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">Important notes:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>No listing fees – you only pay when your item sells</li>
                                <li>Commission rates are clearly displayed before listing</li>
                                <li>Fees are deducted from sale proceeds before payout</li>
                                <li>All fees are in USD</li>
                            </ul>
                        </div>

                        {/* Section 3 - Seller Responsibilities */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">3. Seller Responsibilities</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">Sellers are solely responsible for:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Creating accurate and complete fashion listings</li>
                                <li>Providing clear, honest photographs showing condition and details</li>
                                <li>Ensuring all descriptions are truthful and not misleading</li>
                                <li>Disclosing any defects, damage, or signs of wear</li>
                                <li>Responding to buyer questions in a timely manner</li>
                                <li>Managing their own listings without additional services from {otherData?.brandName}</li>
                                <li>Complying with all applicable US federal and state laws</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm mt-3">
                                {otherData?.brandName} does not provide photography, authentication, or listing preparation services.
                            </p>
                        </div>

                        {/* Section 4 - Listing Accuracy */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">4. Listing Accuracy</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">Sellers must ensure:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Descriptions accurately reflect the item's brand, era, condition, size, and specifications</li>
                                <li>Photos show the actual item for sale, including any flaws or defects</li>
                                <li>All material facts that could affect a buyer's decision are disclosed</li>
                                <li>Authenticity is accurately represented (if claiming designer/luxury)</li>
                            </ul>
                            <div className="bg-bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="text-text-primary-dark dark:text-text-primary font-semibold mb-2">Consequences of Misleading Listings:</p>
                                <ul className="text-text-primary-dark dark:text-text-primary space-y-1 list-disc pl-5">
                                    <li>Auction suspension</li>
                                    <li>Account suspension or permanent ban</li>
                                    <li>Liability for any losses incurred by buyers</li>
                                    <li>Withheld or reversed payments</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 5 - Listing Withdrawal */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">5. Listing Withdrawal</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Sellers may withdraw listings at any time before bids or offers are received</li>
                                <li><strong className="text-text-primary dark:text-text-primary-dark">Withdrawal is not permitted during an active auction</strong> once bids have been placed</li>
                                <li>For "Make Offer" listings, withdrawal is not permitted once an offer is received</li>
                                <li>For Buy Now listings, withdrawal is not permitted once the item is purchased</li>
                                <li>Unauthorized withdrawal during active bidding may result in account suspension</li>
                            </ul>
                        </div>

                        {/* Section 6 - Contract Formation */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">6. Contract Formation</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">A legally binding contract is formed when:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>A buyer wins an auction (highest bid at closing)</li>
                                <li>A buyer's offer is accepted by the seller</li>
                                <li>A buyer completes a Buy Now purchase</li>
                            </ul>
                            <div className="bg-bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="text-text-primary-dark dark:text-text-primary font-semibold mb-2">Seller's Right to Reject Offers:</p>
                                <p className="text-text-primary-dark dark:text-text-primary">
                                    For "Make Offer" listings, sellers have the right to accept or reject any offer.
                                    No contract is formed until the seller explicitly accepts an offer.
                                </p>
                            </div>
                        </div>

                        {/* Section 7 - Payment to Sellers */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">7. Payment to Sellers</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>{otherData?.brandName} collects full payment from buyers and holds funds in escrow</li>
                                <li>Seller commissions are deducted from the sale proceeds</li>
                                <li>Payment to sellers is released only after:</li>
                                <ul className="pl-5 mt-1 space-y-1">
                                    <li className="text-text-secondary dark:text-text-secondary-dark">• Buyer confirms delivery</li>
                                    <li className="text-text-secondary dark:text-text-secondary-dark">• All transaction conditions are satisfied</li>
                                    <li className="text-text-secondary dark:text-text-secondary-dark">• No disputes or concerns are pending</li>
                                </ul>
                                <li>Payments are made via bank transfer (Wise) or card (Stripe) to the seller's registered account</li>
                                <li>All payments are in USD</li>
                            </ul>
                        </div>

                        {/* Section 8 - Transfer of Items */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">8. Transfer of Items</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Sellers are responsible for shipping items to buyers or arranging local pickup</li>
                                <li>Sellers must ship items promptly after sale and payment confirmation</li>
                                <li>Sellers must provide tracking information to buyers when available</li>
                                <li>Title and ownership transfer only after full payment is received by {otherData?.brandName}</li>
                                <li>Risk transfers to buyer upon delivery confirmation</li>
                                <li>Sellers are responsible for packaging items securely to prevent damage during shipping</li>
                            </ul>
                        </div>

                        {/* Section 9 - Seller Default */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">9. Seller Default</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">If a seller fails to ship items after a sale:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>{otherData?.brandName} will attempt to mediate and resolve the issue</li>
                                <li>We will work with both parties to find a fair solution</li>
                                <li>If resolution is not possible, the sale may be cancelled</li>
                                <li>Buyer will receive a full refund from escrow</li>
                            </ul>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">Consequences for seller default may include:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Account suspension or permanent ban</li>
                                <li>Liability for any losses incurred</li>
                                <li>Withheld payments</li>
                                <li>Legal action if warranted</li>
                            </ul>
                        </div>

                        {/* Section 10 - Items Not as Described */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">10. Items Not as Described</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">
                                If a buyer claims an item is significantly not as described:
                            </p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>{otherData?.brandName} will investigate the claim</li>
                                <li>We may request evidence from both parties (photos, descriptions, etc.)</li>
                                <li>If the listing was misleading, seller may be liable for:</li>
                                <ul className="pl-5 mt-1 space-y-1">
                                    <li className="text-text-secondary dark:text-text-secondary-dark">• Partial or full refund to buyer</li>
                                    <li className="text-text-secondary dark:text-text-secondary-dark">• Return shipping costs</li>
                                    <li className="text-text-secondary dark:text-text-secondary-dark">• Account suspension or ban</li>
                                </ul>
                            </ul>
                        </div>

                        {/* Section 11 - Prohibited Conduct */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">11. Prohibited Conduct</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Misleading or fraudulent listings</li>
                                <li>Shill bidding (bidding on your own items)</li>
                                <li>Off-platform transactions to avoid fees</li>
                                <li>Failing to complete sales without valid reason</li>
                                <li>Abusive communication with buyers</li>
                                <li>Listing counterfeit or stolen items</li>
                                <li>Misrepresenting authenticity of designer/luxury goods</li>
                            </ul>
                        </div>

                        {/* Section 12 - Limitation of Liability */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">12. Limitation of Liability</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                To the extent permitted by US law, {otherData?.brandName}'s total liability to sellers is limited to
                                the fees paid for the specific transaction in question. We are not liable for indirect or
                                consequential losses including lost profits. This does not limit liability for fraud, death,
                                or personal injury caused by negligence.
                            </p>
                        </div>

                        {/* Section 13 - Governing Law */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">13. Governing Law & Disputes</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>This Agreement is governed by the laws of the United States</li>
                                <li>Any disputes shall be resolved by the courts of the United States</li>
                                <li>{otherData?.brandName} is located at {address}</li>
                            </ul>
                        </div>

                        {/* Section 14 - Changes to Agreement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">14. Changes to This Agreement</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                We may update this Agreement from time to time. The "Last Updated" date indicates the most
                                recent version. Material changes will be communicated via email or platform notice.
                                Continued selling after changes constitutes acceptance.
                            </p>
                        </div>

                        {/* Section 15 - Entire Agreement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">15. Entire Agreement</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                This Seller Agreement, together with our Terms of Use and Privacy Policy, constitutes the
                                entire agreement between you and {otherData?.brandName} regarding your listings and sales on our platform.
                            </p>
                        </div>

                        {/* Acceptance & Contact */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-4">Acceptance & Contact</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-4">
                                By listing fashion items on {otherData?.brandName}, you acknowledge that you have read, understood, and agree
                                to this Seller Agreement.
                            </p>
                            <div className="bg-bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="font-semibold text-text-primary-dark dark:text-text-primary mb-2">{otherData?.brandName}</p>
                                <p className="text-text-primary-dark dark:text-text-primary text-sm mb-1 whitespace-pre-line">{address}</p>
                                <p className="text-text-primary-dark dark:text-text-primary text-sm mb-1">
                                    Email: <a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{email}</a>
                                </p>
                                <p className="text-text-primary-dark dark:text-text-primary text-sm">
                                    Phone: <a href={`tel:${phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">{otherData?.phoneCode} {otherData?.formatPhone(phone)}</a>
                                </p>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
                                This Seller Agreement was last updated on {formattedDate}. It forms an integral part of
                                the contract for every fashion listing made through {otherData?.brandName}.
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/terms-of-use"
                                className="px-4 py-2 bg-bg-primary dark:bg-bg-secondary border border-gray-200 dark:border-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 text-text-primary-dark dark:text-text-primary rounded text-sm font-medium transition-colors"
                            >
                                Terms of Use
                            </Link>
                            <Link
                                to="/privacy-policy"
                                className="px-4 py-2 bg-bg-primary dark:bg-bg-secondary border border-gray-200 dark:border-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 text-text-primary-dark dark:text-text-primary rounded text-sm font-medium transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/buyer-agreement"
                                className="px-4 py-2 bg-bg-primary dark:bg-bg-secondary border border-gray-200 dark:border-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 text-text-primary-dark dark:text-text-primary rounded text-sm font-medium transition-colors"
                            >
                                Buyer Agreement
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default SellerAgreement;