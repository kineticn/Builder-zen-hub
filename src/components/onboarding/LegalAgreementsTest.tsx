import React, { useState } from "react";
import { LegalAgreementsStep } from "./LegalAgreementsStep";

interface LegalAgreements {
  termsOfService: boolean;
  privacyPolicy: boolean;
  electronicConsent: boolean;
  plaidTerms: boolean;
  dataSharing: boolean;
  communicationConsent: boolean;
}

/**
 * Test component to verify LegalAgreementsStep works properly
 * This helps debug any prop initialization issues
 */
export const LegalAgreementsTest: React.FC = () => {
  const [legalAgreements, setLegalAgreements] = useState<LegalAgreements>({
    termsOfService: false,
    privacyPolicy: false,
    electronicConsent: false,
    plaidTerms: false,
    dataSharing: false,
    communicationConsent: false,
  });

  const [agreementTimestamps, setAgreementTimestamps] = useState<
    Record<string, string>
  >({});

  return (
    <div className="min-h-screen bg-gray-50">
      <LegalAgreementsStep
        onNext={() => console.log("Next clicked")}
        onPrev={() => console.log("Prev clicked")}
        legalAgreements={legalAgreements}
        agreementTimestamps={agreementTimestamps}
        onUpdateAgreements={setLegalAgreements}
        onUpdateTimestamps={setAgreementTimestamps}
      />
    </div>
  );
};
