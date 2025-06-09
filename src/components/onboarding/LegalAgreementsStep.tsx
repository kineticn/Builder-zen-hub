import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  FileText,
  Eye,
  Check,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface LegalDocument {
  id: keyof LegalAgreements;
  title: string;
  description: string;
  content: string;
  isRequired: boolean;
  minReadTime: number; // seconds
}

interface LegalAgreements {
  termsOfService: boolean;
  privacyPolicy: boolean;
  electronicConsent: boolean;
  plaidTerms: boolean;
  dataSharing: boolean;
  communicationConsent: boolean;
}

interface AgreementTimestamps {
  [key: string]: string;
}

interface ScrollProgress {
  [key: string]: {
    hasViewed: boolean;
    scrolledToBottom: boolean;
    timeSpent: number;
    viewStartTime: number | null;
  };
}

interface LegalAgreementsStepProps {
  onNext: () => void;
  onPrev: () => void;
  legalAgreements: LegalAgreements;
  agreementTimestamps: AgreementTimestamps;
  onUpdateAgreements: (agreements: LegalAgreements) => void;
  onUpdateTimestamps: (timestamps: AgreementTimestamps) => void;
}

const legalDocuments: LegalDocument[] = [
  {
    id: "termsOfService",
    title: "Terms of Service",
    description: "Our terms and conditions for using BillBuddy",
    isRequired: true,
    minReadTime: 45,
    content: `# BillBuddy Terms of Service

**Last Updated:** December 15, 2024

## 1. Acceptance of Terms

By accessing and using BillBuddy ("Service"), you accept and agree to be bound by the terms and provision of this agreement.

## 2. Service Description

BillBuddy is a financial technology platform that helps users manage, track, and pay their bills. Our services include:

- Bill tracking and reminders
- Payment processing
- Financial insights and analytics
- Household budget management
- Bank account integration through third-party providers

## 3. User Responsibilities

### Account Security
- You are responsible for maintaining the confidentiality of your account credentials
- You must notify us immediately of any unauthorized use of your account
- You are responsible for all activities that occur under your account

### Accurate Information
- You agree to provide accurate, current, and complete information
- You will update your information to maintain its accuracy
- False or misleading information may result in account suspension

### Prohibited Uses
You may not use our Service to:
- Violate any laws or regulations
- Engage in fraudulent activities
- Attempt to gain unauthorized access to our systems
- Interfere with other users' use of the Service

## 4. Financial Services

### Payment Processing
- Payments are processed through licensed third-party payment processors
- We are not responsible for payment processing delays or failures by third parties
- You authorize us to charge your designated payment methods for bills you schedule

### Banking Integrations
- Bank account connections are facilitated through Plaid and other licensed providers
- We do not store your banking credentials
- You can revoke banking permissions at any time

## 5. Privacy and Data Protection

### Data Collection
- We collect information necessary to provide our services
- Our Privacy Policy details how we collect, use, and protect your data
- We implement industry-standard security measures to protect your information

### Data Sharing
- We do not sell your personal information to third parties
- We may share aggregated, anonymized data for research and improvement purposes
- Required legal disclosures may necessitate data sharing with authorities

## 6. Intellectual Property

### Our Content
- All content, features, and functionality are owned by BillBuddy
- You may not copy, modify, or distribute our intellectual property
- Our trademarks and service marks are protected

### User Content
- You retain ownership of data you provide to us
- You grant us license to use your data to provide our services
- You are responsible for ensuring you have rights to any data you provide

## 7. Service Availability

### Uptime
- We strive to maintain 99.9% service availability
- Scheduled maintenance will be announced in advance
- We are not liable for service interruptions beyond our control

### Updates and Changes
- We may update our Service to improve functionality
- Significant changes will be communicated to users
- Continued use constitutes acceptance of updates

## 8. Fees and Billing

### Service Fees
- Free tier includes basic bill tracking
- Premium features require paid subscription
- Fees are clearly disclosed before any charges

### Billing
- Subscription fees are billed monthly or annually
- You can cancel your subscription at any time
- Refunds are provided according to our refund policy

## 9. Limitation of Liability

### Service Limitations
- Our Service is provided "as is" without warranties
- We are not liable for indirect, incidental, or consequential damages
- Our liability is limited to the fees you have paid us

### Third-Party Services
- We integrate with third-party services for enhanced functionality
- We are not responsible for third-party service failures
- Your use of third-party services is subject to their terms

## 10. Termination

### Account Termination
- You may terminate your account at any time
- We may terminate accounts for violations of these terms
- Upon termination, your data will be handled according to our Privacy Policy

### Effect of Termination
- Terminated accounts lose access to paid features immediately
- Data export options are available for a limited time after termination
- Outstanding obligations survive termination

## 11. Dispute Resolution

### Governing Law
- These terms are governed by the laws of California
- Disputes will be resolved through binding arbitration
- Class action lawsuits are waived

### Contact for Disputes
- Email: legal@billbuddy.com
- Address: 123 Financial St, San Francisco, CA 94102
- Phone: (555) 123-BILL

## 12. Changes to Terms

We may revise these terms from time to time. We will notify users of material changes via email or through our Service. Continued use after changes constitutes acceptance of the new terms.

## 13. Contact Information

For questions about these Terms of Service:
- Email: support@billbuddy.com
- Website: www.billbuddy.com/contact
- Address: BillBuddy Inc., 123 Financial St, San Francisco, CA 94102

By using BillBuddy, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`,
  },
  {
    id: "privacyPolicy",
    title: "Privacy Policy",
    description: "How we collect, use, and protect your data",
    isRequired: true,
    minReadTime: 60,
    content: `# BillBuddy Privacy Policy

**Last Updated:** December 15, 2024

## 1. Introduction

BillBuddy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial management service.

## 2. Information We Collect

### Personal Information
- **Account Information:** Name, email address, phone number, date of birth
- **Financial Information:** Bank account details, transaction history, bill information
- **Contact Information:** Mailing address, emergency contacts
- **Identification:** Social Security Number (when required for financial services)

### Usage Information
- **Device Information:** Device type, operating system, browser information
- **Usage Patterns:** Features used, time spent, click patterns
- **Location Data:** General location for fraud prevention (not precise tracking)
- **Communication Records:** Customer support interactions, feedback

### Third-Party Information
- **Bank Data:** Transaction history from connected bank accounts (via Plaid)
- **Credit Information:** Credit scores and reports (with explicit consent)
- **Merchant Data:** Bill information from utility companies and service providers

## 3. How We Use Your Information

### Service Provision
- **Bill Management:** Track, organize, and remind you of upcoming bills
- **Payment Processing:** Facilitate bill payments through secure channels
- **Financial Insights:** Provide spending analysis and budgeting recommendations
- **Customer Support:** Respond to inquiries and resolve issues

### Security and Compliance
- **Fraud Prevention:** Monitor for suspicious activities and unauthorized access
- **Legal Compliance:** Meet regulatory requirements for financial services
- **Identity Verification:** Confirm your identity for account security
- **Risk Assessment:** Evaluate and mitigate financial and security risks

### Service Improvement
- **Product Development:** Enhance features based on usage patterns
- **Research:** Conduct aggregated analysis to improve our services
- **Marketing:** Send relevant offers and updates (with your consent)
- **Personalization:** Customize your experience based on preferences

## 4. Information Sharing and Disclosure

### Service Providers
- **Payment Processors:** Stripe, ACH networks for bill payments
- **Banking Partners:** Plaid, Yodlee for account connectivity
- **Cloud Services:** AWS, Google Cloud for secure data storage
- **Analytics:** Aggregated, anonymized data for service improvement

### Legal Requirements
- **Regulatory Compliance:** Financial regulatory bodies (CFPB, state regulators)
- **Law Enforcement:** When required by valid legal process
- **Court Orders:** In response to subpoenas, warrants, or court orders
- **Emergency Situations:** To prevent fraud or protect safety

### Business Transfers
- **Merger or Acquisition:** In the event of business combination
- **Asset Sale:** If we sell or transfer business assets
- **Bankruptcy:** As part of bankruptcy or insolvency proceedings
- **Due Diligence:** With potential buyers under confidentiality agreements

### With Your Consent
- **Third-Party Apps:** When you authorize connections to other services
- **Marketing Partners:** For promotional offers (opt-in only)
- **Research Participation:** For surveys or studies (voluntary)
- **Social Features:** When you choose to share information publicly

## 5. Data Security

### Technical Safeguards
- **Encryption:** 256-bit AES encryption for data at rest and in transit
- **Access Controls:** Multi-factor authentication and role-based access
- **Network Security:** Firewalls, intrusion detection, and monitoring
- **Regular Testing:** Penetration testing and security audits

### Operational Security
- **Employee Training:** Regular security awareness training
- **Background Checks:** Screening for employees with data access
- **Incident Response:** Established procedures for security breaches
- **Data Minimization:** Collect and retain only necessary information

### Compliance Standards
- **SOC 2 Type II:** Annual compliance audits
- **PCI DSS:** Payment card industry security standards
- **ISO 27001:** Information security management certification
- **GDPR:** European data protection regulations (where applicable)

## 6. Your Privacy Rights

### Access and Control
- **Data Access:** Request copies of your personal information
- **Data Correction:** Update or correct inaccurate information
- **Data Deletion:** Request deletion of your personal information
- **Data Portability:** Export your data in a structured format

### Communication Preferences
- **Email Marketing:** Opt-out of promotional emails
- **Push Notifications:** Control app notifications
- **SMS Alerts:** Manage text message preferences
- **Phone Calls:** Request to be placed on do-not-call list

### Account Management
- **Account Deletion:** Close your account and delete associated data
- **Data Retention:** Control how long we retain your information
- **Third-Party Connections:** Revoke access to connected services
- **Privacy Settings:** Manage visibility and sharing preferences

## 7. Cookies and Tracking Technologies

### Types of Cookies
- **Essential Cookies:** Necessary for basic website functionality
- **Analytics Cookies:** Help us understand how you use our service
- **Preference Cookies:** Remember your settings and preferences
- **Marketing Cookies:** Deliver relevant advertisements (opt-in)

### Cookie Management
- **Browser Settings:** Control cookies through your browser
- **Opt-Out Options:** Use industry opt-out tools
- **Cookie Policy:** Detailed information in our Cookie Policy
- **Regular Review:** We regularly review our cookie practices

## 8. Children's Privacy

### Age Restrictions
- Our service is not intended for children under 18
- We do not knowingly collect information from minors
- Parents may request deletion of their child's information
- We will delete any inadvertently collected children's data

### Parental Rights
- **Information Access:** Parents can review their child's information
- **Data Deletion:** Request removal of child's data
- **Account Closure:** Close accounts created by minors
- **Communication:** We will respond to parental inquiries promptly

## 9. International Data Transfers

### Cross-Border Processing
- We may process your information in countries outside your residence
- We implement appropriate safeguards for international transfers
- We comply with applicable data protection laws
- You consent to international processing when using our service

### Safeguards
- **Adequacy Decisions:** Transfer to countries with adequate protection
- **Standard Clauses:** Use EU-approved standard contractual clauses
- **Certification Programs:** Participate in recognized privacy frameworks
- **Binding Rules:** Implement corporate rules for data protection

## 10. Data Retention

### Retention Periods
- **Account Data:** Retained while your account is active
- **Transaction Data:** Kept for 7 years for financial recordkeeping
- **Communication Records:** Retained for 3 years for quality assurance
- **Marketing Data:** Deleted upon opt-out or after 2 years of inactivity

### Deletion Practices
- **Secure Deletion:** Use secure methods to permanently delete data
- **Backup Removal:** Remove data from backup systems within 90 days
- **Third-Party Deletion:** Request deletion from service providers
- **Legal Holds:** Preserve data when required by law

## 11. Updates to This Policy

### Policy Changes
- We may update this Privacy Policy periodically
- Material changes will be communicated via email or app notification
- Continued use constitutes acceptance of updated terms
- Previous versions are available upon request

### Notification Methods
- **Email Alerts:** Sent to your registered email address
- **In-App Notifications:** Displayed when you log in
- **Website Banner:** Prominent notice on our website
- **Direct Mail:** For significant changes affecting your rights

## 12. Contact Information

### Privacy Inquiries
- **Email:** privacy@billbuddy.com
- **Address:** Privacy Officer, BillBuddy Inc., 123 Financial St, San Francisco, CA 94102
- **Phone:** (555) 123-BILL
- **Online Form:** Available at www.billbuddy.com/privacy-contact

### Response Times
- We respond to privacy inquiries within 30 days
- Complex requests may require additional time
- We will acknowledge receipt within 5 business days
- Urgent security matters are addressed immediately

By using BillBuddy, you acknowledge that you have read and understand this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.`,
  },
  {
    id: "electronicConsent",
    title: "Electronic Consent Agreement",
    description: "Agreement to receive electronic communications",
    isRequired: true,
    minReadTime: 20,
    content: `# Electronic Consent Agreement

**Last Updated:** December 15, 2024

## 1. Consent to Electronic Communications

By agreeing to this Electronic Consent Agreement, you consent to receive communications from BillBuddy in electronic form, including:

- Account statements and notifications
- Service updates and announcements
- Bill reminders and payment confirmations
- Marketing communications (where permitted)
- Legal notices and policy updates

## 2. Hardware and Software Requirements

To access and retain electronic communications, you must have:

### Minimum Requirements
- **Internet Access:** Reliable broadband internet connection
- **Email Account:** Valid email address for receiving notifications
- **Web Browser:** Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Mobile Device:** iOS 13+ or Android 8+ for mobile app access

### Software Capabilities
- **PDF Reader:** For viewing account statements and legal documents
- **Email Client:** For receiving and viewing electronic communications
- **JavaScript:** Enabled in your web browser
- **Cookies:** Enabled for website functionality

## 3. How to Access Electronic Records

### Online Access
- Log in to your BillBuddy account at www.billbuddy.com
- Navigate to the "Documents" or "Statements" section
- Download or view documents directly in your browser
- Documents are available for at least 18 months after creation

### Email Delivery
- Electronic communications will be sent to your registered email address
- Check your spam/junk folder if emails are not received
- Maintain an active email account to continue receiving communications
- Notify us immediately if your email address changes

## 4. Withdrawal of Consent

### How to Withdraw
You may withdraw your consent to receive electronic communications by:
- Emailing us at support@billbuddy.com
- Calling customer service at (555) 123-BILL
- Updating your preferences in your account settings
- Sending written notice to our mailing address

### Effect of Withdrawal
- We will provide paper copies of future communications
- Additional fees may apply for paper document delivery
- Some services may be limited without electronic consent
- You can re-consent to electronic delivery at any time

## 5. Updating Your Information

### Contact Information
- Keep your email address current in your account settings
- Notify us immediately of any changes to your contact information
- Failure to maintain current information may disrupt service
- We are not responsible for communications sent to outdated addresses

### System Requirements
- Notify us if you can no longer meet the technical requirements
- We will work with you to find alternative delivery methods
- Updates to system requirements will be communicated in advance
- Technical support is available to help with access issues

## 6. Paper Copy Requests

### Availability
- You may request paper copies of any electronic communication
- Requests must be made within 180 days of the electronic delivery
- Paper copies will be mailed to your address on file
- Some restrictions may apply to historical documents

### Fees
- The first paper copy each month is provided free of charge
- Additional paper copies may incur a $3.00 processing fee
- Rush delivery options are available for additional fees
- Fee schedules are available in your account settings

## 7. Communication Preferences

### Customization Options
- Choose which communications you receive electronically
- Set frequency preferences for non-essential communications
- Opt-out of marketing communications while maintaining account notices
- Customize delivery timing for bill reminders

### Emergency Communications
- Critical security and account notices will always be delivered
- Fraud alerts and suspicious activity warnings are not optional
- System maintenance notices affecting your service will be sent
- Legal notices required by law cannot be opted out of

## 8. Security and Privacy

### Secure Delivery
- Electronic communications are delivered through secure, encrypted channels
- Links in emails direct you to secure areas of our website
- We never request sensitive information via email
- Verify the authenticity of communications if you have doubts

### Privacy Protection
- Electronic communications are treated with the same privacy as paper documents
- Access controls protect your electronic records from unauthorized viewing
- Communications are retained according to our record retention policy
- Your consent preferences are maintained confidentially

## 9. Mobile Communications

### Text Messages
- You may consent to receive text message alerts and notifications
- Standard message and data rates may apply
- You can opt-out of text messages by replying "STOP"
- Emergency security alerts may still be sent after opt-out

### Push Notifications
- Mobile app push notifications provide real-time updates
- You can control notification settings through your device settings
- Location-based notifications may be available with your permission
- Critical account security notifications cannot be disabled

## 10. Compliance and Legal Effect

### Legal Validity
- Electronic communications have the same legal effect as paper documents
- Your electronic signature on this agreement is legally binding
- Electronic records satisfy legal requirements for written communications
- This agreement complies with the Electronic Signatures in Global and National Commerce Act

### Recordkeeping
- We maintain electronic records according to legal and regulatory requirements
- You are responsible for saving or printing electronic communications for your records
- We recommend downloading important documents for your files
- Electronic records are admissible in legal proceedings

## 11. Updates to This Agreement

### Changes
- We may update this Electronic Consent Agreement periodically
- Material changes will be communicated via electronic or paper notice
- Continued use of electronic communications constitutes acceptance
- You may withdraw consent if you disagree with updates

### Notification
- Updates will be posted on our website with the effective date
- Email notification will be sent for significant changes
- You have 30 days to review and withdraw consent after notification
- Previous versions of the agreement are available upon request

## 12. Contact Information

For questions about this Electronic Consent Agreement:

- **Email:** support@billbuddy.com
- **Phone:** (555) 123-BILL
- **Address:** BillBuddy Inc., 123 Financial St, San Francisco, CA 94102
- **Online:** www.billbuddy.com/contact

## 13. Acknowledgment

By checking the box below, you acknowledge that you:
- Have read and understand this Electronic Consent Agreement
- Meet the hardware and software requirements
- Consent to receive communications electronically
- Understand how to withdraw your consent
- Agree to keep your contact information current

Date of Consent: [Timestamp will be recorded upon agreement]`,
  },
];

