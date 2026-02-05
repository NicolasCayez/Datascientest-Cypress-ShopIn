/// <reference types="Cypress" />

/* ******************************************************************************** */
// Données de test
/* ******************************************************************************** */
//cy.fixture("data.json").then((datafixtures) => {}); // Si dans chaque describe on veut utiliser des données différentes
import DATA_FIXTURES from "../fixtures/data.json";
import { faker } from "@faker-js/faker";


/* ******************************************************************************** */
// Suite de test : User Story S01 - Création de compte
/* ******************************************************************************** */
describe("S01 - Création de compte", () => {
  /* -------------------------------------------------------------------------------- */
  // S01 - Etapes communes à tous les cas de test
  /* -------------------------------------------------------------------------------- */
  beforeEach(() => {
    // Ici la création de compte est commune aux deux tests
    // Étape 1 : Aller sur la page de connexion
    cy.visit(DATA_FIXTURES.BASE_URL);
    // Étape 2 : cliquer sur le bouton "Mon compte"
    cy.get(".ct-account-item").click();
    // Étape 3 : Remplir le formulaire de création de compte avec des informations valides
    cy.get(
      '.u-column2 > .woocommerce-form > :nth-child(1) > [name="username"]',
    ).type(DATA_FIXTURES.username);
    cy.get('[name="email"]').type(DATA_FIXTURES.email);
    cy.get(':nth-child(3) > .password-input > [name="password"]').type(DATA_FIXTURES.password);
    // Étape 4 : Soumettre le formulaire de création de compte
    cy.get('[name="register"]').click();
  });

  /* -------------------------------------------------------------------------------- */
  // S01 - Cas PASSANT : email valide, username valide et password valide
  /* -------------------------------------------------------------------------------- */
  it("Cas PASSANT : email valide, username valide et password valide", () => {
    // --- ASSERTIONS ---
    // Vérification : S'assurer que l'utilisateur est redirigé vers la page "Mon compte"
    cy.get(".woocommerce-MyAccount-content > :nth-child(2)").should(
      "contain",
      "Hello " + DATA_FIXTURES.username + " (not " + DATA_FIXTURES.username + "? Log out)",
    );
  });

  /* -------------------------------------------------------------------------------- */
  // S01 - Cas NON PASSANT : email déjà utilisé
  /* -------------------------------------------------------------------------------- */
  it.only("Cas NON PASSANT : email déjà utilisé", () => {
    // --- ASSERTIONS ---
    // Vérification : S'assurer que l'utilisateur est redirigé vers la page "Mon compte"
    cy.get(".woocommerce-error > li").should(
      "contain",
      "An account is already registered with your email address.",
    );
  });
});

