import { Link } from "react-router-dom";
import { Container } from "../components";
import { otherData } from "../assets";

const { phone, email, address, brandName } = otherData;

const TermsOfUse = () => {
    // Fixed dates as provided in the content
    const effectiveDate = "April 15 2026";
    const lastUpdated = "April 15 2026";

    return (
        <section className="pt-10 md:pt-16 bg-bg-secondary dark:bg-primary">
            <div className="max-w-full mx-auto text-center px-6 py-16 bg-primary">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px w-8 bg-secondary"></div>
                    <span className="text-secondary text-xs font-medium uppercase tracking-[0.2em]">Legal Policy</span>
                    <div className="h-px w-8 bg-secondary"></div>
                </div>

                {/* headline */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-pure-white dark:text-text-primary-dark leading-tight">
                    Terms of Use
                </h1>
            </div>

            <Container className="my-14">
                {/* Main Content */}
                <div className="max-w-full mx-auto">
                    <div className="space-y-8">
                        {/* Header Info */}
                        <div className="mb-8 text-left">
                            <p className="text-text-primary text-xl dark:text-text-primary-dark font-medium">
                                <strong>{brandName} Select Terms of Use</strong>
                            </p>
                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm mt-1">
                                Effective Date: {effectiveDate} | Last Updated: {lastUpdated}
                            </p>
                        </div>

                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-text-primary dark:text-text-primary-dark mb-4">
                                These Terms of Use (“Terms”) constitute a legally binding agreement between you (“User,” “you,” or “your”) and JLTM, Inc dba Just Like the Model (“{brandName} Select,” “Company,” “we,” “us,” or “our”) governing your access to and use of JLTMSelect.com (the “Platform”).
                            </p>
                            <div className="bg-primary dark:bg-bg-secondary border-l-4 border-secondary p-4 rounded">
                                <p className="text-text-primary-dark dark:text-text-primary text-sm">
                                    By accessing or using the Platform, you agree to these Terms. If you do not agree, you must not use the Platform.
                                </p>
                            </div>
                        </div>

                        {/* Section 1 - Eligibility */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">1. Eligibility</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">You must:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Be at least 18 years old</li>
                                <li>Have the legal capacity to enter into binding contracts</li>
                                <li>Provide accurate and complete registration information</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                We reserve the right to verify identity at any time and suspend accounts that fail verification.
                            </p>
                        </div>

                        {/* Section 2 - Membership Requirement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">2. Membership Requirement</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">
                                Access to auctions is restricted to active members.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">By purchasing a membership, you agree:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Membership fees are non-refundable once the billing cycle begins</li>
                                <li>Access continues through the paid term even if canceled</li>
                                <li>Failure to renew results in immediate loss of access</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                We reserve the right to modify membership pricing and features with notice.
                            </p>
                        </div>

                        {/* Section 3 - Account Responsibility */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">3. Account Responsibility</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">You are responsible for:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Maintaining the confidentiality of your account credentials</li>
                                <li>All activity conducted under your account</li>
                                <li>Ensuring your payment method is valid and up to date</li>
                            </ul>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We may suspend or terminate accounts for:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Fraudulent activity</li>
                                <li>Non-payment</li>
                                <li>Violation of these Terms</li>
                            </ul>
                        </div>

                        {/* Section 4 - Auction Rules and Binding Bids */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">4. Auction Rules and Binding Bids</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">
                                {brandName} Select operates a real-time auction platform.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">By placing a bid, you agree:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>All bids are legally binding offers to purchase</li>
                                <li>You may not retract or cancel a bid once placed</li>
                                <li>The highest valid bid at auction close wins</li>
                                <li>{brandName} has sole authority to resolve disputes, errors, or irregularities</li>
                            </ul>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We reserve the right to:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Cancel or modify auctions</li>
                                <li>Remove bids suspected of fraud or manipulation</li>
                                <li>Disqualify users at our sole discretion</li>
                            </ul>
                        </div>

                        {/* Section 5 - Payment Terms and Immediate Charges */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">5. Payment Terms and Immediate Charges</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">
                                Participation in auctions requires you to pay manually upon winning your bid.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">By placing a bid, you expressly agree to the following:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Payment of all winnings within 12 hours of winning the item</li>
                                <li>You agree not to initiate chargebacks except in cases of verified fraud</li>
                            </ul>
                        </div>

                        {/* Section 6 - Pricing, Fees, and Taxes */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">6. Pricing, Fees, and Taxes</h2>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>All bids are in U.S. dollars</li>
                                <li>Prices do not include applicable taxes</li>
                                <li>We DO NOT ship items to you. All items must be picked up</li>
                                <li>You are responsible for all applicable taxes</li>
                            </ul>
                        </div>

                        {/* Section 7 - Item Condition and Sales Finality */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">7. Item Condition and Sales Finality</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">All items sold through the Platform are:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Sold “as is” and “as available”</li>
                                <li>Final sale, with no returns or exchanges unless required by law</li>
                            </ul>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We do not guarantee:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Condition beyond what is described</li>
                                <li>Availability or uninterrupted auctions</li>
                            </ul>
                        </div>

                        {/* Section 8 - Pickup, Storage, and Delivery */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">8. Pickup, Storage, and Delivery</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">For items won:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>You are responsible for timely pickup or delivery arrangements</li>
                                <li>Storage fees may apply after a specified period</li>
                                <li>Failure to collect items may result in forfeiture without refund</li>
                            </ul>
                        </div>

                        {/* Section 9 - Prohibited Conduct */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">9. Prohibited Conduct</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">You agree not to:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Manipulate auctions or artificially inflate bids</li>
                                <li>Use multiple accounts to gain unfair advantage</li>
                                <li>Engage in fraud, abuse, or unlawful activity</li>
                                <li>Attempt to interfere with platform operations</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Violation may result in immediate termination.
                            </p>
                        </div>

                        {/* Section 10 - Intellectual Property */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">10. Intellectual Property</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">
                                All content on the Platform, including text, images, and branding, is owned by {brandName} Select or its licensors.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">You may not:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Copy, reproduce, or distribute content without permission</li>
                                <li>Use the Platform for unauthorized commercial purposes</li>
                            </ul>
                        </div>

                        {/* Section 11 - Privacy */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">11. Privacy</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Your use of the Platform is subject to our Privacy Policy. The Privacy Policy explains how we collect, use, and protect your data, including auction behavior and payment processing.
                            </p>
                        </div>

                        {/* Section 12 - Disclaimers */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">12. Disclaimers</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">
                                The Platform is provided on an “as is” and “as available” basis.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We make no warranties regarding:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Platform availability or performance</li>
                                <li>Accuracy of listings</li>
                                <li>Suitability of items</li>
                            </ul>
                        </div>

                        {/* Section 13 - Limitation of Liability */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">13. Limitation of Liability</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">To the maximum extent permitted by law:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>{brandName} Select shall not be liable for indirect, incidental, or consequential damages</li>
                                <li>Our total liability shall not exceed the amount paid by you in the transaction giving rise to the claim</li>
                            </ul>
                        </div>

                        {/* Section 14 - Indemnification */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">14. Indemnification</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">You agree to indemnify and hold harmless {brandName} Select from any claims, damages, or losses arising from:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Your use of the Platform</li>
                                <li>Your violation of these Terms</li>
                                <li>Your breach of applicable laws</li>
                            </ul>
                        </div>

                        {/* Section 15 - Termination */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">15. Termination</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We may suspend or terminate your account at any time for:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Violation of these Terms</li>
                                <li>Fraud or abuse</li>
                                <li>Failure to complete payments</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Termination does not relieve you of outstanding obligations.
                            </p>
                        </div>

                        {/* Section 16 - Dispute Resolution and Governing Law */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">16. Dispute Resolution and Governing Law</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">
                                These Terms are governed by the laws of the State of California.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">Any disputes shall be resolved:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>First, through good faith negotiation</li>
                                <li>Then, through binding arbitration or courts located in California</li>
                            </ul>
                        </div>

                        {/* Section 17 - Modifications to Terms */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">17. Modifications to Terms</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                We may update these Terms at any time. Continued use of the Platform constitutes acceptance of updated Terms.
                            </p>
                        </div>

                        {/* Section 18 - Entire Agreement */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">18. Entire Agreement</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                These Terms, together with the Privacy Policy, constitute the entire agreement between you and {brandName} Select.
                            </p>
                        </div>

                        {/* Section 19 - Contact Information */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">19. Contact Information</h2>
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
                                These Terms were last updated on {lastUpdated}. If you have questions about these Terms, please contact us at <a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{email}</a>.
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/privacy-policy"
                                className="px-4 py-2 bg-primary dark:bg-bg-secondary border border-gray-200 dark:border-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 text-text-primary-dark dark:text-text-primary rounded text-sm font-medium transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/buyer-agreement"
                                className="px-4 py-2 bg-primary dark:bg-bg-secondary border border-gray-200 dark:border-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 text-text-primary-dark dark:text-text-primary rounded text-sm font-medium transition-colors"
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