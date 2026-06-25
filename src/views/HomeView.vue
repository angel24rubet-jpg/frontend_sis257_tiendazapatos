<script setup lang="ts">
import FeaturedProducts from '@/components/FeaturedProducts.vue'
import ProductGallery from '@/components/ProductGallery.vue'
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="py-11 bg-light-gradient border-bottom border-white border-5">
      <div class="bg-holder overlay overlay-light" style="background-image:url(/src/assets/img/gallery/header-bg.png);background-size:cover;">
      </div>

      <div class="container">
        <div class="row flex-center">
          <div class="col-12 mb-10 text-center">
            <div class="d-flex align-items-center flex-column">
              <h1 class="text-white text-uppercase fw-bold fs-2 fs-lg-4" style="letter-spacing:0.12em;">Zapatillas para cada paso de tu día</h1>
              <h1 class="text-white text-uppercase fw-bold fs-3 fs-lg-7" style="letter-spacing:0.08em;">Estilo deportivo y comodidad en cada modelo</h1>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- For Her / For Him Section -->
    <section class="py-0" id="header" style="margin-top: -23rem !important;">
      <div class="container">
        <div class="row g-0">
          <div class="col-md-6">
            <div class="card card-span h-100 text-white">
              <img class="img-fluid" src="/src/assets/img/gallery/her.png" width="790" alt="Para Ella" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="card card-span h-100 text-white">
              <img class="img-fluid" src="/src/assets/img/gallery/him.png" width="790" alt="Para Él" />
            </div>
          </div>
        </div>
      </div>
    </section>



    <!-- Featured Products Section -->
    <FeaturedProducts />

    <!-- Product Gallery Section -->
    <ProductGallery />

    <!-- ========== PROMO BANNER ========== -->
    <section class="features-section py-5">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col-12">
            <h2 class="section-title fw-bold">¿Por qué elegirnos?</h2>
            <p class="section-subtitle text-muted">Nos comprometemos con tu satisfacción</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="feature-card text-center p-4 h-100">
              <div class="feature-icon-wrapper mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </div>
              <h5 class="feature-title fw-bold">Envío Rápido</h5>
              <p class="feature-text text-muted mb-0">Entrega en 24-48 horas a toda Bolivia. Envío gratis en pedidos mayores a 200 Bs.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="feature-card text-center p-4 h-100">
              <div class="feature-icon-wrapper mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                  <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                </svg>
              </div>
              <h5 class="feature-title fw-bold">Devolución Fácil</h5>
              <p class="feature-text text-muted mb-0">30 días para cambios y devoluciones sin complicaciones. Tu satisfacción es nuestra prioridad.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="feature-card text-center p-4 h-100">
              <div class="feature-icon-wrapper mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                </svg>
              </div>
              <h5 class="feature-title fw-bold">Pago 100% Seguro</h5>
              <p class="feature-text text-muted mb-0">Transacciones protegidas con encriptación SSL. Múltiples métodos de pago disponibles.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="feature-card text-center p-4 h-100">
              <div class="feature-icon-wrapper mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                </svg>
              </div>
              <h5 class="feature-title fw-bold">Soporte 24/7</h5>
              <p class="feature-text text-muted mb-0">Atención personalizada por WhatsApp, chat en vivo o correo electrónico.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== PROMO BANNER ========== -->
    <section class="promo-banner-section">
      <div class="container-fluid p-0">
        <div class="promo-banner">
          <div class="container">
            <div class="row align-items-center py-5">
              <div class="col-lg-7">
                <span class="promo-badge">OFERTA ESPECIAL</span>
                <h2 class="promo-title">Hasta 30% de Descuento</h2>
                <p class="promo-text">En toda la colección de temporada. ¡Oferta válida solo por tiempo limitado!</p>
                <a href="#coleccion" class="btn btn-light btn-lg promo-btn">
                  Comprar Ahora
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </svg>
                </a>
              </div>
              <div class="col-lg-5 text-center d-none d-lg-block">
                <div class="promo-countdown">
                  <div class="countdown-item">
                    <span class="countdown-number">15</span>
                    <span class="countdown-label">Días</span>
                  </div>
                  <div class="countdown-item">
                    <span class="countdown-number">08</span>
                    <span class="countdown-label">Horas</span>
                  </div>
                  <div class="countdown-item">
                    <span class="countdown-number">45</span>
                    <span class="countdown-label">Min</span>
                  </div>
                  <div class="countdown-item">
                    <span class="countdown-number">30</span>
                    <span class="countdown-label">Seg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== NEWSLETTER SECTION ========== -->
    <section class="newsletter-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="newsletter-card">
              <div class="row align-items-center">
                <div class="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
                  <h3 class="newsletter-title">Suscríbete a Nuestro Newsletter</h3>
                  <p class="newsletter-text">Recibe ofertas exclusivas y las últimas novedades directamente en tu correo.</p>
                </div>
                <div class="col-lg-6">
                  <form class="newsletter-form">
                    <div class="input-group">
                      <input type="email" class="form-control form-control-lg" placeholder="Tu correo electrónico">
                      <button class="btn btn-dark btn-lg" type="button">
                        Suscribirse
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== BRANDS / PARTNERS SECTION ========== -->
    <section class="brands-section py-4 border-top border-bottom">
      <div class="container">
        <div class="row align-items-center justify-content-center text-center g-4">
          <div class="col-6 col-md-2">
            <span class="brand-text">FASHION</span>
          </div>
          <div class="col-6 col-md-2">
            <span class="brand-text">STYLE</span>
          </div>
          <div class="col-6 col-md-2">
            <span class="brand-text">TREND</span>
          </div>
          <div class="col-6 col-md-2">
            <span class="brand-text">URBAN</span>
          </div>
          <div class="col-6 col-md-2">
            <span class="brand-text">ELEGANCE</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-holder {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.bg-holder.overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.bg-holder.overlay-light::before {
  background-color: rgba(255, 255, 255, 0.15);
}

.bg-light-gradient {
  background: linear-gradient(180deg, #ffffff 0%, #fdfdff 100%);
}

.bg-dark-gradient {
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
}

.card-span {
  position: relative;
  overflow: hidden;
}

#header {
  background: rgba(85, 65, 155, 0.75);
  padding: 40px 0 !important;
}

.card-img-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ========== SECTION TITLES ========== */
.section-title {
  font-size: 2.25rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.1rem;
}

/* ========== FEATURES SECTION ========== */
.features-section {
  background: #5a8dd4;
}

.feature-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.feature-icon-wrapper svg {
  color: #1a1a1a;
}

.feature-title {
  color: #1a1a1a;
  font-size: 1.1rem;
}

.feature-text {
  font-size: 0.95rem;
  line-height: 1.6;
}

/* ========== PROMO BANNER SECTION ========== */
.promo-banner {
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #1a1a1a 100%);
  color: #ffffff;
}

.promo-badge {
  display: inline-block;
  background: #ff4757;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.promo-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.promo-text {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.promo-btn {
  font-weight: 600;
  border-radius: 30px;
  transition: transform 0.3s ease;
}

.promo-btn:hover {
  transform: scale(1.05);
}

.promo-countdown {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.countdown-item {
  text-align: center;
  background: rgba(255,255,255,0.1);
  padding: 20px 25px;
  border-radius: 10px;
}

.countdown-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.countdown-label {
  display: block;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 8px;
  opacity: 0.8;
}

/* ========== TRENDING PRODUCTS ========== */
.trending-section {
  background: #ffffff;
}

.trending-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.trending-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.trending-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  background: #f8f9fa;
}

.trending-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.trending-card:hover .trending-image {
  transform: scale(1.1);
}

.trending-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #1a1a1a;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  z-index: 2;
}

