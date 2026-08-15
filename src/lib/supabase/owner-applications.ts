export type OwnerApplicationStatus = "pending" | "approved" | "rejected";

export type OwnerApplication = {
  id: string;
  applicant_id: string;
  applicant_name: string;
  applicant_email: string;
  restaurant_name: string;
  phone: string;
  message: string;
  status: OwnerApplicationStatus;
  created_at: string;
};
