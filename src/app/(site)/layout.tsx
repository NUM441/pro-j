import Header from "@/components/Header";
import ContactChatWidget from "@/components/ContactChatWidget";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <ContactChatWidget />
    </>
  );
}
