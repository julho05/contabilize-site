# Contabilize Assessoria Contábil — Site institucional

Site estático em **HTML + CSS + JavaScript puro** (sem frameworks, sem build).
Basta abrir o `index.html` ou subir a pasta inteira em qualquer hospedagem.

```
Contabilize/
├── index.html            → página única com todas as seções
├── robots.txt            → liberação para os buscadores
├── sitemap.xml           → mapa do site para o Google
├── site.webmanifest      → ícone/instalação em celular (PWA básico)
└── assets/
    ├── css/style.css     → todo o estilo, com variáveis de marca no topo
    ├── js/main.js        → menu, animações, FAQ, formulário → WhatsApp
    └── img/              → logotipos, favicon e imagem de compartilhamento
```

---

## ✅ Checklist antes de publicar

### Já preenchido com os dados reais

| Dado | Valor |
|---|---|
| Telefone / WhatsApp | **(79) 99878-2595** (`5579998782595` nos links `wa.me`) |
| Endereço | **Av. Rinaldo Mota Santos, 1160 — 1º Andar, Marianga, Itabaiana/SE, 49504-000** |
| Instagram | [@contabilize.se](https://www.instagram.com/contabilize.se/) |

### Ainda pendente — trocar antes de publicar

| O que trocar | Onde | Valor atual (placeholder) |
|---|---|---|
| E-mail | `index.html` (contato, rodapé, JSON-LD) | `contato@contabilizeassessoria.com.br` |
| CNPJ e CRC | rodapé do `index.html` | `00.000.000/0001-00` / `CRC/SE 0-000000` |
| Coordenadas do mapa | JSON-LD, campo `geo` | centro de Itabaiana (`-10.6853, -37.4256`) — refinar com o pino exato do Google Maps |
| Domínio | `index.html` (canonical, Open Graph, JSON-LD), `robots.txt`, `sitemap.xml` | `https://www.contabilizeassessoria.com.br/` |
| Números da faixa de estatísticas | `index.html`, atributos `data-target` | 320 empresas, 12 anos, 98% |
| Depoimentos | seção `#depoimentos` | 3 depoimentos fictícios |
| Horário de atendimento | `index.html` e JSON-LD | Seg–sex, 8h30–18h |

> **Importante:** os depoimentos e os números são exemplos para a apresentação.
> Publicar dados não verificados pode gerar problema com o CFC/Procon — troque por casos reais
> (de preferência com autorização do cliente) antes de colocar no ar.

**Imagem de compartilhamento:** o arquivo `assets/img/og-image.svg` é o layout pronto do card que
aparece no WhatsApp/Facebook/LinkedIn. Redes sociais **não leem SVG** — exporte-o como
`assets/img/og-image.jpg` (1200×630 px) antes de publicar. Qualquer editor (Figma, Canva, Photoshop)
ou o comando `magick og-image.svg og-image.jpg` do ImageMagick resolve.

**Logotipo:** os arquivos em `assets/img/` são uma reconstrução vetorial baseada na arte enviada.
Se a empresa tiver o logo original em SVG/PNG de alta resolução, basta substituir os arquivos
mantendo os mesmos nomes.

---

## 🔍 O que já está feito de SEO

- HTML semântico (`header`, `main`, `section`, `article`, `footer`), um único `<h1>`, hierarquia correta de `h2`/`h3`
- `title` e `meta description` otimizados para as buscas comerciais do setor
- `canonical`, `robots`, `lang="pt-BR"`, Open Graph e Twitter Card completos
- **Dados estruturados JSON-LD**: `AccountingService` + `LocalBusiness` (endereço, horário, telefone, catálogo de serviços), `WebSite` e `FAQPage`
  — a `FAQPage` é o que habilita o site a aparecer com perguntas expandidas no resultado do Google
- `sitemap.xml` e `robots.txt` prontos para o Search Console
- Textos escritos em torno das buscas reais do público: *abrir empresa*, *trocar de contador*,
  *planejamento tributário*, *contabilidade para MEI*, *folha de pagamento*
- Performance: zero bibliotecas externas, CSS e JS próprios (~40 KB no total), fontes com `preconnect`,
  SVGs inline, animações respeitando `prefers-reduced-motion`
- Acessibilidade: contraste alto, foco visível, `aria-expanded` no menu e no FAQ, `alt` em todas as imagens,
  link "pular para o conteúdo"

### Próximos passos recomendados (pós-lançamento)
1. Cadastrar o site no **Google Search Console** e enviar o `sitemap.xml`.
2. Criar/reivindicar o **Perfil da Empresa no Google** (Google Meu Negócio) com exatamente o mesmo
   NAP usado no site — *Contabilize Assessoria Contábil · Av. Rinaldo Mota Santos, 1160, 1º Andar,
   Marianga, Itabaiana/SE, 49504-000 · (79) 99878-2595*. Qualquer divergência de grafia entre o site
   e o perfil enfraquece o ranqueamento local, que é o canal nº 1 para "contador em Itabaiana".
3. Adicionar o **Google Analytics 4** e o **Meta Pixel** (se houver campanhas).
4. Criar um **blog** (`/blog/`) com 2 posts por mês respondendo dúvidas fiscais — é o caminho mais
   barato para ranquear em cauda longa ("como abrir MEI em [cidade]", "MEI ultrapassou o limite, e agora?").
5. Trocar a `FAQPage` por perguntas que os clientes realmente fazem no WhatsApp.

---

## ✉️ Formulário

Hoje o formulário do topo **monta a mensagem e abre o WhatsApp** com os dados preenchidos —
não exige servidor e tem a maior taxa de resposta para esse tipo de negócio.

Para receber os leads também por e-mail, as opções mais simples são:

- **Formspree** (grátis até 50/mês): trocar o `<form>` por `<form action="https://formspree.io/f/SEU_ID" method="POST">` e remover o `e.preventDefault()` do `main.js`
- **EmailJS**: envio direto do navegador, sem backend
- **PHP próprio** na hospedagem: um `enviar.php` com `mail()`

---

## 🚀 Publicação

Qualquer hospedagem estática serve — é só enviar a pasta:

- **Hostinger / cPanel**: subir o conteúdo para `public_html/`
- **Netlify / Vercel / Cloudflare Pages**: arrastar a pasta (deploy em segundos, HTTPS grátis)
- **GitHub Pages**: commit no repositório e ativar Pages

Após publicar, force HTTPS e configure o redirecionamento de `contabilize.com.br` para
`www.contabilize.com.br` (ou o contrário) para não dividir a autoridade do domínio no Google.