.trending-badge.new {
  background: #00b894;
}

.trending-badge.sale {
  background: #ff4757;
}

.trending-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.trending-card:hover .trending-overlay {
  opacity: 1;
}

.btn-quick-view {
  background: #ffffff;
  color: #1a1a1a;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(20px);
}

.trending-card:hover .btn-quick-view {
  transform: translateY(0);
}

.btn-quick-view:hover {
  background: #1a1a1a;
  color: #ffffff;
}

.trending-info {
  padding: 20px;
}

.trending-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.trending-rating {
  margin-bottom: 10px;
}

.trending-rating .stars {
  color: #ffc107;
  font-size: 0.9rem;
}

.trending-rating .reviews {
  color: #999;
  font-size: 0.8rem;
  margin-left: 5px;
}

.trending-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.trending-price .old-price {
  text-decoration: line-through;
  color: #999;
  font-weight: 400;
  font-size: 0.9rem;
  margin-right: 8px;
}

/* ========== TESTIMONIALS SECTION ========== */
.testimonials-section {
  background: #f8f9fa;
}

.testimonial-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  height: 100%;
  transition: transform 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
}

.testimonial-rating {
  font-size: 1.2rem;
}

.testimonial-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
  font-style: italic;
  margin-bottom: 25px;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.testimonial-avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
}

