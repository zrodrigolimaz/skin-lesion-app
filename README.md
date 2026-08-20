# SkinLesionApp

Front-end em Angular para classificação de lesões de pele a partir de imagens. O usuário
envia uma foto pela tela de upload e o resultado da classificação é apresentado no
dashboard.

Consome a API de inferência do projeto [skin-lesion-api](https://github.com/zrodrigolimaz/skin-lesion-api).

## Stack

- Angular 19 (standalone components)
- Tailwind CSS 4
- TypeScript

## Como executar

```bash
npm install
npm start     # ng serve — http://localhost:4200
npm run build # build de produção
npm test      # testes unitários
```

## Rotas

| Rota      | Tela                                    |
| --------- | --------------------------------------- |
| `/`       | Dashboard com o resultado da análise    |
| `/upload` | Envio da imagem da lesão                |

> Projeto em desenvolvimento.
