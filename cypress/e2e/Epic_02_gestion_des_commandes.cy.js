/// <reference types="Cypress" />

/* ******************************************************************************** */
// Données de test
/* ******************************************************************************** */
import DATA_FIXTURES from "../fixtures/data.json";
import { faker } from "@faker-js/faker";


/* ******************************************************************************** */
// Suite de test : User Story S04 - Commande mini 10€
/* ******************************************************************************** */
describe("S04 - Commande mini 10€", () => {
  /* -------------------------------------------------------------------------------- */
  // S04 - Etapes communes à tous les cas de test
  /* -------------------------------------------------------------------------------- */
  beforeEach(() => {
    // Ici la création de compte est commune aux deux tests
    // Étape 1 : Aller sur la page de connexion
    cy.visit(DATA_FIXTURES.BASE_URL);
  });

  /* -------------------------------------------------------------------------------- */
  // S04 - Cas PASSANT : commande supérieure à 10€
  /* -------------------------------------------------------------------------------- */
  it("Cas PASSANT : commande supérieure à 10€", () => {
    // --- ETAPES ----
    // Etape 2 : aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Etape 3 : Ajouter un produit supérieur à 10 € -> 'Air Jordan 1 Low'
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_50e_plus + "{enter}");
    //si le produit est dans une liste de résultats onb choisi le bon, sinon on passe à la suite
    cy.get('body').find("a").contains(DATA_FIXTURES.test_product_50e_plus).should((_) => {}).then(($link) => {
      if($link.length) {
        cy.wrap($link).click();
      }
    });
    // Etape 4 : Cliquer sur le bouton "Ajouter au panier"
    cy.get('[name="add-to-cart"]').click();
    // Etape 5 : Aller sur la page panier
    cy.get(".added_to_cart").click();
    // Etape 6 : Cliquer sur le bouton "Proceed to checkout"
    cy.get(".checkout-button").click();
    // --- ASSERTIONS ---
    // Vérification : on est bien sur la page CHECKOUT
    cy.url().should("include", "/checkout");
  });

  /* -------------------------------------------------------------------------------- */
  // S04 - Cas NON PASSANT : commande inférieure à 10€
  /* -------------------------------------------------------------------------------- */
  it("Cas NON PASSANT : commande inférieure à 10€", () => {
    // --- ETAPES ----
    // aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit inférieure à 10 € -> 'Casquette de running'
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_10e_minus + "{enter}");
    // On choisit le bon produit dans la liste des résultats
    //si le produit est dans une liste de résultats onb choisi le bon, sinon on passe à la suite
    cy.get('body').find("a").contains(DATA_FIXTURES.test_product_10e_minus).should((_) => {}).then(($link) => {
      if($link.length) {
        cy.wrap($link).click();
      }
    });
    // Cliquer sur le bouton "Ajouter au panier"
    cy.get('[name="add-to-cart"]').click();
    // Aller sur la page panier
    cy.get(".added_to_cart").click();
    // Cliquer sur le bouton "Proceed to checkout"
    cy.get(".checkout-button").click();
    // --- ASSERTIONS ---
    // Vérification : on n'accède pas à la page CHECKOUT (on reste dans le panier CART)
    cy.url().should("include", "/cart");
  });

  /* -------------------------------------------------------------------------------- */
  // S04 - Cas PASSANT : commande égale à 10€
  /* -------------------------------------------------------------------------------- */
  it("Cas NON PASSANT : commande égale à 10€", () => {
    // --- ETAPES ----
    // aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit égale à 10 € -> 'Snapback Cap' ACTUELLEMENT EN PROMO à 5€, DEUX EXEMPLAIRES a prendre
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_10e_equal + "{enter}");
    cy.get(".ct-increase").click(); // second exemplaire
    // Cliquer sur le bouton "Ajouter au panier"
    cy.get('[name="add-to-cart"]').click();
    // Aller sur la page panier
    cy.get(".added_to_cart").click();
    // Cliquer sur le bouton "Proceed to checkout"
    cy.get(".checkout-button").click();
    // --- ASSERTIONS ---
    // Vérification : on n'accède pas à la page CHECKOUT (on reste dans le panier CART)
    cy.url().should("include", "/cart");
  });
});

