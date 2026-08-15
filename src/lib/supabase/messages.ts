export type ContactMessage = {
  id: string;
  user_id: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  is_admin: boolean;
  message: string;
  image_url: string | null;
  created_at: string;
};
