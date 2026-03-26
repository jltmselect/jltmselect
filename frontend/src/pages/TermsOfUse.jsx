import { Link } from "react-router-dom";
import { Container } from "../components";
import { otherData } from "../assets";

const { phone, email, address } = otherData;

const TermsOfUse = () => {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-3">Terms of Use</h1>
                    <p className="text-text-secondary dark:text-text-secondary-dark mb-6">{otherData?.brandName} | Last Updated: {formattedDate}</p>

                    <div className="bg-bg-primary dark:bg-bg-secondary border-l-4 border-text-primary dark:border-text-primary-dark p-4 mb-6">
                        <p className="text-text-primary-dark dark:text-text-primary font-semibold mb-2">IMPORTANT – PLEASE READ</p>
                        <p className="text-text-primary-dark/80 dark:text-text-primary/80 text-sm">
                            These Terms govern your use of {otherData?.brandName}. By registering or using our platform,
                            you confirm your agreement to these Terms. All fashion items are sold on an "as-is"
                            basis without warranties unless otherwise stated.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-full mx-auto">
                    <div className="space-y-8">
                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-text-primary dark:text-text-primary-dark mb-4">
                                <strong>{otherData?.brandName}</strong> ("we", "our", "us") operates an online marketplace for fashion
                                closeout auctions, including luxury pieces, vintage collections, and curated clothing bundles.
                                These Terms of Use ("Terms") govern your access to and use of our website, platform, and services.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark">
                                By registering for, accessing, or using the Platform, you agree to be bound by these Terms.
                            </p>
                        </div>

                        {/* Section 1 - Platform Access */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">1. Platform Access</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>{otherData?.brandName} is open to luxury shoppers, vintage collectors, resellers, and fashion enthusiasts</li>
                                <li>All users must register and maintain accurate account information</li>
                                <li>We reserve the right to refuse or terminate access at our discretion</li>
                                <li>Users must comply with all applicable US federal and state laws</li>
                            </ul>
                        </div>

                        {/* Section 2 - Account Registration */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">2. Account Registration</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Registration is free</li>
                                <li>You must provide accurate and complete information</li>
                                <li>You are responsible for maintaining account security</li>
                                <li>We may suspend or terminate accounts for misuse or non-payment</li>
                                <li>Account sharing or transferring is prohibited without consent</li>
                            </ul>
                        </div>

                        {/* Section 3 - Our Role */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">3. Our Role</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">{otherData?.brandName} acts as:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li><strong className="text-text-primary dark:text-text-primary-dark">Intermediary:</strong> Facilitating sales between third-party sellers and buyers</li>
                                <li><strong className="text-text-primary dark:text-text-primary-dark">Escrow Agent:</strong> Holding funds securely until delivery is confirmed</li>
                            </ul>
                            <div className="bg-bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="text-text-primary-dark dark:text-text-primary font-semibold">
                                    {otherData?.brandName} manages the transaction and payment process but does not handle physical shipping.
                                </p>
                            </div>
                        </div>

                        {/* Section 4 - Transactions */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">4. Auctions, Offers & Buy Now</h2>
                            <div className="bg-bg-primary dark:bg-bg-secondary p-4 rounded mb-3">
                                <p className="text-text-primary-dark dark:text-text-primary font-semibold mb-2">LEGALLY BINDING COMMITMENTS</p>
                                <ul className="text-text-primary-dark/90 dark:text-text-primary/90 space-y-1 list-disc pl-5">
                                    <li>All bids, offers, and Buy Now purchases are legally binding contracts</li>
                                    <li>Bid retractions are not permitted</li>
                                    <li>A deposit is required before placing your first bid</li>
                                    <li>Failure to complete payment constitutes a breach of contract</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 5 - Buyer Fees & Deposit */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">5. Buyer Fees & Deposit</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>A buyer's premium (percentage of winning bid) applies to all successful purchases</li>
                                <li>A deposit is required before placing your first bid – amount varies by listing</li>
                                <li>All fees are clearly displayed before you bid, offer, or buy</li>
                                <li>All transactions are processed in USD</li>
                            </ul>
                        </div>

                        {/* Section 6 - Seller Fees */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">6. Seller Fees</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Sellers are charged a small percentage-based commission on successful sales.
                                Sellers are responsible for creating accurate listings, including descriptions and images.
                                Fee structures are transparent and clearly communicated.
                            </p>
                        </div>

                        {/* Section 7 - Payments & Escrow */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">7. Payments & Escrow</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>We accept card payments via Stripe and bank transfers via Wise</li>
                                <li>All payments are held in escrow until delivery is confirmed</li>
                                <li>Funds are released to sellers only after buyer confirms receipt</li>
                                <li>Payment terms vary by listing – check each auction for deadlines</li>
                                <li>All payments must be made in USD</li>
                            </ul>
                        </div>

                        {/* Section 8 - Shipping & Delivery */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">8. Shipping & Delivery</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Buyers and sellers arrange shipping directly with each other</li>
                                <li>{otherData?.brandName} does not handle physical shipping or logistics</li>
                                <li>We recommend agreeing on shipping terms before bidding</li>
                                <li>Risk transfers to buyer upon delivery confirmation</li>
                                <li>Funds remain in escrow until delivery is finalized</li>
                            </ul>
                        </div>

                        {/* Section 9 - Sold As Is – No Returns */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">9. Sold As Is – No Returns</h2>
                            <div className="bg-bg-primary dark:bg-bg-secondary p-4 rounded mb-3">
                                <p className="text-text-primary-dark dark:text-text-primary font-bold text-center mb-2">ALL ITEMS ARE SOLD:</p>
                                <div className="text-center space-y-1">
                                    <p className="text-text-primary-dark dark:text-text-primary">As-is / "Final Sale"</p>
                                    <p className="text-text-primary-dark dark:text-text-primary">Without any warranty</p>
                                    <p className="text-text-primary-dark dark:text-text-primary">No returns accepted</p>
                                </div>
                            </div>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Item descriptions and photos are provided by sellers for guidance only. Buyers are encouraged
                                to review all details carefully and ask questions before bidding. All sales are final.
                            </p>
                        </div>

                        {/* Section 10 - Inspections & Authentication */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">10. Inspections & Authentication</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Physical inspections are not available before bidding</li>
                                <li>{otherData?.brandName} does not provide authentication services</li>
                                <li>Sellers are responsible for accurate descriptions</li>
                                <li>If you have concerns after winning, contact us and we'll help mediate</li>
                            </ul>
                        </div>

                        {/* Section 11 - Title & Risk */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">11. Title & Risk</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Legal title and ownership pass only when full payment is received</li>
                                <li>Risk of loss or damage transfers to buyer upon delivery confirmation</li>
                                <li>Buyers are responsible for insurance from the moment of delivery</li>
                            </ul>
                        </div>

                        {/* Section 12 - Default & Enforcement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">12. Default & Enforcement</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">If payment is not completed, we may:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Cancel the sale and relist the item</li>
                                <li>Seek recovery of any losses or costs incurred</li>
                                <li>Suspend or permanently terminate the user's account</li>
                                <li>Report to relevant authorities if fraud is suspected</li>
                            </ul>
                        </div>

                        {/* Section 13 - Limitation of Liability */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">13. Limitation of Liability</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                To the extent permitted by US law, {otherData?.brandName}'s total liability is limited to the
                                purchase price of the item in question. We are not liable for indirect or consequential
                                losses. This does not limit liability for fraud, death, or personal injury caused by negligence.
                            </p>
                        </div>

                        {/* Section 14 - Governing Law */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">14. Governing Law & Disputes</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>These Terms are governed by the laws of the United States</li>
                                <li>Disputes shall be resolved by the courts of the United States</li>
                                <li>{otherData?.brandName} is located at {address}</li>
                            </ul>
                        </div>

                        {/* Section 15 - Changes to Terms */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">15. Changes to These Terms</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                We may update these Terms from time to time. The "Last Updated" date indicates the most
                                recent version. Material changes will be communicated via email or platform notice.
                                Continued use after changes constitutes acceptance.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-4">Contact Information</h2>
                            <div className="bg-bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="font-semibold text-text-primary-dark dark:text-text-primary mb-2">{otherData?.brandName}</p>
                                <p className="text-text-primary-dark dark:text-text-primary text-sm mb-1 whitespace-pre-line">{address}</p>
                                <p className="text-text-primary-dark dark:text-text-primary text-sm mb-1">
                                    Email: <a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400 hover:underline break-all">{email}</a>
                                </p>
                                <p className="text-text-primary-dark dark:text-text-primary text-sm">
                                    Phone: <a href={`tel:${phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">{otherData?.phoneCode} {otherData?.formatPhone(phone)}</a>
                                </p>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
                                These Terms were last updated on {formattedDate}. If you have questions about these Terms,
                                please contact us at <a href={`mailto:${email}`} className="text-text-primary dark:text-text-primary-dark hover:underline">{email}</a>.
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-wrap gap-3">
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

export default TermsOfUse;