export type ContactMessage = {
  id: string;
  user_id: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  is_admin: boolean;
  message: string;
  created_at: string;
};
