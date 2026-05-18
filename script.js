const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const inquiryForm = document.querySelector(".inquiry-form");
const formNote = document.querySelector(".form-note");
const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll(".hero-dots span"));
const galleryImages = Array.from(document.querySelectorAll(".gallery-grid img"));
const galleryLightbox = document.querySelector(".gallery-lightbox");
const galleryLightboxImage = document.querySelector(".gallery-lightbox img");
const galleryLightboxCaption = document.querySelector(".gallery-lightbox figcaption");
const galleryClose = document.querySelector(".gallery-close");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");

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

let activeGalleryIndex = 0;

const showGalleryImage = (index) => {
  if (!galleryImages.length || !galleryLightboxImage || !galleryLightboxCaption) return;

  activeGalleryIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[activeGalleryIndex];
  galleryLightboxImage.src = image.src;
  galleryLightboxImage.alt = image.alt;
  galleryLightboxCaption.textContent = image.alt;
};

const openGallery = (index) => {
  if (!galleryLightbox) return;

  showGalleryImage(index);
  galleryLightbox.classList.add("is-open");
  galleryLightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeGallery = () => {
  if (!galleryLightbox) return;

  galleryLightbox.classList.remove("is-open");
  galleryLightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

galleryImages.forEach((image, index) => {
  image.tabIndex = 0;
  image.addEventListener("click", () => openGallery(index));
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGallery(index);
    }
  });
});

galleryClose?.addEventListener("click", closeGallery);
galleryPrev?.addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
galleryNext?.addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));

galleryLightbox?.addEventListener("click", (event) => {
  if (event.target === galleryLightbox) closeGallery();
});

document.addEventListener("keydown", (event) => {
  if (!galleryLightbox?.classList.contains("is-open")) return;

  if (event.key === "Escape") closeGallery();
  if (event.key === "ArrowLeft") showGalleryImage(activeGalleryIndex - 1);
  if (event.key === "ArrowRight") showGalleryImage(activeGalleryIndex + 1);
});

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
