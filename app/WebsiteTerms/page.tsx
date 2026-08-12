import type { Metadata } from "next";
import {
  Bullet,
  ContactCard,
  DocLink,
  H2,
  LegalPage,
  List,
  legalMetadata,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = legalMetadata("WebsiteTerms");

export default function WebsiteTermsPage() {
  return (
    <LegalPage slug="WebsiteTerms">
      <p>
        These Website Terms (&quot;Website Terms&quot;) govern your access to and use of the Assis
        marketing website at https://assis.care and related Assis web pages that link to these Website
        Terms (the &quot;Website&quot;).
      </p>
      <p>
        The Website is operated by Assis Online Inc. (&quot;Assis,&quot; &quot;we,&quot;
        &quot;our,&quot; or &quot;us&quot;), a U.S.-based company.
      </p>
      <p>These Website Terms apply to visitors browsing the Website. They are different from:</p>
      <List spacing="loose">
        <Bullet>
          <DocLink slug="BusinessTerms" /> - for businesses that purchase or use Assis services
        </Bullet>
        <Bullet>
          <DocLink slug="EndUserTerms" /> - for customers interacting with a business through
          Assis-powered channels
        </Bullet>
        <Bullet>
          <DocLink slug="PrivacyPolicy" />, <DocLink slug="CookiePolicy" label="Cookie Policy" />, and{" "}
          <DocLink slug="DataProcessingAgreement" label="Data Processing Agreement" /> - which address
          personal information and business data processing
        </Bullet>
      </List>
      <p>
        By using the Website, you agree to these Website Terms. If you do not agree, do not use the
        Website.
      </p>

      <section className="space-y-4">
        <H2>1. Informational Website</H2>
        <p>
          The Website provides information about Assis and its products and services. Website content
          is for general information only and may change. It is not a binding offer unless Assis
          expressly states otherwise in a separate agreement or checkout flow.
        </p>
        <p>
          Product descriptions, pricing, features, and availability shown on the Website may be
          updated and may differ from a signed commercial agreement or subscription purchase.
        </p>
      </section>

      <section className="space-y-4">
        <H2>2. Accounts and Business Use</H2>
        <p>
          Some Website features may allow you to create an account, request a demo, start a trial, or
          subscribe. If you purchase or use Assis services as a business, the{" "}
          <DocLink slug="BusinessTerms" /> and <DocLink slug="DataProcessingAgreement" /> also apply
          and control for the services.
        </p>
        <p>
          You represent that information you submit through the Website is accurate and that you have
          authority to submit it (including on behalf of a business, if applicable).
        </p>
      </section>

      <section className="space-y-4">
        <H2>3. Acceptable Use</H2>
        <p>You may use the Website only for lawful purposes. You may not:</p>
        <List>
          <Bullet>Attempt unauthorized access to the Website, accounts, systems, or data</Bullet>
          <Bullet>Interfere with or disrupt the Website or related infrastructure</Bullet>
          <Bullet>
            Scrape, crawl, or harvest Website content in a manner that overloads or harms the Website,
            except as allowed by robots.txt or prior written permission
          </Bullet>
          <Bullet>Upload malware or harmful code</Bullet>
          <Bullet>Impersonate any person or entity or misrepresent your affiliation</Bullet>
          <Bullet>Use the Website to violate law, privacy, or intellectual property rights</Bullet>
        </List>
        <p>Assis may suspend or restrict access for suspected violations or security risk.</p>
      </section>

      <section className="space-y-4">
        <H2>4. Intellectual Property</H2>
        <p>
          The Website and its content - including text, graphics, logos, trademarks, designs,
          software, and media - are owned by Assis or its licensors and are protected by intellectual
          property laws.
        </p>
        <p>
          You may view and use the Website for personal or internal business evaluation of Assis. You
          may not copy, modify, distribute, sell, or create derivative works from Website content
          without Assis&apos;s prior written permission, except for limited quotations with
          attribution for non-commercial commentary or as permitted by law.
        </p>
      </section>

      <section className="space-y-4">
        <H2>5. Third-Party Links and Tools</H2>
        <p>
          The Website may link to third-party sites or tools. Assis is not responsible for third-party
          content, terms, or privacy practices. Your use of third-party services is at your own risk
          and subject to their terms.
        </p>
      </section>

      <section className="space-y-4">
        <H2>6. Privacy and Cookies</H2>
        <p>
          Personal information collected through the Website is handled under the{" "}
          <DocLink slug="PrivacyPolicy" />. Cookies and similar technologies are described in the{" "}
          <DocLink slug="CookiePolicy" />. Where required by law, Assis may present a cookie banner or
          preference controls.
        </p>
      </section>

      <section className="space-y-4">
        <H2>7. No Warranty</H2>
        <p>
          To the maximum extent permitted by law, the Website is provided &quot;AS IS&quot; and
          &quot;AS AVAILABLE.&quot; Assis does not warrant that the Website will be uninterrupted,
          error-free, secure, or free of harmful components, or that Website content is complete,
          accurate, or current.
        </p>
      </section>

      <section className="space-y-4">
        <H2>8. Limitation of Liability</H2>
        <p>
          To the maximum extent permitted by law, Assis will not be liable for indirect, incidental,
          special, consequential, or punitive damages, or for loss of profits, data, or goodwill,
          arising from your use of or inability to use the Website.
        </p>
        <p>
          To the maximum extent permitted by law, Assis&apos;s total liability arising out of or
          relating to the Website will not exceed one hundred U.S. dollars (USD $100), except where
          liability cannot lawfully be limited. Nothing in these Website Terms limits rights that
          cannot lawfully be limited or waived.
        </p>
      </section>

      <section className="space-y-4">
        <H2>9. Indemnity</H2>
        <p>
          To the extent permitted by law, you agree to indemnify and hold harmless Assis from claims
          arising out of your misuse of the Website or your violation of these Website Terms.
        </p>
      </section>

      <section className="space-y-4">
        <H2>10. Changes</H2>
        <p>
          Assis may update the Website and these Website Terms. The latest version will show a new
          Last Updated date. Continued use after changes become effective constitutes acceptance,
          subject to applicable law.
        </p>
      </section>

      <section className="space-y-4">
        <H2>11. Governing Law</H2>
        <p>
          These Website Terms are governed by the laws of the State of California, United States,
          excluding conflict-of-law rules, subject to mandatory law that applies to you. Subject to
          applicable law, courts in San Francisco County, California have jurisdiction over disputes
          relating to the Website.
        </p>
      </section>

      <section className="space-y-4">
        <H2>12. Contact</H2>
        <ContactCard />
      </section>
    </LegalPage>
  );
}
