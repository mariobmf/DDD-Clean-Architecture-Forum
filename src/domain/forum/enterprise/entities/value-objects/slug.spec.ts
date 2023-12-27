import { Slug } from "./slug";

describe("Slug value object", () => {
  it("Should be able to create a new slug from text", () => {
    const slug = Slug.createFromText("Exemplo de slug");

    expect(slug.value).toEqual("exemplo-de-slug");
  });
});
