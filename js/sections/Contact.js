import { renderContactInfo } from "../components/contact/ContactInfo.js";
import {
  renderContactForm,
  initContactForm,
} from "../components/contact/ContactForm.js";

export function renderContact(s) {
  const infoHtml = renderContactInfo({
    eyebrow: s.eyebrow,
    title: s.title,
    description: s.description,
    channels: s.channels,
  });

  const formHtml = renderContactForm({
    formTitle: s.formTitle,
    formName: s.formName,
    formEmail: s.formEmail,
    formMessage: s.formMessage,
    formButton: s.formButton,
  });

  return `
  <wl-contact class="section contact-section" id="contact">
    <div class="container contact-inner">
      ${infoHtml}
      ${formHtml}
    </div>
  </wl-contact>`;
}

export function initContactInteractions(s = {}) {
  initContactForm({
    formSuccess:
      s?.formSuccess ||
      "Yêu cầu của bạn đã được gửi, chúng tôi sẽ liên hệ nhanh nhất cho bạn.",
  });
}

// ============================================================================
// Web Component <wl-contact> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlContact extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderContact(this._config);
      initContactInteractions(this._config);
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderContact(config);
    initContactInteractions(config);
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("wl-contact")
) {
  customElements.define("wl-contact", WlContact);
}
