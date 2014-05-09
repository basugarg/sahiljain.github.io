describe("Spinner", function(){
  it("is going to show on Document Load", function(){
    onReady();
    expect(spinnerVisible).toBe(true);
  });
});

describe("Spinner", function(){
  beforeEach(getNewsData);
  it("is going to hide on GetNewsItems is finished", function(){
    expect(spinnerVisible).toBe(false);
  });
});

