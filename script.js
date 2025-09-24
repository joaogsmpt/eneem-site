// Conteúdos fáceis de editar (mantidos da v1)
const EDICOES = Array.from({ length: 9 }, (_, i) => ({
  numero: i + 1,
  descricao: `Momentos marcantes da edição ${i + 1}.`,
  imagem: i % 2 === 0
    ? "https://images.unsplash.com/photo-1596783074918-c84cb06531ac?q=80&w=1200&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1558346648-975935a6e0a6?q=80&w=1200&auto=format&fit=crop",
}));

const PROGRAMA = {
  "Dia 1": [
    { hora: "09:00", titulo: "Credenciação & Welcome Coffee", local: "Átrio Central" },
    { hora: "10:00", titulo: "Sessão de Abertura — 10ª Edição", local: "Auditório Principal" },
    { hora: "11:00", titulo: "Keynote: Inovação na Indústria 4.0", local: "Auditório Principal" },
    { hora: "12:30", titulo: "Almoço Livre", local: "—" },
    { hora: "14:00", titulo: "Painel: Energia & Sustentabilidade", local: "Sala 1" },
    { hora: "16:00", titulo: "Workshops paralelos (CAD/CAE, Materiais)", local: "Labs A/B" },
    { hora: "18:00", titulo: "Networking com Empresas", local: "Área de Exposição" },
  ],
  "Dia 2": [
    { hora: "09:30", titulo: "Visitas Técnicas (grupo 1)", local: "Ponto de Encontro" },
    { hora: "10:00", titulo: "Talk: Robótica Colaborativa", local: "Sala 2" },
    { hora: "11:30", titulo: "Mesa Redonda: Carreiras em Mecânica", local: "Auditório" },
    { hora: "12:30", titulo: "Almoço Livre", local: "—" },
    { hora: "14:00", titulo: "Competição: Desafio de Design", local: "Pavilhão" },
    { hora: "17:30", titulo: "Cerimónia de Encerramento", local: "Auditório" },
  ],
};

const PARCEIROS = ["Empresa A","Empresa B","Empresa C","Empresa D","Empresa E","Empresa F","Empresa G","Empresa H","Empresa I","Empresa J","Empresa K","Empresa L"];

// Navbar móvel
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
menuBtn.addEventListener('click', () => {
  mainNav.classList.toggle('show');
});
// Fechar menu ao clicar num link (mobile)
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('show');
}));

// Header sombra ao rolar + scroll spy de navegação
const header = document.querySelector('.site-header');
const navLinks = Array.from(mainNav.querySelectorAll('a'));
const sectionIds = ['#inicio', '#historia', '#programa', '#parceiros', '#contactos'];

function setActiveLink() {
  const pos = window.scrollY + header.offsetHeight + 24; // compensar cabeçalho
  let current = sectionIds[0];
  sectionIds.forEach(id => {
    const el = document.querySelector(id);
    if (el && el.offsetTop <= pos) current = id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === current);
  });
}
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 8);
  setActiveLink();
}
window.addEventListener('scroll', onScroll);
window.addEventListener('resize', setActiveLink);
window.addEventListener('load', () => { setActiveLink(); onScroll(); });

// Timeline dinâmica
const timeline = document.getElementById('timeline');
if (timeline){
  EDICOES.forEach((e) => {
    const li = document.createElement('div');
    li.className = 'tl-item';
    li.innerHTML = `
      <div class="tl-thumb"><img src="${e.imagem}" alt="Edição ${e.numero}"></div>
      <div class="tl-body">
        <div class="tl-chip">• Edição ${e.numero}</div>
        <div class="tl-desc">${e.descricao}</div>
      </div>`;
    timeline.appendChild(li);
  });
  const highlight = document.createElement('div');
  highlight.className = 'tl-item tl-10';
  highlight.innerHTML = `
    <div class="tl-thumb"><img src="https://images.unsplash.com/photo-1581090468348-8423fc0d7a9a?q=80&w=1600&auto=format&fit=crop" alt="Engenharia mecânica"></div>
    <div class="tl-body">
      <div class="tl-chip">★ 10ª Edição</div>
      <div class="tl-desc">Celebração especial em Coimbra: mais conteúdos, mais empresas, mais oportunidades.</div>
    </div>`;
  timeline.appendChild(highlight);
}

// Programa (tabs + tabela)
const tabs = document.querySelectorAll('.tab');
const tabela = document.querySelector('#tabelaPrograma tbody');
function renderTabela(dia){
  if (!tabela) return;
  tabela.innerHTML = '';
  (PROGRAMA[dia] || []).forEach((a) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${a.hora}</td><td>${a.titulo}</td><td>${a.local}</td>`;
    tabela.appendChild(tr);
  });
}
renderTabela('Dia 1');
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTabela(btn.dataset.dia);
  });
});

// Logos parceiros
const logosDiv = document.getElementById('logos');
if (logosDiv){
  PARCEIROS.forEach((nome) => {
    const card = document.createElement('div');
    card.className = 'logo';
    card.title = nome;
    card.innerHTML = `<img src="https://placehold.co/300x200?text=${encodeURIComponent(nome)}" alt="Logótipo ${nome}" loading="lazy">`;
    logosDiv.appendChild(card);
  });
}

// Contacto (formulário ilustrativo)
const form = document.getElementById('contactForm');
if (form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensagem enviada! (exemplo)');
    form.reset();
  });
}

// Ano no footer
const yearEl = document.getElementById('year');
if (yearEl){ yearEl.textContent = new Date().getFullYear(); }