/* ******************************************************************************** */
// Suite de test : User Story S05 - Commande supérieure à 50€
/* ******************************************************************************** */
describe("S05 - Commande supérieure à 50€", () => {
  /* -------------------------------------------------------------------------------- */
  // S05 - Etapes communes à tous les cas de test
  /* -------------------------------------------------------------------------------- */
  beforeEach(() => {
    // Ici la création de compte est commune aux deux tests
    // Étape 1 : Aller sur la page de connexion
    cy.visit(DATA_FIXTURES.BASE_URL);
  });

  /* -------------------------------------------------------------------------------- */
  // S05 - Cas PASSANT : commande supérieure à 50€ -> livraison gratuite
  /* -------------------------------------------------------------------------------- */
  it("Cas PASSANT : commande supérieure à 50€", () => {
    // --- ETAPES ----
    // Étape 2 : aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit supérieur à 50 € -> 'Air Jordan 1 Low'
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_50e_plus + "{enter}");
    cy.get('[name="add-to-cart"]').click();
    // Aller dans le panier
    cy.get(".added_to_cart").click();
    // Aller sur la page Checkout
    cy.get('.checkout-button').click();

    // --- ASSERTIONS ---
    // Vérifier que les frais de livraison sont gratuits
    cy.get('#shipping_method_0_free_shipping1').should('be.checked');
  });

  /* -------------------------------------------------------------------------------- */
  // S05 - Cas PASSANT : commande inférieure à 50€ -> livraison 6€95
  /* -------------------------------------------------------------------------------- */
  it("Cas PASSANT : commande inférieure à 50€", () => {
    // --- ETAPES ----
    // Étape 2 : aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit supérieur à 50 € -> 'Air Jordan 1 Low'
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_50e_minus + "{enter}");
    cy.get('[name="add-to-cart"]').click();
    // Aller dans le panier
    cy.get(".added_to_cart").click();
    // Aller sur la page Checkout
    cy.get('.checkout-button').click();

    // --- ASSERTIONS ---
    // Vérifier que les frais de livraison ne sont pas gratuits
    cy.get('#shipping_method_0_free_shipping1').should('not.exist');
    // Vérifier que les frais de livraison sont sont de 6.95€
    cy.get('label > .woocommerce-Price-amount > bdi').should('contain', '6.95');
  });

  /* -------------------------------------------------------------------------------- */
  // S05 - Cas PASSANT : commande égale à 50€ -> livraison 6€95
  /* -------------------------------------------------------------------------------- */
  it("Cas PASSANT : commande égale à 50€", () => {
    // --- ETAPES ----
    // Étape 2 : aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit supérieur à 50 € -> 'Air Jordan 1 Low'
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_50e_minus + "{enter}");
    cy.get(".ct-increase").click(); // second exemplaire
    cy.get('[name="add-to-cart"]').click();
    // Aller dans le panier
    cy.get(".added_to_cart").click();
    // Aller sur la page Checkout
    cy.get('.checkout-button').click();

    // --- ASSERTIONS ---
    // Vérifier que les frais de livraison ne sont pas gratuits
    cy.get('#shipping_method_0_free_shipping1').should('not.be.checked');
    // Vérifier que les frais de livraison sont de 6.95€
    cy.get('label > .woocommerce-Price-amount > bdi').should('contain', '6.95');
  });
});

