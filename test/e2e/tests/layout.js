describe("EditorLayout", () => {
  describe("file uploads", () => {
    beforeEach(() => {
      cy.visit("/?url=/documents/petstore.swagger.yaml", {
        onBeforeLoad (win) {
          cy.stub(win, "alert").as("alert")
        }
      })
    })

    describe("given one or more files are of an unexpected type", () => {
      it("should alert the user that their file(s) were rejected", () => {
        cy.get(".info", { timeout: 10000 }).should("be.visible")
        cy.get("[data-cy=\"dropzone\"]")
          .attachFile("rejected.file.1", { subjectType: "input" })
          .attachFile(["rejected.file.1", "rejected.file.2"], { subjectType: "input" })
          .then(() => {
            cy.get("@alert")
              .should("have.been.calledTwice")
              .and("have.been.calledWith", "Sorry, there was an error processing your file.\nPlease drag and drop exactly one .yaml or .json OpenAPI definition file.")
          })
      })
    })

    describe("when more than one file of an expected type is dropped", () => {
      it("should alert the user that their file(s) were rejected", () => {
        cy.get(".info", { timeout: 10000 }).should("be.visible")
        cy.get("[data-cy=\"dropzone\"]")
          .attachFile(["rejected.file.1", "rejected.file.2"], { subjectType: "input" })
          .then(() => {
            cy.get("@alert")
              .should("have.been.calledOnce")
              .and("have.been.calledWith", "Sorry, there was an error processing your file.\nPlease drag and drop exactly one .yaml or .json OpenAPI definition file.")
          })
      })
    })

    describe("when one file of an expected type is dropped", () => {
      it("should update the editor content and the SwaggerUI", () => {
        /**
         * subjectType: 'drag-n-drop' doesn't work correctly as it generates
         * `dragleave` and then `dragenter` events (in that order), which manifests in always
         * seeing the dropzone overlay. The goal of this test is to see when the
         * file is uploaded that the editor content and rendered UI changes and
         * this goal is satisfied.
         */

        cy.get(".info", { timeout: 10000 }).should("be.visible")
        cy.get("[data-cy=\"dropzone\"]").attachFile("petstore.openapi.yaml", { subjectType: "input" })
        cy.get(".info .title .version-stamp .version").should("have.text", "OAS3")
      })
    })
  })
})
