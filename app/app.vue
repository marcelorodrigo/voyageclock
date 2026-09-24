<template>
  <div class="site-shell">
    <NuxtRouteAnnouncer />
    <header class="site-header">
      <NuxtLink class="brand" to="/" aria-label="VoyageClock home"><span class="brand-icon">◷</span> voyageclock</NuxtLink>
      <nav aria-label="Main navigation">
        <NuxtLink to="/science">The science</NuxtLink>
        <NuxtLink class="nav-cta" to="/plan">Plan your trip <span aria-hidden="true">↗</span></NuxtLink>
      </nav>
    </header>
    <main><NuxtPage /></main>
    <footer class="site-footer"><NuxtLink class="brand" to="/"><span class="brand-icon">◷</span> voyageclock</NuxtLink><span>Travel well. Arrive in rhythm.</span></footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap');
:root { font-family: 'DM Sans', sans-serif; color: #20352d; background: #f7f8f3; font-synthesis: none; text-rendering: optimizeLegibility; --ink: #20352d; --muted: #718077; --green: #397853; --green-dark: #265d3f; --display: 'Manrope', sans-serif; }
* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
a { color: inherit; }
button, input, select { font: inherit; }
.site-shell { min-height: 100vh; }
.site-header, .site-footer { display: flex; align-items: center; justify-content: space-between; width: min(1120px, calc(100% - 3rem)); margin: 0 auto; }
.site-header { height: 78px; }
.brand { display: inline-flex; align-items: center; gap: .55rem; text-decoration: none; font-family: var(--display); font-size: 1.1rem; font-weight: 800; letter-spacing: -.04em; }
.brand-icon { display: grid; place-items: center; width: 1.8rem; height: 1.8rem; border-radius: 50%; background: #e7efe4; color: var(--green); font-size: 1.2rem; }
.site-header nav { display: flex; align-items: center; gap: 1.8rem; }
.site-header nav a { text-decoration: none; font-size: .9rem; font-weight: 650; }
.site-header nav a:hover, .site-footer a:hover { color: var(--green); }
.site-header nav .nav-cta { padding: .65rem 1rem; border: 1px solid #cbd9c9; border-radius: 99px; }
.site-footer { margin-top: 4rem; padding: 1.5rem 0 2rem; border-top: 1px solid #e4e9e1; color: var(--muted); font-size: .85rem; }
.button { display: inline-flex; justify-content: center; align-items: center; gap: .75rem; min-height: 3.2rem; padding: .8rem 1.25rem; border: 0; border-radius: .75rem; text-decoration: none; font-weight: 700; cursor: pointer; }
.button-primary { background: var(--green); color: #fff; }
.button-primary:hover { background: var(--green-dark); }
.button-secondary { border: 1px solid #cbd9c9; background: #fff; color: var(--ink); }
@media (max-width: 560px) { .site-header, .site-footer { width: min(100% - 2rem, 1120px); } .site-header nav { gap: .8rem; } .site-header nav a { font-size: .82rem; } .site-footer { align-items: start; flex-direction: column; gap: .7rem; } }
</style>