/* ******************************************************************************** */
// Suite de test : User Story S06 - Commande qté même produit 5 max
/* ******************************************************************************** */
describe("S06 - Commande qté même produit 5 max", () => {
  /* -------------------------------------------------------------------------------- */
  // S06 - Etapes communes à tous les cas de test
  /* -------------------------------------------------------------------------------- */
  beforeEach(() => {
    // Étape 1 : Aller sur la page de connexion
    cy.visit(DATA_FIXTURES.BASE_URL);
  });

  /* -------------------------------------------------------------------------------- */
  // S06 - Cas PASSANT : Quantité produit inférieure à 5
  /* -------------------------------------------------------------------------------- */
  it("Cas PASSANT : Quantité produit inférieure à 5", () => {
    // --- ETAPES ----
    // aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit au panier (4 ex)
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_10e_equal + "{enter}"); // Nb : 1
    cy.get(".ct-increase").click(); // Nb : 2
    cy.get(".ct-increase").click(); // Nb : 3
    cy.get(".ct-increase").click(); // Nb : 4
    // --- ASSERTIONS ---
    // Le nombre d'article est inférieur ou égal à 5 (moins que 6)
    cy.get('[name="quantity"]').invoke("val").then(parseInt).should("be.lessThan", 6);
  });

  /* -------------------------------------------------------------------------------- */
  // S06 - Cas PASSANT : Quantité produit égale à 5
  /* -------------------------------------------------------------------------------- */
  it("Cas PASSANT : Quantité produit égale à 5", () => {
    // --- ETAPES ----
    // aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit au panier (4 ex)
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_10e_equal + "{enter}"); // Nb : 1
    cy.get(".ct-increase").click(); // Nb : 2
    cy.get(".ct-increase").click(); // Nb : 3
    cy.get(".ct-increase").click(); // Nb : 4
    cy.get(".ct-increase").click(); // Nb : 5
    // --- ASSERTIONS ---
    // Le nombre d'article est inférieur ou égal à 5 (moins que 6)
    cy.get('[name="quantity"]').invoke("val").then(parseInt).should("be.lessThan", 6);
  });

  /* -------------------------------------------------------------------------------- */
  // S06 - Cas NON PASSANT : Quantité produit supérieure à 5
  /* -------------------------------------------------------------------------------- */
  it("Cas NON PASSANT : Quantité produit supérieure à 5", () => {
    // --- ETAPES ----
    // aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit au panier (4 ex)
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_10e_equal + "{enter}"); // Nb : 1
    cy.get(".ct-increase").click(); // Nb : 2
    cy.get(".ct-increase").click(); // Nb : 3
    cy.get(".ct-increase").click(); // Nb : 4
    cy.get(".ct-increase").click(); // Nb : 5
    cy.get(".ct-increase").click(); // Nb : 6
    // --- ASSERTIONS ---
    // Le nombre d'article est inférieur ou égal à 5 (moins que 6)
    cy.get('[name="quantity"]').invoke("val").then(parseInt).should("be.lessThan", 6);
  });
});

/* ******************************************************************************** */
// exemple conversion valeur chaine de caractère en nombre entier
// get the element and grab its text using ".text()" jQuery method
// cy.get('#people')
//   .invoke('text')
   // tip: use an assertion to print the extracted text
//   .should('be.a', 'string')
   // convert text to integer
//   .then(parseInt)
   // tip: make sure the conversion is successful
//   .should('be.a', 'number')
   // compare the converted number to the expected value
//   .and('equal', 30)

