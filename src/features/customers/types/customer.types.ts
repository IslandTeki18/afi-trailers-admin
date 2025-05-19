export interface Customer {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  driverLicense?: {
    number: string;
    expirationDate: Date;
    state: string;
  };
  rentalHistory?: string[]; 
  paymentMethods?: string[]; 
  preferences?: {
    notificationPreferences: {
      email: boolean;
      sms: boolean;
    };
    favoriteTrailers?: string[];
  };
  accountStatus: "active" | "suspended" | "inactive";
  verificationStatus?: {
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  };
  notes?: string;
  lastLogin?: Date;
  createdAt?: string;
  updatedAt?: string;
}
