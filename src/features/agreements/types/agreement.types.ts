export interface AgreementTemplate {
  id: string;
  name: string;
  content: string; // with {{variables}}
  lastModified: string;
}

export interface SignedAgreement {
  id: string;
  bookingId: string;
  url: string;
  signedAt: string;
  status: "pending" | "signed" | "canceled";
}
