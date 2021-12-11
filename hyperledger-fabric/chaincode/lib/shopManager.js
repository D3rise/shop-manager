"use strict";

const { Contract } = require("fabric-contract-api");
const sortKeysRecursive = require("sort-keys-recursive");
const stringify = require("json-stringify-deterministic");

class ShopManager extends Contract {
  async InitLedger(ctx) {
    const assets = [
      { ID: "asset1", data: { str: "hello" } },
      { ID: "asset2", data: { str: "world" } },
    ];
    for (const asset of assets) {
      asset.docType = "asset";
      await ctx.stub.putState(
        asset.ID,
        Buffer.from(stringify(sortKeysRecursive(asset)))
      );
    }
  }

  async CreateAsset(ctx, id, data) {
    const exists = this.AssetExists(ctx, id);
    if (exists) throw new Error(`Asset ${id} already exists!`);

    const asset = {
      ID: id,
      data: JSON.parse(data),
    };

    await ctx.stub.putState(Buffer.from(stringify(sortKeysRecursive(asset))));
  }

  async AssetExists(ctx, id) {
    const asset = await ctx.stub.getState(id);
    return asset && asset.length > 0;
  }

  async GetAsset(ctx, id) {
    const asset = await ctx.stub.getState(id);
    if (!asset || asset.length === 0) {
      throw new Error("Asset not found!");
    }

    return asset.toString();
  }

  async GetAllAssets(ctx) {
    const allResults = [];

    const iterator = await ctx.stub.getStateByRange("", "");
    let record = await iterator.next();

    while (!record.done) {
      const recordStr = Buffer.from(record.value.value.toString()).toString(
        "utf8"
      );
      const recordJson = JSON.parse(recordStr);
      allResults.push(recordJson);

      record = await iterator.next();
    }

    return JSON.stringify(allResults);
  }
}

module.exports = ShopManager;
