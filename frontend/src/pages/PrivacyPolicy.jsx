import { Link } from "react-router-dom";
import { Container } from "../components";
import { otherData } from "../assets";

const { phone, email, address } = otherData;

const PrivacyPolicy = () => {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-3">Privacy Policy</h1>
                    <p className="text-text-secondary dark:text-text-secondary-dark mb-6">{otherData?.brandName} | Last Updated: {formattedDate}</p>

                    <div className="bg-bg-primary dark:bg-bg-secondary border-l-4 border-text-primary rounded dark:border-text-primary-dark p-4 mb-6">
                        <p className="text-text-primary-dark dark:text-text-primary font-semibold mb-2">US MARKETPLACE</p>
                        <p className="text-text-primary-dark/80 dark:text-text-primary/80 text-sm">
                            {otherData?.brandName} is a fashion closeout auction marketplace operating in the United States.
                            This policy explains how we handle your information in accordance with US privacy laws.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-full mx-auto">
                    <div className="space-y-8">
                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-text-primary dark:text-text-primary-dark mb-4">
                                <strong>{otherData?.brandName}</strong> ("we", "our", "us") is committed to protecting
                                your privacy. This Privacy Policy explains how we collect, use, and
                                safeguard your information when you use our fashion auction platform to buy and sell clothing bundles, luxury pieces, and vintage collections.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark">
                                By registering for, accessing, or using the Platform, you agree to this Privacy Policy.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">1. Information We Collect</h2>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-4">Personal Information</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5">
                                <li>Full name, username, and contact details</li>
                                <li>Billing and shipping address</li>
                                <li>Email address and telephone number</li>
                                <li>Payment card details (processed securely via Stripe)</li>
                                <li>Bank account information (for Wise/bank transfers)</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-4">Platform & Transaction Data</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5">
                                <li>Account credentials and login information</li>
                                <li>Bidding history, offers, and purchase records</li>
                                <li>Listings you create as a seller</li>
                                <li>Communication records with other users</li>
                                <li>Deposit and payment transaction records</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-4">Automatically Collected Data</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5">
                                <li>IP address, device type, browser information</li>
                                <li>Usage data including pages visited and time spent</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">2. How We Use Your Information</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">We process your information for:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>Platform operation and account management</li>
                                <li>Verifying user identity and preventing fraud</li>
                                <li>Processing bids, offers, and purchases</li>
                                <li>Facilitating payments through Stripe and Wise</li>
                                <li>Managing escrow and releasing funds to sellers</li>
                                <li>Sending service updates and outbid notifications</li>
                                <li>Customer support and dispute resolution</li>
                                <li>Complying with legal obligations under US law</li>
                                <li>Improving platform experience and features</li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">3. Legal Basis for Processing</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">As a US-based company, we process information based on:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li><strong className="text-text-primary dark:text-text-primary-dark">Contractual Necessity:</strong> To fulfill our obligations to you</li>
                                <li><strong className="text-text-primary dark:text-text-primary-dark">Legitimate Interests:</strong> To operate and improve our marketplace</li>
                                <li><strong className="text-text-primary dark:text-text-primary-dark">Legal Compliance:</strong> To meet US federal and state requirements</li>
                                <li><strong className="text-text-primary dark:text-text-primary-dark">Consent:</strong> Where required, we obtain your explicit consent</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm mt-3">
                                For users in the European Union, we process data in accordance with GDPR requirements.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">4. Information Sharing</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">We may share your information with:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li><strong>Payment Processors:</strong> Stripe and Wise to process transactions</li>
                                <li><strong>Other Users:</strong> Limited information to complete transactions (shipping details, etc.)</li>
                                <li><strong>Service Providers:</strong> IT services, hosting partners, customer support tools</li>
                                <li><strong>Legal Authorities:</strong> When required by US federal or state law</li>
                                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                            </ul>
                            <p className="text-text-secondary/80 dark:text-text-secondary-dark/80 text-sm mt-3 font-semibold">
                                We do not sell your personal data to third parties.
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">5. Data Security</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">We implement industry-standard security measures including:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>SSL/TLS encryption for all data transmission</li>
                                <li>PCI-compliant payment processing through Stripe</li>
                                <li>Secure server infrastructure with firewalls</li>
                                <li>Access controls and authentication protocols</li>
                                <li>Regular security assessments and monitoring</li>
                            </ul>
                            <div className="bg-bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="text-text-primary-dark dark:text-text-primary/80 text-sm">
                                    While we strive to protect your information, no method of transmission over the Internet is 100% secure.
                                    We cannot guarantee absolute security.
                                </p>
                            </div>
                        </div>

                        {/* Section 6 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">6. Cookies</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark mb-3">
                                We use cookies and similar tracking technologies to enhance platform functionality, analyze usage, and improve your experience.
                                You can manage cookies through your browser settings. Continued use of {otherData?.brandName} constitutes acceptance of our cookie practices.
                            </p>
                        </div>

                        {/* Section 7 - Updated for US + GDPR rights */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">7. Your Privacy Rights</h2>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-4">California Residents (CCPA)</h3>
                            <p className="text-text-secondary dark:text-text-secondary-dark mb-3">
                                If you are a California resident, you have the right to:
                            </p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-4">
                                <li>Know what personal information we collect and share</li>
                                <li>Request deletion of your personal information</li>
                                <li>Opt-out of the sale of your personal information (we do not sell data)</li>
                                <li>Non-discrimination for exercising your rights</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-4">EU/EEA Residents (GDPR)</h3>
                            <p className="text-text-secondary dark:text-text-secondary-dark mb-3">
                                If you are located in the European Union, you have the right to:
                            </p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-4">
                                <li>Access your personal data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion under certain conditions</li>
                                <li>Restrict or object to processing</li>
                                <li>Data portability</li>
                                <li>Withdraw consent at any time</li>
                            </ul>

                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm mt-3">
                                To exercise your rights, contact us at <a href={`mailto:${email}`} className="text-text-primary dark:text-text-primary-dark hover:underline">{email}</a>. We may need to verify your identity before processing your request.
                            </p>
                        </div>

                        {/* Section 8 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">8. Data Retention</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">We retain your information as long as necessary for:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>The duration of your active account</li>
                                <li>Legal and regulatory requirements (including tax and accounting records)</li>
                                <li>Fraud prevention and security purposes</li>
                                <li>Dispute resolution and enforcement of our agreements</li>
                            </ul>
                        </div>

                        {/* Section 9 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">9. International Transfers</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                {otherData?.brandName} is based in the United States. If you access our platform from outside the US,
                                your information will be transferred to and processed in the United States. By using {otherData?.brandName},
                                you consent to this transfer. For EU users, we ensure appropriate safeguards are in place.
                            </p>
                        </div>

                        {/* Section 10 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">10. Third-Party Links</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Our platform may contain links to third-party websites. This Privacy Policy applies only to {otherData?.brandName}.
                                We encourage you to review the privacy policies of any third-party sites you visit.
                            </p>
                        </div>

                        {/* Section 11 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">11. Children's Privacy</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                {otherData?.brandName} is not intended for individuals under the age of 18. We do not knowingly collect
                                personal information from minors. If you believe a minor has provided us with information, please contact us immediately.
                            </p>
                        </div>

                        {/* Section 12 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">12. Policy Changes</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                We may update this Privacy Policy periodically. The "Last Updated" date indicates when revisions were made.
                                Material changes will be communicated via email or platform notice. Your continued use of {otherData?.brandName}
                                constitutes acceptance of the updated policy.
                            </p>
                        </div>

                        {/* Section 13 */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-4">13. Contact Us</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-4">
                                For questions about this Privacy Policy or to exercise your privacy rights:
                            </p>
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
                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm mt-4">
                                If you have concerns about our privacy practices, you may also contact your local data protection authority
                                (for EU users) or the Federal Trade Commission (for US users).
                            </p>
                        </div>

                        {/* Footer Note */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
                                This Privacy Policy is governed by the laws of the United States. Any disputes
                                will be subject to the exclusive jurisdiction of the courts of the United States.
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

export default PrivacyPolicy;