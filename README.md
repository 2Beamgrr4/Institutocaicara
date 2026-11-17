# Instituto Raiz Caiçara — site e experiência do baú

Site institucional responsivo com uma experiência interativa de baú, seções de apresentação, referências culturais e formulários que preparam uma mensagem no aplicativo de e-mail. O projeto é estático e não armazena dados.

## Abrir no computador

1. Instale o Node.js (versão LTS) em [nodejs.org](https://nodejs.org/).
2. Abra esta pasta no PowerShell ou Terminal.
3. Execute `npm install` uma vez para instalar as dependências.
4. Execute `npm run dev`.
5. Abra o endereço local mostrado no terminal, normalmente `http://localhost:5173/`.

Na seção **Box**, clique no fecho do baú para abrir a experiência 3D. Se o navegador não puder usar WebGL, uma imagem do baú continua disponível e o conteúdo pode ser acessado pela lista acessível. As ilustrações em aquarela aparecem como detalhes do cenário e da página.

Também é possível clicar duas vezes em **Abrir Box Digital.bat** depois de instalar as dependências. Se iniciar por esse arquivo, o endereço será `http://localhost:5176/`. Para abrir em outro aparelho conectado à mesma rede Wi-Fi, use o endereço `Network` mostrado no terminal. Mantenha a janela preta aberta enquanto estiver usando o site; feche-a para encerrar o servidor.

## Publicar gratuitamente com GitHub Pages

O Git é o controle de versões; o GitHub guarda o repositório online e o GitHub Pages hospeda os arquivos estáticos do site. Este projeto já inclui um fluxo automático em `.github/workflows/deploy.yml`.

1. Crie uma conta em [github.com](https://github.com/) e instale o [GitHub Desktop](https://desktop.github.com/).
2. No GitHub Desktop, entre na sua conta e use **File → Add local repository** para selecionar esta pasta. Se aparecer **Create a repository**, escolha essa opção e dê o nome `box-digital-raiz-caicara`.
3. Faça o primeiro commit (por exemplo, `Primeira versão do Box Digital`) e escolha **Publish repository**. Mantenha-o público para usar o Pages no plano gratuito.
4. No site do GitHub, abra o repositório e vá a **Settings → Pages**. Em **Build and deployment → Source**, escolha **GitHub Actions**.
5. Abra a aba **Actions** e aguarde o fluxo “Publicar site no GitHub Pages” ficar verde. O endereço aparecerá no resumo da execução e em **Settings → Pages**; costuma seguir o formato `https://SEU-USUARIO.github.io/box-digital-raiz-caicara/`.
6. Para atualizar o site depois, salve as mudanças, faça um novo commit e clique **Push origin** no GitHub Desktop. A publicação será refeita automaticamente.

O endereço público só é criado depois de publicar o repositório e concluir a primeira execução do fluxo. O GitHub Pages publica arquivos estáticos; o site não usa servidor nem banco de dados. Os formulários abrem uma mensagem no aplicativo de e-mail, que você revisa e envia; o site não armazena os dados.
## Acessibilidade e dispositivos

A página inclui atalhos de teclado para conteúdo, menu, busca e rodapé; foco visível; ajuste de tamanho do texto; opção de alto contraste; uma lista alternativa para acessar os itens do baú; alvos de toque ampliados; tradução em Libras pelo VLibras; e respeito à preferência por movimento reduzido. O mapa mantém uma ilustração local e botões de estado quando o serviço externo do IBGE não estiver disponível. O layout se adapta a telas de computador, tablet e celular, e os campos de formulário evitam a ampliação automática em iPhones.

As escolhas seguem práticas relacionadas ao [eMAG, padrão de acessibilidade do Governo Federal](https://emag.governoeletronico.gov.br/) e à [WCAG 2.2 do W3C](https://www.w3.org/TR/WCAG22/). Esta etapa não equivale a uma auditoria ou certificação formal de conformidade.

## Imagens

A logomarca enviada para o projeto aparece no cabeçalho e no rodapé. A nova ilustração colorida da capa foi gerada com IA e identificada na própria página. Os créditos e links das fotografias usadas em seções e fichas regionais estão em [`assets/CREDITOS-VISUAIS.md`](assets/CREDITOS-VISUAIS.md) e junto às imagens.
