/* ******************************************************************************** */
// Données de test
/* ******************************************************************************** */
import DATA_FIXTURES from "../fixtures/data.json";

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