import { tplTest } from "@platforma-sdk/test";

tplTest(
  'should return a concatenated string',
  async ({ helper, expect }) => {
    const results = await helper.renderWorkflow("main", false, {
      name: 'World'
    });

    const message = results.output("message", (a) => a?.getDataAsJson<string>());
    expect(await message.awaitStableValue()).eq('Hello, World!');
  }
);
