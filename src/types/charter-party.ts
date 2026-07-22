export interface CharterParty {
  id: number;
  companyName: string;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  billingAddress: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  pickupAddress: string | null;
  notes: string | null;
  active: boolean;
}