/* ******************************************************************************** */
// Suite de test : User Story S02 - Connexion avec un compte existant
/* ******************************************************************************** */
describe("S02 - Connexion avec un compte existant", () => {
  /* -------------------------------------------------------------------------------- */
  // S02 - Etapes communes à tous les cas de test
  /* -------------------------------------------------------------------------------- */
  beforeEach(() => {
    //? Code à exécuter avant chaque test, si nécessaire
    // Étape 1 : Aller sur la page de connexion
    cy.visit(DATA_FIXTURES.BASE_URL + "/mon-compte/"); // equivalent cy.visit('http://shop-in.ovh/mon-compte/');
  });

  /* -------------------------------------------------------------------------------- */
  // S02 - Cas PASSANT : email valide et password valide
  /* -------------------------------------------------------------------------------- */
  it.only("Cas PASSANT : email valide et password valide", () => {
    // --- ETAPES ----
    // Étape 2 : Remplir le formulaire de connexion avec des informations valides
    cy.get(
      '.u-column1 > .woocommerce-form > :nth-child(1) > [name="username"]',
    ).type(DATA_FIXTURES.email);
    cy.get(':nth-child(2) > .password-input > [name="password"]').type(
      DATA_FIXTURES.password,
    );
    // Étape 3 : Soumettre le formulaire de connexion
    cy.get('[name="login"]').click();
    // --- ASSERTIONS ---
    // Vérification : S'assurer que l'utilisateur est redirigé vers la page "Mon compte"
    cy.url().should("include", "/mon-compte/");
    // Vérification : S'assurer que le message de bienvenue est affiché "EER"
    cy.get(".woocommerce-MyAccount-content > :nth-child(3)").should(
      "contain",
      "Bonjour " + DATA_FIXTURES.username + " heureux de vous retrouver ! N’hésitez pas à regarder nos nouveautés, il y en a pour tous les gouts ",
    );
  });

  /* -------------------------------------------------------------------------------- */
  // S02 - Cas NON PASSANT : email INVALIDE et password valide
  /* -------------------------------------------------------------------------------- */
  it("Cas NON PASSANT : email INVALIDE et password valide", () => {
    // --- ETAPES ----
    // Étape 2 : Remplir le formulaire de connexion avec des informations valides
    cy.get(
      '.u-column1 > .woocommerce-form > :nth-child(1) > [name="username"]',
    ).type(DATA_FIXTURES.invalid_email);
    cy.get(':nth-child(2) > .password-input > [name="password"]').type(
      DATA_FIXTURES.password,
    );
    // Étape 3 : Soumettre le formulaire de connexion
    cy.get('[name="login"]').click();
    // --- ASSERTIONS ---
    // Vérification : S'assurer que l'utilisateur est redirigé vers la page "Mon compte"
    cy.url().should("include", "/mon-compte/");
    // Vérification : S'assurer que le message d'erreur est affiché
    cy.get(".woocommerce-error > li").should(
      "contain",
      "Adresse e-mail inconnue. Vérifiez l’orthographe ou essayez avec votre identifiant.",
    );
  });

  /* -------------------------------------------------------------------------------- */
  // S02 - Cas NON PASSANT : email valide et password INVALIDE
  /* -------------------------------------------------------------------------------- */
  it("Cas NON PASSANT : email valide et password INVALIDE", () => {
    // --- ETAPES ----
    // Étape 2 : Remplir le formulaire de connexion avec des informations valides
    cy.get(
      '.u-column1 > .woocommerce-form > :nth-child(1) > [name="username"]',
    ).type(DATA_FIXTURES.email);
    cy.get(':nth-child(2) > .password-input > [name="password"]').type(
      DATA_FIXTURES.invalid_password,
    );
    // Étape 3 : Soumettre le formulaire de connexion
    cy.get('[name="login"]').click();
    // --- ASSERTIONS ---
    // Vérification : S'assurer que l'utilisateur est redirigé vers la page "Mon compte"
    cy.url().should("include", "/mon-compte/");
    // Vérification : S'assurer que le message d'erreur est affiché
    cy.get(".woocommerce-error > li").should(
      "contain",
      "le mot de passe que vous avez saisi pour l’adresse e-mail " + DATA_FIXTURES.email + " est incorrect.",
    );
  });

  /* -------------------------------------------------------------------------------- */
  // S02 - Cas de test NON PASSANT : email INVALIDE et password INVALIDE
  /* -------------------------------------------------------------------------------- */
  it("Connexion cas non passant : email INVALIDE et password INVALIDE", () => {
    // --- ETAPES ----
    // Étape 2 : Remplir le formulaire de connexion avec des informations valides
    cy.get(
      '.u-column1 > .woocommerce-form > :nth-child(1) > [name="username"]',
    ).type(DATA_FIXTURES.invalid_email);
    cy.get(':nth-child(2) > .password-input > [name="password"]').type(
      DATA_FIXTURES.invalid_password,
    );
    // Étape 3 : Soumettre le formulaire de connexion
    cy.get('[name="login"]').click();
    // --- ASSERTIONS ---
    // Vérification : S'assurer que l'utilisateur est redirigé vers la page "Mon compte"
    cy.url().should("include", "/mon-compte/");
    // Vérification : S'assurer que le message d'erreur est affiché
    cy.get(".woocommerce-error > li").should(
      "contain",
      "Adresse e-mail inconnue. Vérifiez l’orthographe ou essayez avec votre identifiant.",
    );
  });
});

/* ******************************************************************************** */
// Suite de test : User Story S03 - Mot de passe oublié
/* ******************************************************************************** */
// début de la suite test Mot de passe oublié
describe("S03 - Mot de passe oublié", () => {
  /* -------------------------------------------------------------------------------- */
  // S03 - Etapes communes à tous les cas de test
  /* -------------------------------------------------------------------------------- */
  beforeEach(() => {
    // Code à exécuter avant chaque test, si nécessaire
    // Étape 1 : Aller sur la page de connexion
    cy.visit(DATA_FIXTURES.BASE_URL + "/mon-compte/"); //  equivalent cy.visit('http://shop-in.ovh/mon-compte/');
  });

  /* -------------------------------------------------------------------------------- */
  // S03 - Cas PASSANT
  /* -------------------------------------------------------------------------------- */
  it("Cas PASSANT", () => {
    // --- ETAPES ----
    // Etape 2 : Cliquer sur le lien de demande de réinitialisation de mot de passe
    cy.get(".woocommerce-LostPassword > a").click();
    // Etape 3 : Remplir le formulaire de réinitialisation de mot de passe avec un email valide
    cy.get('[name="user_login"]').type(DATA_FIXTURES.email);
    // Etape 4 : Soumettre le formulaire de réinitialisation de mot de passe
    cy.get(".woocommerce-Button").click();
    // --- ASSERTIONS ---
    //vérifier les message affiché
    cy.get(".woocommerce-message").should(
      "contain",
      "Password reset email has been sent.",
    );
  });
});
