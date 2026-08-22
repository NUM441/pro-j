import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactChatWidget from "@/components/ContactChatWidget";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ContactChatWidget />
    </>
  );
}
