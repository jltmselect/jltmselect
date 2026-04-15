import { Link } from "react-router";
import { Container } from "../components";
import { otherData } from "../assets";

const { phone, email, address, brandName } = otherData;

const BuyerAgreement = () => {
    // Fixed dates as provided in the content
    const effectiveDate = "April 15th 2026";
    const lastUpdated = "April 15th 2026";

    return (
        <section className="pt-10 md:pt-16 bg-bg-secondary dark:bg-primary">
            {/* Header */}
            <div className="max-w-full mx-auto text-center px-6 py-16 bg-primary">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px w-8 bg-secondary"></div>
                    <span className="text-secondary text-xs font-medium uppercase tracking-[0.2em]">Legal Policy</span>
                    <div className="h-px w-8 bg-secondary"></div>
                </div>

                {/* headline */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-pure-white dark:text-text-primary-dark leading-tight">
                    Buyer Agreement
                </h1>
            </div>

            <Container className="my-14">
                {/* Main Content */}
                <div className="max-w-full mx-auto">
                    <div className="space-y-8">
                        {/* Header Info */}
                        <div className="mb-8 text-left">
                            <p className="text-text-primary text-xl dark:text-text-primary-dark font-medium">
                                <strong>{brandName} Select Buyer Agreement</strong>
                            </p>
                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm mt-1">
                                Effective Date: {effectiveDate} | Last Updated: {lastUpdated}
                            </p>
                        </div>

                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-text-primary dark:text-text-primary-dark mb-4">
                                <strong>{brandName} Select</strong> (“Just Like the Model,” “JLTM Inc”, “Company,” “we,” “us,” or “our”) operates, owns and governs an online, membership-based auction platform accessible at JLTMSelect.com (the “Platform”).
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark">
                                By registering, bidding, or purchasing on the Platform, you agree to be legally bound by this Agreement.
                            </p>
                        </div>

                        {/* Section 1 - Nature of the Platform */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">1. Nature of the Platform</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">
                                JLTM Inc dba Just Like the Model operates a membership-based, auction marketplace found at JLTMSelect.com.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2 font-medium">Each auction:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Offers items available in the showroom floor for auction</li>
                                <li>Is time-bound</li>
                                <li>Is awarded to the highest valid bidder at closing</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                This Agreement governs all buyer activity, including bidding, purchasing, and payment obligations. The platform also offers other perks such as in-store discounts and storage.
                            </p>
                        </div>

                        {/* Section 2 - Binding Nature of Bids */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">2. Binding Nature of Bids</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">By placing a bid, you acknowledge and agree:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Each bid constitutes a legally binding, irrevocable offer to purchase</li>
                                <li>Bids cannot be withdrawn, canceled, or modified once submitted</li>
                                <li>If you are the highest bidder at auction close, you are legally obligated to complete the purchase. This is done by logging back in to JLTMSelect.com and completing your purchase by paying online.</li>
                            </ul>
                            <div className="bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="text-text-primary-dark dark:text-text-primary text-sm">
                                    Failure to honor a winning bid constitutes a material breach of this Agreement and may result in account suspension or closure.
                                </p>
                            </div>
                        </div>

                        {/* Section 3 - Failure to Pay and Enforcement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">3. Failure to Pay and Enforcement</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">If your payment fails or you fail to login and pay for your winning bid for any reason:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Your account may be immediately suspended or terminated</li>
                                <li>You may forfeit rights to the item</li>
                            </ul>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2 font-medium">JLTM Select reserves the right to:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Re-list the item</li>
                                <li>Recover damages, including price differences</li>
                                <li>Charge additional administrative or recovery fees</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Repeated failures may result in permanent removal from the Platform.
                            </p>
                        </div>

                        {/* Section 4 - No Chargebacks and Payment Disputes */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">4. No Chargebacks and Payment Disputes</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">You agree:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Not to initiate chargebacks or payment disputes except in cases of verified fraud</li>
                                <li>That all bids and purchases are intentional and authorized</li>
                            </ul>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2 font-medium">Improper chargebacks may result in:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Immediate account termination</li>
                                <li>Permanent ban from the Platform</li>
                                <li>Legal action to recover funds, fees, and associated costs</li>
                            </ul>
                        </div>

                        {/* Section 5 - Item Condition and Buyer Responsibility */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">5. Item Condition and Buyer Responsibility</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">All items are sold:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>"As is" and "as available"</li>
                                <li>Without warranties unless explicitly stated</li>
                            </ul>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">
                                You may choose to inspect items before you bid by visiting the showroom floor. All items up for auction are displayed at the store for public viewing.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2 font-medium">Buyer acknowledges:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Responsibility to review item descriptions and images online</li>
                                <li>That minor variations, wear, or imperfections may exist</li>
                                <li>Items may be viewed in person at the Costa Mesa, California showroom</li>
                                <li>All sales are final, except where prohibited by law</li>
                            </ul>
                        </div>

                        {/* Section 6 - Pickup and Storage (NO DELIVERY) */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">6. Pickup, and Storage (NO DELIVERY)</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2 font-medium">Buyers are responsible for:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Arranging pickup or delivery within 5 business days of winning</li>
                                <li>We do not ship or deliver auction items. All items must be picked up in person.</li>
                            </ul>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2 font-medium">Storage Policy</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Items not collected within 5 days will incur a $5 per item per day storage fee</li>
                                <li>Items not collected after 10 days may be deemed abandoned</li>
                                <li>Abandoned items may be resold without a refund</li>
                            </ul>
                        </div>

                        {/* Section 7 - Membership Requirement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">7. Membership Requirement</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">
                                Auction participation requires an active membership.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">By maintaining a membership, you agree:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Fees are non-refundable once the billing period begins</li>
                                <li>Access to auctions is contingent on an active account</li>
                                <li>Lapsed memberships result in immediate loss of bidding privileges</li>
                            </ul>
                        </div>

                        {/* Section 8 - Account Integrity and Fair Use */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">8. Account Integrity and Fair Use</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">You agree to:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Use a single account</li>
                                <li>Provide accurate and truthful information</li>
                                <li>Maintain updated payment details</li>
                            </ul>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">You may not:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Use multiple accounts to manipulate auctions</li>
                                <li>Engage in bid manipulation or collusion</li>
                                <li>Interfere with platform operations</li>
                                <li>Share accounts with others who do not reside in your household</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Violations may result in immediate termination.
                            </p>
                        </div>

                        {/* Section 9 - Platform Authority and Auction Integrity */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">9. Platform Authority and Auction Integrity</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">JLTM Inc reserves the sole discretion to:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Determine the validity of bids</li>
                                <li>Resolve disputes or technical issues</li>
                                <li>Cancel or modify auctions when necessary</li>
                                <li>Disqualify bidders suspected of misconduct</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                All decisions made by JLTM Inc are final.
                            </p>
                        </div>

                        {/* Section 10 - Limitation of Liability */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">10. Limitation of Liability</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                To the fullest extent permitted by law: JLTM Inc is not liable for indirect, incidental, or consequential damages. Total liability shall not exceed the amount paid by the Buyer for the specific transaction.
                            </p>
                        </div>

                        {/* Section 11 - Indemnification */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">11. Indemnification</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">You agree to indemnify and hold harmless JLTM Select from any claims arising out of:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Your breach of this Agreement</li>
                                <li>Your misuse of the Platform</li>
                                <li>Your violation of applicable laws</li>
                            </ul>
                        </div>

                        {/* Section 12 - Privacy and Data Use */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">12. Privacy and Data Use</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">
                                Your use of the Platform is subject to the JLTM Inc Privacy Policy.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">The Privacy Policy governs:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Collection of bidding and transaction data</li>
                                <li>Payment processing practices</li>
                                <li>Data sharing and compliance obligations</li>
                            </ul>
                        </div>

                        {/* Section 13 - Termination */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">13. Termination</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">JLTM Inc may suspend or terminate your account at any time for:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Breach of this Agreement</li>
                                <li>Fraudulent or abusive conduct</li>
                                <li>Failure to complete payment obligations</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Termination does not eliminate outstanding liabilities.
                            </p>
                        </div>

                        {/* Section 14 - Dispute Resolution */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">14. Dispute Resolution</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">
                                This Agreement is governed by the laws of the State of California.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">Disputes shall be resolved:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Through good faith negotiation</li>
                                <li>If unresolved, through binding arbitration or courts located in California</li>
                            </ul>
                        </div>

                        {/* Section 15 - Modifications */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">15. Modifications</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                JLTM Select reserves the right to modify this Agreement at any time. Continued use of the Platform constitutes acceptance of revised terms.
                            </p>
                        </div>

                        {/* Section 16 - Entire Agreement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">16. Entire Agreement</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                This Agreement, together with the Terms of Use and Privacy Policy, constitutes the entire agreement between you and JLTM Select.
                            </p>
                        </div>

                        {/* Section 17 - Contact Information */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">17. Contact Information</h2>
                            <div className="bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="font-semibold text-text-primary-dark dark:text-text-primary mb-2">Just Like The Model</p>
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
                                This Buyer Agreement was last updated on {lastUpdated}. It forms an integral part of the contract for every purchase made through {brandName} Select.
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/terms-of-use"
                                className="px-4 py-2 bg-primary dark:bg-bg-secondary border border-gray-200 dark:border-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 text-text-primary-dark dark:text-text-primary rounded text-sm font-medium transition-colors"
                            >
                                Terms of Use
                            </Link>
                            <Link
                                to="/privacy-policy"
                                className="px-4 py-2 bg-primary dark:bg-bg-secondary border border-gray-200 dark:border-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 text-text-primary-dark dark:text-text-primary rounded text-sm font-medium transition-colors"
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