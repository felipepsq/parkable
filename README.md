# ParkAble

Projeto designado a aplicação no trabalho de conclusão de curso no curso de Ciências da Computação - IMED Campus Passo Fundo. Seu intuito é de ajudar pessoas com mobilidade reduzida, como deficientes e idosos, na busca por uma vaga de estacionamento na cidade de Marau (RS - Brasil), auxiliando na mobilidade urbana.

O desenvolvimento deste aplicativo teve como linguagem de programação o JavaScript, juntamente com a biblioteca React Native e suas dependências. Foi totalmente desenvolvido em ambiente Linux, rodando em cima da plataforma iOS, e com o apoio da ferramenta Open Source denominada Expo.

## Construção

O aplicativo foi especificamente construído para a plataforma iOS, tendo total compatibilidade com esse sistema. Todos os testes durante a fase de desenvolvimento foram aplicados em um smartphone Apple XR (128gb).

## Configuração de desenvolvimento

Para poder desenvolver, testar ou modificar este projeto, você precisa seguir alguns passos, citados abaixo:

* Primeiramente é necessário baixar ou clonar o repositório do projeto (https://github.com/felipepsq/parkable)
* Após ter o projeto, é preciso instalar as dependências dentro dele:
    * npm install
* Dependências instaladas, vamos rodar o projeto:
    * expo start

## Usabilidade

Todas as informações necessárias para usar o aplicativo estão contidas em uma página dentro do próprio app, na seção FAQ, acessível após o processo de autenticação, onde é exemplificado todas as funcionalidades contidas e perguntas frequentes. Também é possível acessá-las diretamente no arquivo "faq.js", disponível no diretório "/src/screens/faq.js".

## Avisos importantes

Para ter acesso a todas as funcionalidades do aplicativo, é necessário ter o backend responsável pela aplicação, que também está disponível mediante este link: https://github.com/felipepsq/parkable_server.

Devida a vasta gama de funcionalidades, esta aplicação teve seu desenvolvimento voltado a plataforma iOS, sofrendo incompatibilidades com a plataforma Android, principalmente com o uso da biblioteca react-native-maps. Em trabalhos futuros, é visado disponibilizar compatibilidade completa entre as duas plataformas.