/**
 * Legal agreements step component with scroll tracking and timestamping
 * Ensures users actually read agreements before accepting them for legal compliance
 * Mobile-first responsive design with comprehensive tracking features
 */
export const LegalAgreementsStep: React.FC<LegalAgreementsStepProps> = ({
  onNext,
  onPrev,
  legalAgreements = {
    termsOfService: false,
    privacyPolicy: false,
    electronicConsent: false,
    plaidTerms: false,
    dataSharing: false,
    communicationConsent: false,
  },
  agreementTimestamps = {},
  onUpdateAgreements,
  onUpdateTimestamps,
}) => {
  const [currentDocument, setCurrentDocument] = useState<LegalDocument | null>(
    null,
  );
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({});
  const [errors, setErrors] = useState<string[]>([]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  // Initialize scroll progress for all documents
  useEffect(() => {
    const initialProgress: ScrollProgress = {};
    legalDocuments.forEach((doc) => {
      initialProgress[doc.id] = {
        hasViewed: false,
        scrolledToBottom: false,
        timeSpent: 0,
        viewStartTime: null,
      };
    });
    setScrollProgress(initialProgress);
  }, []);

  // Track time spent viewing document
  useEffect(() => {
    if (currentDocument) {
      const docId = currentDocument.id;
      const startTime = Date.now();

      setScrollProgress((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          hasViewed: true,
          viewStartTime: startTime,
        },
      }));

      return () => {
        setScrollProgress((prev) => {
          const timeSpent = prev[docId]?.viewStartTime
            ? prev[docId].timeSpent + (Date.now() - startTime) / 1000
            : prev[docId]?.timeSpent || 0;

          return {
            ...prev,
            [docId]: {
              ...prev[docId],
              timeSpent,
              viewStartTime: null,
            },
          };
        });
      };
    }
  }, [currentDocument]);

  const formatDocumentContent = (content: string): string => {
    return (
      content
        // Convert markdown headers
        .replace(
          /^# (.*$)/gim,
          '<h1 class="text-xl font-bold text-gray-900 mb-4">$1</h1>',
        )
        .replace(
          /^## (.*$)/gim,
          '<h2 class="text-lg font-semibold text-gray-800 mb-3 mt-6">$1</h2>',
        )
        .replace(
          /^### (.*$)/gim,
          '<h3 class="text-base font-medium text-gray-800 mb-2 mt-4">$1</h3>',
        )
        // Convert bold text
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-gray-900">$1</strong>',
        )
        // Convert paragraphs
        .replace(/\n\n/g, '</p><p class="mb-3">')
        .replace(/^(.+)$/gm, '<p class="mb-3">$1</p>')
        // Convert bullet points
        .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
        // Wrap lists
        .replace(/(<li.*<\/li>)/gs, '<ul class="mb-4">$1</ul>')
        // Clean up extra paragraph tags
        .replace(/<p class="mb-3"><\/p>/g, "")
        .replace(/<p class="mb-3">(<h[1-6])/g, "$1")
        .replace(/(<\/h[1-6]>)<\/p>/g, "$1")
    );
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!currentDocument) return;

    const target = event.currentTarget as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    // More lenient scroll detection - consider scrolled to bottom if within 90%
    const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;
    const scrolledToBottom = scrollPercentage >= 90;

    console.log(
      `Scroll: ${scrollPercentage.toFixed(1)}%, scrolledToBottom: ${scrolledToBottom}`,
    );

    setScrollProgress((prev) => ({
      ...prev,
      [currentDocument.id]: {
        ...prev[currentDocument.id],
        scrolledToBottom,
      },
    }));
  };

  const handleAgreementChange = (
    docId: keyof LegalAgreements,
    checked: boolean,
  ) => {
    const newAgreements = { ...legalAgreements, [docId]: checked };
    onUpdateAgreements(newAgreements);

    if (checked) {
      // Record timestamp when agreement is accepted
      const timestamp = new Date().toISOString();
      const newTimestamps = { ...agreementTimestamps, [docId]: timestamp };
      onUpdateTimestamps(newTimestamps);
    }
  };

  const validateAgreements = (): boolean => {
    const newErrors: string[] = [];

    // Check if all required documents are agreed to
    const requiredDocs = legalDocuments.filter((doc) => doc.isRequired);
    const unacceptedRequired = requiredDocs.filter(
      (doc) => !legalAgreements?.[doc.id],
    );

    if (unacceptedRequired.length > 0) {
      newErrors.push(
        `You must accept all required agreements: ${unacceptedRequired.map((doc) => doc.title).join(", ")}`,
      );
    }

    // Check if user has actually viewed and scrolled through documents they agreed to
    Object.entries(legalAgreements || {}).forEach(([docId, isAccepted]) => {
      if (isAccepted) {
        const progress = scrollProgress[docId];
        const doc = legalDocuments.find((d) => d.id === docId);

        if (!progress?.hasViewed) {
          newErrors.push(
            `Please read the ${doc?.title || docId} before accepting`,
          );
        } else if (!progress.scrolledToBottom) {
          newErrors.push(
            `Please scroll through the entire ${doc?.title || docId}`,
          );
        } else if (
          doc &&
          progress.timeSpent < doc.minReadTime &&
          doc.minReadTime > 0
        ) {
          newErrors.push(
            `Please spend adequate time reading the ${doc.title} (minimum ${doc.minReadTime} seconds)`,
          );
        }
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateAgreements()) {
      onNext();
    }
  };

  const getDocumentProgress = (docId: string) => {
    return scrollProgress[docId];
  };

  const isDocumentFullyRead = (docId: string) => {
    const progress = getDocumentProgress(docId);
    const doc = legalDocuments.find((d) => d.id === docId);

    // More lenient requirements - either scrolled to bottom OR spent enough time
    const hasScrolled = progress?.scrolledToBottom;
    const hasSpentTime =
      !doc || progress?.timeSpent >= Math.max(doc.minReadTime * 0.8, 15); // 80% of min time or 15 seconds minimum
    const hasViewed = progress?.hasViewed;

    return hasViewed && (hasScrolled || hasSpentTime);
  };

  return (
    <div
      className="flex-1 flex flex-col p-6"
      style={{ opacity: 1, visibility: "visible" }}
    >
      <div className="max-w-4xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-teal-600" />
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              Legal Agreements
            </h2>
          </div>
          <p className="text-gray-600">
            Please review and accept the following agreements to continue using
            BillBuddy
          </p>
        </div>

        {currentDocument ? (
          /* Document Viewer */
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentDocument(null)}
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to List
                </Button>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {currentDocument.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {currentDocument.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {currentDocument.minReadTime > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {Math.ceil(
                      getDocumentProgress(currentDocument.id)?.timeSpent || 0,
                    )}
                    s / {currentDocument.minReadTime}s
                  </Badge>
                )}
                {isDocumentFullyRead(currentDocument.id) && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Fully Read
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="h-80 md:h-96 overflow-y-auto p-6"
                onScroll={handleScroll}
                ref={scrollAreaRef}
                style={{ maxHeight: "calc(100vh - 400px)" }}
              >
                <div className="prose prose-sm max-w-none">
                  <div
                    className="text-sm leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: formatDocumentContent(currentDocument.content),
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={currentDocument.id}
                    checked={legalAgreements?.[currentDocument.id] || false}
                    onCheckedChange={(checked) =>
                      handleAgreementChange(currentDocument.id, !!checked)
                    }
                    disabled={!isDocumentFullyRead(currentDocument.id)}
                  />
                  <label
                    htmlFor={currentDocument.id}
                    className={cn(
                      "text-sm font-medium cursor-pointer",
                      isDocumentFullyRead(currentDocument.id)
                        ? "text-gray-900"
                        : "text-gray-500",
                    )}
                  >
                    I have read and agree to the {currentDocument.title}
                    {currentDocument.isRequired && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                </div>

                {isDocumentFullyRead(currentDocument.id) ? (
                  <div className="flex items-center space-x-2 text-green-600 text-sm">
                    <Check className="h-4 w-4" />
                    <span>Ready to accept</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-amber-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Please read completely</span>
                  </div>
                )}
              </div>

              {/* Progress indicators */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  {getDocumentProgress(currentDocument.id)?.hasViewed ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  <span>Viewed</span>
                </div>

                <div className="flex items-center space-x-1">
                  {getDocumentProgress(currentDocument.id)?.scrolledToBottom ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  <span>Scrolled to end</span>
                </div>

                {currentDocument.minReadTime > 0 && (
                  <div className="flex items-center space-x-1">
                    {(getDocumentProgress(currentDocument.id)?.timeSpent ||
                      0) >=
                    currentDocument.minReadTime * 0.8 ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    <span>
                      Time:{" "}
                      {Math.ceil(
                        getDocumentProgress(currentDocument.id)?.timeSpent || 0,
                      )}
                      s / {Math.ceil(currentDocument.minReadTime * 0.8)}s
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Document List */
          <div className="flex-1 space-y-4">
            <div className="space-y-3">
              {legalDocuments.map((doc) => {
                const progress = getDocumentProgress(doc.id);
                const isFullyRead = isDocumentFullyRead(doc.id);
                const isAccepted = legalAgreements?.[doc.id] || false;

                return (
                  <div
                    key={doc.id}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {doc.title}
                            {doc.isRequired && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {doc.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {progress?.hasViewed && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              isFullyRead
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-amber-100 text-amber-700 border-amber-200",
                            )}
                          >
                            {isFullyRead ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Ready
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Viewed
                              </>
                            )}
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentDocument(doc)}
                        >
                          Read Document
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`${doc.id}-list`}
                          checked={isAccepted}
                          onCheckedChange={(checked) =>
                            handleAgreementChange(doc.id, !!checked)
                          }
                          disabled={!isFullyRead}
                        />
                        <label
                          htmlFor={`${doc.id}-list`}
                          className={cn(
                            "text-sm font-medium cursor-pointer",
                            isFullyRead
                              ? "text-gray-900"
                              : "text-gray-500 cursor-not-allowed",
                          )}
                        >
                          I agree to this document
                        </label>
                      </div>

                      {isAccepted && agreementTimestamps?.[doc.id] && (
                        <div className="text-xs text-gray-500">
                          Accepted:{" "}
                          {new Date(
                            agreementTimestamps[doc.id],
                          ).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {!isFullyRead && progress?.hasViewed && (
                      <div className="mt-2 text-xs text-amber-600">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        {!progress.scrolledToBottom &&
                          "Please scroll to the end of the document. "}
                        {doc.minReadTime > 0 &&
                          progress.timeSpent < doc.minReadTime &&
                          `Please spend at least ${doc.minReadTime} seconds reading.`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h4 className="font-medium text-red-900">
                    Please address the following:
                  </h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="outline"
                onClick={onPrev}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              <Button
                onClick={handleNext}
                className="bg-teal-600 hover:bg-teal-700 flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
