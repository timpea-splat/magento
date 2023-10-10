import { Selectors } from "@ideal-postcodes/jsutil";
import { Address } from "@ideal-postcodes/api-typings";

interface Suite {
  scope: string;
  selectors: Selectors;
  address: Address;
}

const assertions = (
  scope: JQuery<HTMLElement>,
  selectors: Selectors,
  address: Address
) => {
  cy.get(selectors.line_1).should("have.value", address.line_1);
  if (selectors.line_3 && scope.find(selectors.line_3).length > 0) {
    selectors.line_2 &&
      cy.get(selectors.line_2).should("have.value", `${address.line_2}`);
    selectors.line_3 &&
      cy.get(selectors.line_3).should("have.value", `${address.line_3}`);
  } else {
    selectors.line_2 &&
      cy
        .get(selectors.line_2)
        .should("have.value", `${address.line_2}, ${address.line_3}`);
  }

  selectors.organisation &&
    cy
      .get(selectors.organisation)
      .should("have.value", address.organisation_name);
  const town = address.post_town.toLowerCase();
  cy.get(selectors.post_town).should(
    "have.value",
    town.charAt(0).toUpperCase() + town.slice(1)
  );
  cy.get(selectors.country).should("have.value", "JE");
  cy.get(selectors.postcode).should("have.value", address.postcode);
};

export const autocompleteSuite = (suite: Suite) => {
  const scope = suite.scope;
  const selectors = suite.selectors;
  const address = suite.address;

  it("Autocomplete", () => {
    cy.get(scope).within((scope) => {
      cy.get(selectors.country).select("GB", { force: true });
      cy.wait(2000);
      cy.get(selectors.line_1)
        .clear({
          force: true,
        })
        .type(address.line_1, {
          force: true,
        });
      cy.wait(3000);
      cy.get(".idpc_ul li").first().click({ force: true });
      assertions(scope, selectors, address);
    });
  });
};

export const postcodeLookupSuite = (suite: Suite) => {
  const scope = suite.scope;
  const selectors = suite.selectors;
  const address = suite.address;

  it("Postcode Lookup", () => {
    cy.get(scope).within((scope) => {
      cy.get(selectors.country).select("GB", { force: true });
      cy.wait(1000);
      cy.get(".idpc-input")
        .clear({
          force: true,
        })
        .type(address.postcode, {
          force: true,
        });
      cy.get(".idpc-button").click({ force: true });
      cy.wait(3000);
      cy.get(".idpc-select").select("0", { force: true });
      assertions(scope, selectors, address);
    });
  });
};