.testimonial-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.testimonial-role {
  font-size: 0.85rem;
  color: #888;
}

/* ========== INSTAGRAM SECTION ========== */
.instagram-section {
  background: #ffffff;
}

.instagram-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}

.instagram-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.instagram-item:hover .instagram-image {
  transform: scale(1.1);
}

.instagram-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.instagram-item:hover .instagram-overlay {
  opacity: 1;
}

.instagram-overlay svg {
  color: #ffffff;
}

/* ========== NEWSLETTER SECTION ========== */
.newsletter-section {
  background: #ffffff;
}

.newsletter-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  color: #ffffff;
  padding: 50px 40px;
  border-radius: 20px;
}

.newsletter-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.newsletter-text {
  opacity: 0.85;
  margin: 0;
}

.newsletter-form .form-control {
  border: none;
  border-radius: 30px 0 0 30px;
  padding: 15px 25px;
  font-size: 1rem;
}

.newsletter-form .form-control:focus {
  box-shadow: none;
}

.newsletter-form .btn {
  border-radius: 0 30px 30px 0;
  padding: 15px 30px;
  font-weight: 600;
}

/* ========== BRANDS SECTION ========== */
.brands-section {
  background: #ffffff;
}

.brand-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ccc;
  letter-spacing: 3px;
  transition: color 0.3s ease;
}

.brand-text:hover {
  color: #1a1a1a;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 992px) {
  .section-title {
    font-size: 1.75rem;
  }

  .promo-title {
    font-size: 2rem;
  }

  .countdown-item {
    padding: 15px 18px;
  }

  .countdown-number {
    font-size: 2rem;
  }

  .newsletter-card {
    padding: 35px 25px;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }

  .section-subtitle {
    font-size: 0.95rem;
  }

  .promo-title {
    font-size: 1.75rem;
  }

  .promo-text {
    font-size: 1rem;
  }

  .newsletter-title {
    font-size: 1.25rem;
  }

  .newsletter-form .input-group {
    flex-direction: column;
  }

  .newsletter-form .form-control {
    border-radius: 30px;
    margin-bottom: 10px;
  }

  .newsletter-form .btn {
    border-radius: 30px;
    width: 100%;
  }

  .brand-text {
    font-size: 1rem;
    letter-spacing: 1px;
  }

  .testimonial-card {
    padding: 20px;
  }

  .testimonial-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .feature-card {
    padding: 20px !important;
  }

  .trending-info {
    padding: 15px;
  }

  .trending-name {
    font-size: 0.9rem;
  }
}
</style>
