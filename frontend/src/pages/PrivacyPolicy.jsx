import { Link } from "react-router-dom";
import { Container } from "../components";
import { otherData } from "../assets";

const { phone, email, address, brandName } = otherData;

const PrivacyPolicy = () => {
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
                    Privacy Policy
                </h1>
            </div>

            <Container className="my-14">
                {/* Main Content */}
                <div className="max-w-full mx-auto">
                    <div className="space-y-8">
                        {/* Header Info */}
                        <div className="mb-8 text-left">
                            <p className="text-text-primary text-xl dark:text-text-primary-dark font-medium">
                                <strong>{brandName} Select Privacy Policy</strong>
                            </p>
                            <p className="text-text-secondary dark:text-text-secondary-dark text-sm mt-1">
                                Effective Date: {effectiveDate} | Last Updated: {lastUpdated}
                            </p>
                        </div>

                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-text-primary dark:text-text-primary-dark mb-4">
                                <strong>{brandName} Select</strong> (“Just Like the Model,” “JLTM Inc”, “Company,” “we,” “us,” or “our”) operates an online, membership-based auction platform accessible at JLTMSelect.com (the “Platform”). This Privacy Policy describes how we collect, use, disclose, and protect personal information in connection with your use of the Platform.
                            </p>
                            <p className="text-text-primary dark:text-text-primary-dark">
                                By purchasing a membership, registering for, accessing, or using the Platform, you agree to this Privacy Policy.
                            </p>
                        </div>

                        {/* Section 1 - Scope of This Policy */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">1. Scope of This Policy</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">This Privacy Policy applies to:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Visitors to the Platform</li>
                                <li>Registered members</li>
                                <li>Auction participants</li>
                                <li>Individuals interacting with {brandName} Select services</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                This Policy does not apply to third-party services that may be linked to or integrated with the Platform.
                            </p>
                        </div>

                        {/* Section 2 - Categories of Personal Information Collected */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">2. Categories of Personal Information Collected</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We collect the following categories of personal information, as defined under applicable law:</p>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">A. Identifiers</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>Full name</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Account login credentials</li>
                                <li>IP address</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">B. Commercial Information</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>Purchase and transaction history</li>
                                <li>Auction participation and bidding records</li>
                                <li>Items viewed, bid on, or acquired</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">C. Financial Information</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>Payment method tokens and billing details</li>
                                <li>All transactional details are saved on Stripe, a 3rd party payments platform. We do not store any financial information.</li>
                                <li>Transaction authorization and settlement data are done by Stripe</li>
                            </ul>
                            <div className="bg-primary dark:bg-bg-secondary p-4 rounded mb-3">
                                <p className="text-text-primary-dark dark:text-text-primary text-sm">
                                    <strong>Important Notice:</strong> Payment card data is processed by third-party payment processors Stripe. {brandName} Select does not store full card numbers.
                                </p>
                            </div>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">D. Internet and Device Activity</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>Device identifiers</li>
                                <li>Browser type</li>
                                <li>Usage logs and interaction data</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">E. Membership and Account Data</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5">
                                <li>Membership status and tier</li>
                                <li>Subscription history and renewal dates</li>
                                <li>Account activity and access logs</li>
                            </ul>
                        </div>

                        {/* Section 3 - Sources of Personal Information */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">3. Sources of Personal Information</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We collect information from:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5">
                                <li>You directly, when you register or transact</li>
                                <li>Automated technologies, including cookies and logs</li>
                                <li>Payment processors and service providers</li>
                                <li>Fraud detection and identity verification systems</li>
                            </ul>
                        </div>

                        {/* Section 4 - Purposes for Processing Personal Information */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">4. Purposes for Processing Personal Information</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We process personal information for the following business and commercial purposes:</p>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">A. Platform Operation</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>Account creation, authentication, and management</li>
                                <li>Membership access control</li>
                                <li>Auction payment administration</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">B. Auction Mechanics and Enforcement</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>Recording and validating bids</li>
                                <li>Determining auction winners</li>
                                <li>Enforcing auction rules and terms</li>
                                <li>Maintaining auditable bid histories</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">C. Payment Processing and Risk Management</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>Facilitating payments and billing</li>
                                <li>Authorizing stored payment methods</li>
                                <li>Automatically charging winning bids</li>
                                <li>Preventing fraud, abuse, and non-payment</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">D. Communications</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>Transaction confirmations</li>
                                <li>Auction notifications</li>
                                <li>Service announcements</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">E. Legal and Compliance</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5">
                                <li>Regulatory compliance</li>
                                <li>Dispute resolution</li>
                                <li>Enforcement of contractual rights</li>
                            </ul>
                        </div>

                        {/* Section 5 - Stored Payment Methods and Automatic Charges */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">5. Stored Payment Methods and Automatic Charges</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">As a condition of participating in auctions:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Users are required to have a valid payment method to pay for winnings</li>
                                <li>Payment methods may be tokenized and securely stored by third-party processor Stripe</li>
                                <li>By placing a bid, you accept payment responsibility of the auction item you won</li>
                                <li>If unable to pay, charges may occur immediately upon auction close without further notice</li>
                            </ul>
                            <div className="bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="text-text-primary-dark dark:text-text-primary text-sm">
                                    Failure to honor payment obligations may result in:
                                </p>
                                <ul className="text-text-primary-dark dark:text-text-primary text-sm list-disc pl-5 mt-1">
                                    <li>Account suspension or termination</li>
                                    <li>Revocation of membership access</li>
                                    <li>Additional enforcement actions as permitted by law</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 6 - Disclosure of Personal Information */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">6. Disclosure of Personal Information</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-3">
                                <strong>We do not sell personal information.</strong> We disclose information only as necessary for legitimate business purposes.
                            </p>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">A. Service Providers</h3>
                            <p className="text-text-secondary dark:text-text-secondary-dark mb-2">We share information with third-party providers that support operations, including:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>Payment processors</li>
                                <li>Cloud infrastructure providers such as Amazon Web Services</li>
                                <li>Communication systems such as Google Workspace</li>
                                <li>Analytics and fraud prevention vendors</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark mb-3">
                                These parties are contractually obligated to safeguard personal information.
                            </p>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">B. Legal Obligations and Enforcement</h3>
                            <p className="text-text-secondary dark:text-text-secondary-dark mb-2">We may disclose personal information:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>To comply with legal processes or regulatory requirements</li>
                                <li>To enforce our Terms and Conditions</li>
                                <li>To investigate fraud or security incidents</li>
                                <li>To protect the rights, property, or safety of {brandName} Select and its users</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">C. Business Transactions</h3>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                In connection with a merger, acquisition, financing, or sale of assets, personal information may be transferred as part of the transaction.
                            </p>
                        </div>

                        {/* Section 7 - Data Retention */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">7. Data Retention</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We retain personal information for as long as necessary to:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Fulfill contractual and transactional obligations</li>
                                <li>Maintain financial and auction records</li>
                                <li>Resolve disputes and enforce agreements</li>
                                <li>Comply with legal and regulatory requirements</li>
                                <li>Reach out to customers about their account</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Retention periods are determined based on the nature of the data and applicable obligations.
                            </p>
                        </div>

                        {/* Section 8 - Data Security */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">8. Data Security</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We implement commercially reasonable administrative, technical, and physical safeguards, including:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Encryption of sensitive data in transit and at rest</li>
                                <li>Role-based access controls</li>
                                <li>Secure payment processing environments with Stripe</li>
                            </ul>
                            <div className="bg-primary dark:bg-bg-secondary p-4 rounded">
                                <p className="text-text-primary-dark dark:text-text-primary text-sm">
                                    No method of transmission or storage is completely secure. Users assume inherent risks associated with online systems.
                                </p>
                            </div>
                        </div>

                        {/* Section 9 - California Privacy Rights (CCPA/CPRA) */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">9. California Privacy Rights (CCPA/CPRA)</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">Residents of California have the following rights under the California Consumer Privacy Act:</p>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-2">Rights Include</h3>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5 mb-3">
                                <li>Right to know the categories and specific pieces of personal information collected</li>
                                <li>Right to request deletion, subject to exceptions</li>
                                <li>Right to correct inaccurate personal information</li>
                                <li>Right to opt out of the sale or sharing of personal information</li>
                                <li>Right to limit use of sensitive personal information, where applicable</li>
                                <li>Right to non-discrimination</li>
                            </ul>

                            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2 mt-3">Exercising Your Rights</h3>
                            <p className="text-text-secondary dark:text-text-secondary-dark mb-2">Requests may be submitted via:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-1 list-disc pl-5">
                                <li>Email: <a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{email}</a></li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark mt-2">
                                We will verify your identity prior to processing requests and respond within legally required timeframes.
                            </p>
                        </div>

                        {/* Section 10 - Cookies and Tracking Technologies */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">10. Cookies and Tracking Technologies</h2>
                            <p className="text-text-primary dark:text-text-primary-dark mb-2">We use cookies and similar technologies to:</p>
                            <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2 list-disc pl-5 mb-3">
                                <li>Maintain session integrity</li>
                                <li>Enable platform functionality</li>
                                <li>Analyze performance and usage</li>
                            </ul>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                Users may adjust cookie preferences through browser settings.
                            </p>
                        </div>

                        {/* Section 11 - Children's Privacy */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">11. Children's Privacy</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                The Platform is intended for individuals aged 18 and older. We do not knowingly collect personal information from minors.
                            </p>
                        </div>

                        {/* Section 12 - International Data Transfers */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">12. International Data Transfers</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                All data is processed in the United States. By using the Platform, you consent to the transfer and processing of information in jurisdictions that may differ from your own.
                            </p>
                        </div>

                        {/* Section 13 - Changes to This Privacy Policy */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">13. Changes to This Privacy Policy</h2>
                            <p className="text-text-secondary dark:text-text-secondary-dark">
                                We reserve the right to update this Privacy Policy at any time. Updates will be posted with a revised "Last Updated" date. Continued use of the Platform constitutes acceptance of the updated Policy.
                            </p>
                        </div>

                        {/* Section 14 - Contact Information */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">14. Contact Information</h2>
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
                                This Privacy Policy is governed by the laws of the United States. Any disputes will be subject to the exclusive jurisdiction of the courts of the United States.
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

export default PrivacyPolicy;