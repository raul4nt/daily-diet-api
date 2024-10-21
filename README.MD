### Regras da aplicação

#### Requisitos Funcionais (RF)

- [ ] O usuário deve poder criar um novo usuário;
- [ ] O usuário deve poder registrar uma refeição com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- [ ] O usuário deve poder editar uma refeição, alterando qualquer um dos dados acima;
- [ ] O usuário deve poder apagar uma refeição;
- [ ] O usuário deve poder listar todas as refeições registradas;
- [ ] O usuário deve poder visualizar uma única refeição;
- [ ] O usuário deve poder recuperar as métricas da sua dieta, incluindo:
  - Quantidade total de refeições registradas;
  - Quantidade total de refeições dentro da dieta;
  - Quantidade total de refeições fora da dieta;
  - Melhor sequência de refeições dentro da dieta.

#### Regras de Negócio (RN)

- [ ] A refeição deve estar relacionada a um usuário;
- [ ] Deve ser possível identificar o usuário entre as requisições;
- [ ] O usuário só pode visualizar, editar e apagar as refeições que ele próprio criou.

---