/* ******************************************************************************** */
// Suite de test : User Story S07 - code promo "PROMO24" (DATA_FIXTURES.promo_code)
/* ******************************************************************************** */
describe('S07 - code promo "PROMO24"', () => {
  /* -------------------------------------------------------------------------------- */
  // S07 - Etapes communes à tous les cas de test
  /* -------------------------------------------------------------------------------- */
  beforeEach(() => {
    // Ici la création de compte est commune aux deux tests
    // Étape 1 : Aller sur la page de connexion
    cy.visit(DATA_FIXTURES.BASE_URL);
  });

  /* -------------------------------------------------------------------------------- */
  // S07 - Cas PASSANT : code promo "PROMO24"
  /* -------------------------------------------------------------------------------- */
  it("Cas PASSANT : code promo valide", () => {
    // --- ETAPES ----
    // aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit au panier
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_50e_plus + "{enter}");
    cy.get('[name="add-to-cart"]').click();
    // Aller sur la page PANIER
    cy.get('.added_to_cart').click();
    // Appliquer le code promo
    cy.get('[name="coupon_code"]').type(DATA_FIXTURES.promo_code);
    cy.get('[name="apply_coupon"]').click();
    // --- ASSERTIONS ---
    cy.get('.woocommerce-message').should('contain', 'Coupon code applied successfully.');
  });

  /* -------------------------------------------------------------------------------- */
  // S07 - Cas NON PASSANT : code promo INVALIDE
  /* -------------------------------------------------------------------------------- */
  it("Cas NON PASSANT : code promo INVALIDE", () => {
    // --- ETAPES ----
    // aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit au panier
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.test_product_50e_plus + "{enter}");
    cy.get('[name="add-to-cart"]').click();
    // Aller sur la page PANIER
    cy.get('.added_to_cart').click();
    // Appliquer le code promo
    cy.get('[name="coupon_code"]').type(DATA_FIXTURES.invalid_promo_code);
    cy.get('[name="apply_coupon"]').click();
    // --- ASSERTIONS ---
    cy.get('.woocommerce-error > li').should('contain', 'Coupon "' + DATA_FIXTURES.invalid_promo_code + '" does not exist!');
  });
});

/* ******************************************************************************** */
// Suite de test : User Story S08 - Prix barré sur produit en promotion
/* ******************************************************************************** */
describe("S08 - Prix barré sur produit en promotion", () => {
  /* -------------------------------------------------------------------------------- */
  // S08 - Etapes communes à tous les cas de test
  /* -------------------------------------------------------------------------------- */
  beforeEach(() => {
    // Ici la création de compte est commune aux deux tests
    // Étape 1 : Aller sur la page de connexion
    cy.visit(DATA_FIXTURES.BASE_URL);
  });

  /* -------------------------------------------------------------------------------- */
  // S08 - Cas PASSANT : prix barré sur produit en promotion
  /* -------------------------------------------------------------------------------- */
  it("Cas PASSANT : prix barré sur produit en promotion", () => {
    // --- ETAPES ----
    // aller sur la page BOUTIQUE
    cy.get('.elementor-element-2256466 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button').click();
    // Ajouter un produit inférieure à 10 € -> 'Casquette de running'
    cy.get('.ct-search-box > .ct-search-form > [name="s"]').type(DATA_FIXTURES.promo_product + "{enter}");
    // On choisit le bon produit dans la liste des résultats
    //si le produit est dans une liste de résultats onb choisi le bon, sinon on passe à la suite
    cy.get('body').find("a").contains(DATA_FIXTURES.promo_product).should((_) => {}).then(($link) => {
      if($link.length) {
        cy.wrap($link).click();
      }
    });
    // --- ASSERTIONS ---
    // Vérifier que le prix barré est supérieur à 0 dans la page boutique
    // conversion du texte en float en enlevant le caractère "€" avec sclice(1) pour enlever le premier caractère
    cy.get('.sale-price').find('del > .woocommerce-Price-amount > bdi').invoke("text").invoke('slice', 1).then(parseFloat).should('be.greaterThan', 0).then((originalPrice) => {
      // stockage du prix original pour l'utiliser dans les étapes suivantes
      cy.wrap(originalPrice).as('originalPrice');
    });
    // --- ETAPES ----
    // Ajouter le produit au panier
    cy.get('[name="add-to-cart"]').click();
    // Aller sur la page panier
    cy.get('.added_to_cart').click();
    // Vérifier que le prix barré est supérieur à 0 dans la page panier
    cy.get('@originalPrice').then((originalPrice) => {
      cy.get('.woocommerce-cart-form__cart-item > .product-name').should('contain', originalPrice)
    });
  });
});
