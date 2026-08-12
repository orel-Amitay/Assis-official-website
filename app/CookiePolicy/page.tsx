import type { Metadata } from "next";
import {
  Bullet,
  ContactCard,
  DocLink,
  H2,
  LegalPage,
  List,
  Term,
  legalMetadata,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = legalMetadata("CookiePolicy");

export default function CookiePolicyPage() {
  return (
    <LegalPage slug="CookiePolicy">
      <p>
        This Cookie Policy explains how Assis Online Inc. (&quot;Assis,&quot; &quot;we,&quot;
        &quot;our,&quot; or &quot;us&quot;) uses cookies and similar technologies on
        https://assis.care and related Assis web pages (the &quot;Website&quot;).
      </p>
      <p>
        It should be read together with the <DocLink slug="PrivacyPolicy" /> and{" "}
        <DocLink slug="WebsiteTerms" />. For Assis services used by businesses and end-user
        conversations through Assis channels, see also the{" "}
        <DocLink slug="BusinessTerms" label="Business Terms" />,{" "}
        <DocLink slug="EndUserTerms" label="End User Terms" />,{" "}
        <DocLink slug="PrivacyPolicy" label="Privacy Policy" />, and{" "}
        <DocLink slug="DataProcessingAgreement" label="Data Processing Agreement" />.
      </p>

      <section className="space-y-4">
        <H2>1. What Are Cookies?</H2>
        <p>
          Cookies are small text files stored on your device when you visit a website. Similar
          technologies include pixels, tags, local storage, and software development kits (together,
          &quot;cookies&quot; in this Policy).
        </p>
        <p>
          Cookies may be set by Assis (&quot;first-party&quot;) or by third parties that provide
          services on the Website (&quot;third-party&quot;), such as analytics or advertising
          partners.
        </p>
      </section>

      <section className="space-y-4">
        <H2>2. How We Use Cookies</H2>
        <p>We may use cookies to:</p>
        <List spacing="loose">
          <Bullet>
            Operate and secure the Website (for example, load balancing, fraud prevention, and keeping
            preferences)
          </Bullet>
          <Bullet>Remember choices such as language or cookie preferences</Bullet>
          <Bullet>
            Understand how visitors use the Website (pages viewed, approximate location derived from
            IP, device/browser type, referral source, and similar analytics)
          </Bullet>
          <Bullet>Measure marketing campaigns and improve Website content</Bullet>
          <Bullet>Support login or demo/request forms where applicable</Bullet>
        </List>
        <p>
          Depending on configuration, this may include tools such as Google Analytics, Meta
          (Facebook/Instagram) pixels, LinkedIn or other advertising/analytics tags, and similar
          providers. The specific tools in use may change as Assis updates the Website.
        </p>
      </section>

      <section className="space-y-4">
        <H2>3. Types of Cookies</H2>
        <List spacing="loose">
          <Bullet>
            <Term>Strictly necessary cookies</Term> - required for basic Website functions, security,
            and preference storage related to consent. These typically do not require consent where
            exempt under applicable law.
          </Bullet>
          <Bullet>
            <Term>Analytics/performance cookies</Term> - help us understand Website traffic and usage
            so we can improve the Website.
          </Bullet>
          <Bullet>
            <Term>Functional cookies</Term> - remember choices and improve features.
          </Bullet>
          <Bullet>
            <Term>Marketing/advertising cookies</Term> - help measure campaigns, build audiences, and
            show or limit relevant ads on Assis or third-party platforms, where used.
          </Bullet>
        </List>
      </section>

      <section className="space-y-4">
        <H2>4. Legal Basis and Consent</H2>
        <p>
          Where required by law (including in the EEA/UK and similar jurisdictions), Assis will
          request consent for non-essential cookies through a cookie banner or preference center
          before setting those cookies.
        </p>
        <p>
          You can withdraw or change cookie preferences at any time through the banner/preferences
          controls (where available) or by adjusting your browser settings. Strictly necessary cookies
          may continue to operate.
        </p>
        <p>
          Where consent is not required, Assis may rely on legitimate interests or another lawful
          basis described in the <DocLink slug="PrivacyPolicy" />, subject to applicable law.
        </p>
      </section>

      <section className="space-y-4">
        <H2>5. Managing Cookies</H2>
        <p>You can control cookies by:</p>
        <List>
          <Bullet>
            Using the Assis cookie banner or preference settings on the Website (where available)
          </Bullet>
          <Bullet>Blocking or deleting cookies in your browser settings</Bullet>
          <Bullet>Using industry opt-out tools for interest-based advertising where available</Bullet>
          <Bullet>
            Using Google Analytics opt-out tools or similar vendor controls, where applicable
          </Bullet>
        </List>
        <p>If you disable cookies, some Website features may not work properly.</p>
      </section>

      <section className="space-y-4">
        <H2>6. Data Sharing and Retention</H2>
        <p>
          Cookie-related data may be processed by Assis and by service providers/partners that operate
          the relevant tools. Those providers may process data in the United States or other
          countries. See the <DocLink slug="PrivacyPolicy" /> for transfers, sharing, and retention
          principles.
        </p>
        <p>
          Cookie lifetimes vary: some expire when you close your browser (session cookies); others
          remain for a set period (persistent cookies) unless deleted earlier.
        </p>
      </section>

      <section className="space-y-4">
        <H2>7. Do Not Sell / Targeted Advertising</H2>
        <p>
          Assis does not sell personal information for money. Some analytics or advertising cookies
          may be considered &quot;sharing&quot; or targeted advertising under certain U.S. state laws.
          Where required, Assis will provide opt-out mechanisms described on the Website or in the{" "}
          <DocLink slug="PrivacyPolicy" />.
        </p>
      </section>

      <section className="space-y-4">
        <H2>8. Updates</H2>
        <p>
          Assis may update this Cookie Policy when tools, practices, or laws change. The Last Updated
          date appears above. Material changes will be reflected on the Website, and Assis will
          provide additional notice where required by law.
        </p>
      </section>

      <section className="space-y-4">
        <H2>9. Contact</H2>
        <p>Questions about cookies or this Policy:</p>
        <ContactCard />
      </section>
    </LegalPage>
  );
}
