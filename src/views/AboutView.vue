<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">Sobre Nosotros</h1>
          <div class="hero-divider"></div>
          <p class="hero-subtitle">seguimos desde el 2015</p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
      <div class="content-container">
        <!-- Brand Story -->
        <div class="content-block">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <img
                src="https://www.joma.com.pe/wp-content/uploads/2025/06/zapatillas-deportivas.jpg"
                alt="Tienda moderna"
                class="content-image"
              />
            </div>
            <div class="col-lg-6">
              <div class="content-text">
                <h2 class="section-title">Nuestra Historia</h2>
                <p class="section-paragraph">
                  Desde 2015, Ramos es una tienda familiar dirigida por Ana Ramos. Su pasión por
                  las zapatillas deportivas convirtió el proyecto en una opción confiable para quienes
                  buscan calzado cómodo, resistente y con estilo.
                </p>
                <p class="section-paragraph">
                  Ana ofrece una amplia variedad de zapatillas: deportivas, casuales, urbanas y de
                  entrenamiento. Cada modelo se selecciona pensando en la comodidad, la durabilidad
                  y la tendencias actuales.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Visit Us -->
        <div class="visit-section">
          <div class="visit-content">
            <h2 class="section-title text-center">Visítanos</h2>
            <p class="section-paragraph text-center">
              Descubre nuestra colección completa en nuestras tiendas físicas. Nuestro equipo está
              listo para ayudarte a encontrar las piezas perfectas.
            </p>
            <div class="row g-4 mt-4">
              <div class="col-md-6">
                <div class="location-card">
                  <h4 class="location-title">Potosí - Villazón</h4>
                  <p class="location-address">
                    Av. Villazón<br />
                    Local 12<br />
                    Lunes a Domingo: 10:00 - 22:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Editorial Premium Design - Inspirado en COS, Arket, The Row */

.about-page {
  /* Fondo principal: gradiente celeste pastel (ligero arriba, más profundo abajo) */
  background: linear-gradient(180deg, #eaf6ff 0%, #c2d8ff 100%);
  color: #0b0b0b;
}

/* Hero Section */
.hero-section {
  /* Hacer la sección hero transparente para que el gradiente de fondo sea continuo */
  background: transparent;
  padding: 120px 0 80px 0;
  margin-top: 80px;
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.hero-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 300;
  letter-spacing: 4px;
  color: #000000;
  text-transform: uppercase;
  margin-bottom: 30px;
}

.hero-divider {
  width: 60px;
  height: 1px;
  background: #000000;
  margin: 0 auto 30px auto;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #222222;
  line-height: 1.8;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Content Section */
.content-section {
  padding: 80px 0;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.content-block {
  margin-bottom: 100px;
}

.content-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
}

.content-text {
  padding: 0 60px;
}

.section-title {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: #000000;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.section-paragraph {
  font-size: 1rem;
  line-height: 1.8;
  color: #222222;
  margin-bottom: 20px;
  font-weight: 300;
}

/* Values Section */
.values-section {
  margin-bottom: 100px;
  padding-top: 60px;
  border-top: 1px solid rgba(11,53,80,0.06);
}

.value-card {
  text-align: center;
  padding: 40px 20px;
  transition: background 0.3s ease, transform 0.18s ease;
  background: rgba(234,246,255,0.35);
  border-radius: 8px;
}

.value-card:hover {
  background: rgba(234,246,255,0.55);
  transform: translateY(-6px);
}

.value-icon {
  color: #000000;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.value-title {
  font-size: 1.125rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #000000;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.value-description {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #222222;
  font-weight: 300;
}

/* Team Section */
.team-section {
  margin-bottom: 100px;
  padding-top: 60px;
  border-top: 1px solid #e5e5e5;
}

.team-member {
  text-align: center;
}

.team-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  margin-bottom: 20px;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.team-member:hover .team-image {
  filter: grayscale(0%);
}

.team-name {
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #000000;
  margin-bottom: 8px;
}

.team-role {
  font-size: 0.875rem;
  color: #555555;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 300;
}

/* Visit Section */
.visit-section {
  background: transparent;
  padding: 80px 0;
  margin: 0 -40px;
}

.visit-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.location-card {
  background: rgba(234,246,255,0.9);
  padding: 40px;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(11,53,80,0.04);
}

.location-title {
  font-size: 1.125rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #000000;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.location-address {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: #222222;
  font-weight: 300;
  margin: 0;
}

/* Responsive */
@media (max-width: 991px) {
  .hero-title {
    font-size: 2rem;
  }

  .content-text {
    padding: 40px 0;
  }

  .content-image {
    height: 400px;
  }

  .team-image {
    height: 300px;
  }
}

@media (max-width: 767px) {
  .hero-section {
    padding: 80px 0 60px 0;
  }

  .hero-title {
    font-size: 1.75rem;
    letter-spacing: 2px;
  }

  .content-section {
    padding: 60px 0;
  }

  .content-block {
    margin-bottom: 60px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .values-section,
  .team-section {
    margin-bottom: 60px;
  }

  .visit-section {
    padding: 60px 0;
  }
}
</style>
