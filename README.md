# ENEEM Site — pronto para GitHub Pages (repo normal)

Este pacote está preparado para um repositório de projeto (ex.: `username.github.io/eneem-site/`).  
Todos os caminhos são **relativos** (sem `/` inicial).

## Estrutura
```
index.html
styles/
  main.css
  components.css
  sections.css
scripts/
  app.js
  lightbox.js
assets/
  img/ (placeholders em tema azul-escuro)
  icons/ favicon.svg
privacy.html
terms.html
manifest.json
```


## Como publicar
1. Cria um repositório **público** no GitHub (ex.: `eneem-site`).
2. **Upload** de todos estes ficheiros para a raiz do repositório.
3. Vai a **Settings → Pages**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` — **Folder:** `/ (root)`
   - **Save**
4. Abre `https://o_teu_username.github.io/eneem-site/`

## Dicas
- Substitui as imagens em `assets/img/` pelas tuas (mantém os mesmos nomes para não mexer no HTML).
- Troca o texto das secções no `index.html`.
- Se quiseres vídeo no hero, adiciona `assets/video/hero.mp4` e ajusta o `<video>` (está comentado no HTML).

Boa publicação!
