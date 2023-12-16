import { createNewEmail, createNewName } from "../support/utils";

let newName, newEmail;
let idUsuario;

describe('CRUD de Usuário spec', () => {
  it('Cadastrar Usuário', () => {
    newName = createNewName();
    newEmail = createNewEmail();

    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: newName,
        email: newEmail,
        password: "123456",
        administrador: "true"
      },
    }).then((resp) => {
      idUsuario = resp.body._id;
      expect(resp.status).to.eq(201);
      expect(resp.body).to.have.property('message', 'Cadastro realizado com sucesso');
      expect(resp.body).to.have.property('_id');
    })
  })

  it('Buscar usuário por ID e verificar se ele está cadastrado', () => {
    cy.request({
      method: 'GET',
      url: `/usuarios/${idUsuario}`,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.nome).to.equal(newName);
      expect(resp.body.email).to.equal(newEmail);
      expect(resp.body._id).to.equal(idUsuario);
    })
  })

  it('Atualizar Usuário por ID', () => {
    cy.request({
      method: 'PUT',
      url: `/usuarios/${idUsuario}`,
      body: {
        nome: newName+"Updated",
        email: newEmail,
        password: "987654",
        administrador: "false"
      }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('message', 'Registro alterado com sucesso');
    })
  })

  it('Buscar usuário e verificar se ele foi atualizado', () => {
    cy.request({
      method: 'GET',
      url: `/usuarios/${idUsuario}`,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.nome).to.equal(newName+"Updated");
      expect(resp.body.email).to.equal(newEmail);
      expect(resp.body.password).to.equal("987654");
      expect(resp.body.administrador).to.equal("false");
    })
  })
  
  it('Buscar usuário e verificar se ele foi atualizado', () => {
    cy.request({
      method: 'DELETE',
      url: `/usuarios/${idUsuario}`,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('message', 'Registro excluído com sucesso');
    })
  })

  it('Buscar usuário e verificar que ele não está mais cadastrado', () => {
    cy.request({
      method: 'GET',
      url: `/usuarios/${idUsuario}`,
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(400);
      expect(resp.body).to.have.property('message', 'Usuário não encontrado');
    })
  })

})