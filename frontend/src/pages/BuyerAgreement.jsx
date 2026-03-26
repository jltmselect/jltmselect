import { Link } from "react-router";
import { Container } from "../components";
import { otherData } from "../assets";

const { phone, email, address } = otherData;

const BuyerAgreement = () => {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-3">Buyer Agreement</h1>
                    <p className="text-text-secondary dark:text-text-secondary-dark mb-6">{otherData?.brandName} | Last Updated: {formattedDate}</p>

                    <div className="bg-bg-primary dark:bg-bg-secondary border-l-4 border-text-primary dark:border-text-primary-dark p-4 mb-6">
                        <p className="text-text-primary-dark dark:text-text-primary font-semibold mb-2">IMPORTANT – PLEASE READ CAREFULLY</p>
                        <p className="text-text-primary-dark dark:text-text-primary text-sm">
                            This Buyer Agreement governs all purchases made through {otherData?.brandName}.
                            By placing a bid, making an offer, or using Buy Now, you agree to be bound by this Agreement.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-full mx-auto">
                    <div className="space-y-8">
                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-text-primary dark:text-text-primary-dark mb-4">
                                <strong>{otherData?.brandName}</strong> ("we", "our", "us") and you, the buyer ("Buyer"),
                                enter into this Buyer Agreement governing all purchases made through our fashion closeout auction platform.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark">
                                By placing a bid, making an offer, or using Buy Now, you agree to be bound by this Agreement.
                            </p>
                        </div>

                        {/* Section 1 - Eligibility */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">1. Eligibility</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>{otherData?.brandName} is open to luxury shoppers, vintage collectors, resellers, and fashion enthusiasts</li>
                                <li>All buyers must register and maintain accurate account information</li>
                                <li>We reserve the right to verify identity and eligibility</li>
                                <li>Buyers must be at least 18 years of age</li>
                            </ul>
                        </div>

                        {/* Section 2 - Deposit Requirement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">2. Deposit Requirement</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>A deposit is required before placing your first bid</li>
                                <li>Deposit amounts may be fixed or a percentage of your bid, depending on the listing</li>
                                <li>The deposit secures your bidding power on the platform</li>
                                <li>Deposit terms are clearly displayed before you place your first bid</li>
                            </ul>
                        </div>

                        {/* Section 3 - Binding Contract */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">3. Binding Contract</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">A legally binding contract is formed when:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>You win an auction (highest bid at closing)</li>
                                <li>Your offer is accepted by the seller</li>
                                <li>You complete a Buy Now purchase</li>
                            </ul>
                            <div className="bg-bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="text-text-primary-dark dark:text-text-primary font-semibold text-sm">
                                    All bids, offers, and Buy Now actions are legally binding. Bid retractions are not permitted.
                                </p>
                            </div>
                        </div>

                        {/* Section 4 - Buyer Fees */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">4. Buyer Fees</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                A buyer's premium (a percentage of the winning bid amount) applies to all successful purchases.
                                The exact percentage is clearly displayed before you bid, make an offer, or complete a Buy Now purchase.
                                All fees are in USD and are non-refundable except as required by applicable law.
                            </p>
                        </div>

                        {/* Section 5 - Item Condition */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">5. Item Condition</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">All fashion items are sold:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>As-is / "Final Sale"</li>
                                <li>Without any warranty, express or implied</li>
                                <li>No returns accepted</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
                                Descriptions, photographs, and specifications are provided by sellers for guidance only and do not
                                form part of any contractual warranty. Buyers are responsible for reviewing all details before bidding.
                            </p>
                        </div>

                        {/* Section 6 - Inspections & Authentication */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">6. Inspections & Authentication</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Physical inspections are not available before bidding</li>
                                <li>{otherData?.brandName} does not provide authentication services</li>
                                <li>Sellers are responsible for accurate descriptions and photos</li>
                                <li>If you have questions about a listing, please contact us before bidding</li>
                                <li>Failure to ask questions before bidding is at the buyer's sole risk</li>
                            </ul>
                        </div>

                        {/* Section 7 - Concerns After Purchase */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">7. Concerns After Purchase</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">
                                If you have concerns after winning an auction or completing a purchase:
                            </p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Contact us immediately at <a href={`mailto:${email}`} className="text-text-primary dark:text-text-primary-dark hover:underline">{email}</a></li>
                                <li>We will review your concerns and help mediate between buyer and seller</li>
                                <li>Returns are not accepted as all sales are final</li>
                                <li>Any disputes are handled in good faith with both parties</li>
                            </ul>
                        </div>

                        {/* Section 8 - Payment & Escrow */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">8. Payment & Escrow</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>We accept card payments via Stripe and bank transfers via Wise</li>
                                <li>All payments are held in escrow until delivery is confirmed</li>
                                <li>Funds are released to sellers only after you confirm receipt</li>
                                <li>Payment terms vary by listing – check each auction for specific deadlines</li>
                                <li>All payments must be made in USD</li>
                                <li>Title and ownership pass only after full payment is received</li>
                            </ul>
                        </div>

                        {/* Section 9 - Shipping & Delivery */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">9. Shipping & Delivery</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Buyers and sellers arrange shipping directly with each other</li>
                                <li>{otherData?.brandName} does not handle physical shipping or logistics</li>
                                <li>We recommend agreeing on shipping terms and costs before bidding</li>
                                <li>Risk of loss or damage transfers to the buyer upon delivery confirmation</li>
                                <li>Funds remain in escrow until you confirm delivery</li>
                                <li>Buyers are responsible for insurance from the moment of delivery</li>
                            </ul>
                        </div>

                        {/* Section 10 - Default & Enforcement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">10. Default & Enforcement</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">If payment is not completed within the required timeframe, we may:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Cancel the sale and relist the item</li>
                                <li>Seek recovery of any losses or costs incurred</li>
                                <li>Suspend or permanently terminate the buyer's account</li>
                                <li>Report to relevant authorities if fraud is suspected</li>
                            </ul>
                        </div>

                        {/* Section 11 - Limitation of Liability */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">11. Limitation of Liability</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                To the extent permitted by US law, {otherData?.brandName}'s total liability is limited to the
                                purchase price of the item in question. We are not liable for indirect or consequential
                                losses including but not limited to lost profits or business interruption.
                                This does not limit liability for fraud, death, or personal injury caused by negligence.
                            </p>
                        </div>

                        {/* Section 12 - Governing Law */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">12. Governing Law & Disputes</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>This Agreement is governed by the laws of the United States</li>
                                <li>Any disputes shall be resolved by the courts of the United States</li>
                                <li>{otherData?.brandName} is located at {address}</li>
                            </ul>
                        </div>

                        {/* Section 13 - Entire Agreement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">13. Entire Agreement</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                This Buyer Agreement, together with our Terms of Use and Privacy Policy, constitutes the
                                entire agreement between you and {otherData?.brandName} regarding your purchases on our platform.
                            </p>
                        </div>

                        {/* Acceptance & Contact */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-4">Acceptance & Contact</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-4">
                                By using {otherData?.brandName}, you acknowledge that you have read, understood, and agree to this Buyer Agreement.
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
                                This Buyer Agreement was last updated on {formattedDate}. It forms an integral part of
                                the contract for every fashion purchase made through {otherData?.brandName}.
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
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default BuyerAgreement;