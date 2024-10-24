### Regras da aplicação

#### Requisitos Funcionais (RF)

- [x] Deve ser possível criar um novo usuário;
- [x] O usuário deve poder registrar uma refeição com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- [x] O usuário deve poder editar uma refeição, alterando qualquer um dos dados acima;
- [x] O usuário deve poder apagar uma refeição;
- [x] O usuário deve poder listar todas as refeições registradas;
- [x] O usuário deve poder visualizar uma única refeição;
- [x] O usuário deve poder recuperar as métricas da sua dieta, incluindo:
  - Quantidade total de refeições registradas;
  - Quantidade total de refeições dentro da dieta;
  - Quantidade total de refeições fora da dieta;
  - Melhor sequência de refeições dentro da dieta.

#### Regras de Negócio (RN)

- [x] A refeição deve estar relacionada a um usuário;
- [x] Deve ser possível identificar o usuário entre as requisições;
- [x] O usuário só pode visualizar, editar e apagar as refeições que ele próprio criou.

---