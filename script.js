const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const inquiryForm = document.querySelector(".inquiry-form");
const formNote = document.querySelector(".form-note");
const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll(".hero-dots span"));

navToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    mainNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

let activeSlide = 0;

const showSlide = (index) => {
  slides[activeSlide]?.classList.remove("is-active");
  dots[activeSlide]?.classList.remove("is-active");
  activeSlide = index % slides.length;
  slides[activeSlide]?.classList.add("is-active");
  dots[activeSlide]?.classList.add("is-active");
};

if (slides.length > 1) {
  setInterval(() => showSlide(activeSlide + 1), 5200);
}

inquiryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(inquiryForm);
  const accessKey = formData.get("access_key");
  const submitButton = inquiryForm.querySelector("button[type='submit']");

  if (!accessKey || accessKey === "PASTE_WEB3FORMS_ACCESS_KEY_HERE") {
    formNote.textContent = "Email setup pending. Add your Web3Forms access key in index.html.";
    return;
  }

  formNote.textContent = "Sending inquiry...";
  submitButton.disabled = true;

  try {
    const response = await fetch(inquiryForm.action, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Inquiry could not be sent.");
    }

    formNote.textContent = "Thank you. We will contact you to arrange a visit.";
    inquiryForm.reset();
  } catch (error) {
    formNote.textContent = "Sorry, the inquiry could not be sent. Please WhatsApp us.";
  } finally {
    submitButton.disabled = false;
  }
});
