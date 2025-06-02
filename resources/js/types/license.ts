export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    customer_type: "individual" | "business" | "education";
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface LicenseType {
    id: number;
    code: string;
    name: string;
    description: string;
    duration_days: number | null;
    max_devices: number;
    price: number;
    currency: string;
    features: string[];
    restrictions: Record<string, any>;
    is_trial: boolean;
    is_lifetime: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface LicenseActivation {
    id: number;
    device_id: string;
    device_name: string | null;
    device_platform: string | null;
    status: "active" | "inactive" | "suspended";
    activated_at: string;
    last_used_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface License {
    id: number;
    license_key: string;
    customer_id: number;
    license_type_id: number;
    status: "active" | "expired" | "suspended" | "revoked";
    issued_at: string;
    activated_at: string | null;
    expires_at: string | null;
    max_devices: number;
    devices_used: number;
    purchase_price: number;
    purchase_currency: string;
    order_id: string | null;
    payment_method: string | null;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;

    // Relationships
    customer: Customer;
    license_type: LicenseType;
    activations: LicenseActivation[];
}

export interface DashboardStats {
    total_licenses: number;
    active_licenses: number;
    expired_licenses: number;
    total_customers: number;
    total_activations: number;
    online_devices: number;
    today_activations: number;
    this_month_revenue: number;
}

export interface GenerateLicenseData {
    license_type: string;
    customer_email: string;
    customer_name: string;
    customer_type?: "individual" | "business" | "education";
    max_devices?: number;
    purchase_price?: number;
    purchase_currency?: string;
    order_id?: string;
    payment_method?: string;
    admin_notes?: string;
}

//   export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
//     auth: {
//       user: User;
//     };
//     stats?: DashboardStats;
//     licenses?: License[];
//     licenseTypes?: LicenseType[];
//     recentLicenses?: License[];
//     flash?: {
//       success?: string;
//       error?: string;
//     };
//   } & T
