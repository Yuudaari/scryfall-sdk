/// <reference types="mocha" />

import * as chai from "chai";
import { Stream } from "stream";
import { BulkDataDefinition } from "../api/BulkData";
/*
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
*/
import * as Scry from "../Scry";
import MagicQuerier from "../util/MagicQuerier";
const expect = chai.expect;


describe("Scry", function () {
	this.timeout(10000);

	describe("Cards", () => {
		it("by id", async () => {
			const card = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(card.name).eq("Blood Scrivener");
			expect(Scry.error()).eq(undefined);
		});

		describe("by name,", () => {
			it("exact", async () => {
				const card = await Scry.Cards.byName("Blood Scrivener");
				expect(card.name).eq("Blood Scrivener");
				expect(Scry.error()).eq(undefined);
			});

			it("fuzzy", async () => {
				const card = await Scry.Cards.byName("Bliid Scrivener", true);
				expect(card.name).eq("Blood Scrivener");
				expect(Scry.error()).eq(undefined);
			});

			it("with set filter", async () => {
				const card = await Scry.Cards.byName("Loxodon Warhammer", "MRD");
				expect(card.name).eq("Loxodon Warhammer");
				expect(card.set).eq("mrd");
				expect(Scry.error()).eq(undefined);
			});

			it("fuzzy with set filter", async () => {
				const card = await Scry.Cards.byName("Warhammer", "MRD", true);
				expect(card.name).eq("Loxodon Warhammer");
				expect(card.set).eq("mrd");
				expect(Scry.error()).eq(undefined);
			});
		});

		it("by set", async () => {
			const card = await Scry.Cards.bySet("dgm", 22);
			expect(card.name).eq("Blood Scrivener");
			expect(Scry.error()).eq(undefined);
		});

		it("by multiverse id", async () => {
			const card = await Scry.Cards.byMultiverseId(369030);
			expect(card.name).eq("Blood Scrivener");
			expect(Scry.error()).eq(undefined);
		});

		it("by mtgo id", async () => {
			const card = await Scry.Cards.byMtgoId(48338);
			expect(card.name).eq("Blood Scrivener");
			expect(Scry.error()).eq(undefined);
		});

		it("by arena id", async () => {
			const card = await Scry.Cards.byArenaId(67330);
			expect(card.name).eq("Yargle, Glutton of Urborg");
			expect(Scry.error()).eq(undefined);
		});

		it("by tcg player id", async () => {
			const card = await Scry.Cards.byTcgPlayerId(1030);
			expect(card.name).eq("Ankh of Mishra");
			expect(Scry.error()).eq(undefined);
		});

		it("in lang", async () => {
			const card = await Scry.Cards.bySet("dom", 1, "ja");
			expect(card.printed_name).eq("ウルザの後継、カーン");
			expect(Scry.error()).eq(undefined);
		});

		it("search", async () => {
			const results: Scry.Card[] = [];
			for await (const card of Scry.Cards.search("type:planeswalker").all()) {
				if (card.layout !== "normal") {
					return;
				}

				results.push(card);

				expect(card.type_line)
					.satisfies((type: string) => type.startsWith("Legendary Planeswalker") || type.startsWith("Planeswalker"));
				expect(Scry.error()).eq(undefined);
			}

			expect(results.length).gte(97);
			expect(Scry.error()).eq(undefined);
		});

		it("search waitForAll", async () => {
			const matches = await Scry.Cards.search("!smoker").waitForAll();
			expect(matches.length).eq(0);
			expect(Scry.error()).not.eq(undefined);
		});

		it("search by set", async () => new Promise<void>((resolve, reject) => {
			const results: Scry.Card[] = [];
			Scry.Cards.search("s:kld", { order: "cmc" }).on("data", card => {
				try {
					if (results.length) {
						expect(card.cmc).gte(results[results.length - 1].cmc);
						expect(Scry.error()).eq(undefined);
					}

					results.push(card);
					expect(card.set).satisfies((set: string) => set == "kld");
					expect(Scry.error()).eq(undefined);
					resolve();
				} catch (err) {
					reject(err);
				}
			}).on("end", () => {
				try {
					expect(results.length).eq(264);
					expect(Scry.error()).eq(undefined);
					resolve();
				} catch (err) {
					reject(err);
				}
			}).on("error", reject);
		}))
			.timeout(20000);

		it("search type:creature (cancel after 427 cards)", async () => {
			return new Promise((resolve, reject) => {
				let needCount = 427;
				const emitter = Scry.Cards.search("type:creature");
				emitter.on("data", () => {
					needCount--;
					if (needCount == 0) {
						emitter.cancel();
					}

				}).on("end", () => {
					reject(new Error("Did not expect to reach this point"));
				}).on("cancel", () => {
					expect(needCount).eq(0);
					expect(Scry.error()).eq(undefined);
					resolve();
				}).on("error", reject);
			});
		}).timeout(15000);

		it("should support pagination of searches", async () => {
			let firstPageCard: Scry.Card;
			let secondPageCard: Scry.Card;

			await Promise.all([
				new Promise((resolve, reject) => {
					const emitter = Scry.Cards.search("type:creature");
					emitter.on("data", card => (firstPageCard = card, emitter.cancel()))
						.on("end", () => reject(new Error("Did not expect to reach this point")))
						.on("cancel", resolve)
						.on("error", reject);
				}),
				new Promise((resolve, reject) => {
					const emitter = Scry.Cards.search("type:creature", 2).cancelAfterPage();
					emitter.on("data", card => secondPageCard = card)
						.on("end", () => reject(new Error("Did not expect to reach this point")))
						.on("cancel", resolve)
						.on("error", reject);
				}),
			]);

			expect(firstPageCard!.id).not.eq(secondPageCard!.id);
			expect(Scry.error()).eq(undefined);
		}).timeout(15000);

		it("random", async () => {
			const card = await Scry.Cards.random();
			expect(card).not.eq(undefined);
			expect(Scry.error()).eq(undefined);
		});

		it("autocomplete name", async () => {
			const cardNames = await Scry.Cards.autoCompleteName("bloodsc");
			expect(cardNames).include("Blood Scrivener");
			expect(Scry.error()).eq(undefined);
		});

		it("should return an empty array on an invalid search", async () => {
			const result = await Scry.Cards.search("cmc>cmc").cancelAfterPage().waitForAll();
			expect(result.length).eq(0);
			expect(Scry.error()).not.eq(undefined);
		});

		describe("Collection", () => {

			it("by id", async () => {
				const collection = [
					Scry.CardIdentifier.byId("94c70f23-0ca9-425e-a53a-6c09921c0075"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Crush Dissent");
				expect(Scry.error()).eq(undefined);
			});

			it("by multiverse id", async () => {
				const collection = [
					Scry.CardIdentifier.byMultiverseId(462293),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Contentious Plan");
				expect(Scry.error()).eq(undefined);
			});

			it("by mtgo id", async () => {
				const collection = [
					Scry.CardIdentifier.byMtgoId(71692),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Bond of Insight");
				expect(Scry.error()).eq(undefined);
			});

			it("by oracle id", async () => {
				const collection = [
					Scry.CardIdentifier.byOracleId("394c6de5-7957-4a0b-a6b9-ee0c707cd022"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Forgotten Cave");
				expect(Scry.error()).eq(undefined);
			});

			it("by illustration id", async () => {
				const collection = [
					Scry.CardIdentifier.byIllustrationId("99f43949-049e-41e2-bf4c-e22e11790012"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("GO TO JAIL");
				expect(Scry.error()).eq(undefined);
			});

			it("by name", async () => {
				const collection = [
					Scry.CardIdentifier.byName("Blood Scrivener"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Blood Scrivener");
				expect(Scry.error()).eq(undefined);
			});

			it("by name & set", async () => {
				const collection = [
					Scry.CardIdentifier.byName("Lightning Bolt", "prm"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Lightning Bolt");
				expect(cards[0].set).eq("prm");
				expect(Scry.error()).eq(undefined);
			});

			it("by set", async () => {
				const collection = [
					Scry.CardIdentifier.bySet("mrd", "150"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Chalice of the Void");
				expect(Scry.error()).eq(undefined);
			});

			it("by multiverse id, 100 cards", async () => {
				const collection = [];
				for (let i = 1; i < 101; i++) {
					collection.push(Scry.CardIdentifier.byMultiverseId(i));
				}

				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(100);
				for (let i = 0; i < 100; i++) {
					expect(cards[i].multiverse_ids).includes(i + 1);
				}
				expect(Scry.error()).eq(undefined);
			});

			it("by id with invalid", async () => {
				const collection = [
					Scry.CardIdentifier.byId("94c70f23-0ca9-425e-a53a-6c09921c0075"),
					Scry.CardIdentifier.byId("94c70f23-0ca9-425e-a53a-111111111111"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Crush Dissent");
				expect(cards.not_found.length).eq(1);
				expect(cards.not_found[0].id).eq("94c70f23-0ca9-425e-a53a-111111111111")
				expect(Scry.error()).eq(undefined);
			});
		});
	});

	describe("Sets", () => {
		it("by code", async () => {
			const set = await Scry.Sets.byCode("hou");
			expect(set.name).eq("Hour of Devastation");
			expect(Scry.error()).eq(undefined);
		});

		it("by id", async () => {
			const set = await Scry.Sets.byId("65ff168b-bb94-47a5-a8f9-4ec6c213e768");
			expect(set.name).eq("Hour of Devastation");
			expect(Scry.error()).eq(undefined);
		});

		it("by tgc player id", async () => {
			const set = await Scry.Sets.byTcgPlayerId(1934);
			expect(set.name).eq("Hour of Devastation");
			expect(Scry.error()).eq(undefined);
		});

		it("all", async () => {
			const sets = await Scry.Sets.all();
			expect(sets.length).gte(394);
			expect(Scry.error()).eq(undefined);
		});
	});

	describe("Rulings", () => {
		it("by id", async () => {
			const rulings = await Scry.Rulings.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(rulings.length).gte(2);
			expect(Scry.error()).eq(undefined);
		});

		it("by set", async () => {
			const rulings = await Scry.Rulings.bySet("dgm", "22");
			expect(rulings.length).gte(2);
			expect(Scry.error()).eq(undefined);
		});

		it("by multiverse id", async () => {
			const rulings = await Scry.Rulings.byMultiverseId(369030);
			expect(rulings.length).gte(2);
			expect(Scry.error()).eq(undefined);
		});

		it("by mtgo id", async () => {
			const rulings = await Scry.Rulings.byMtgoId(48338);
			expect(rulings.length).gte(2);
			expect(Scry.error()).eq(undefined);
		});

		it("by arena id", async () => {
			const rulings = await Scry.Rulings.byArenaId(67204);
			expect(rulings.length).gte(3);
			expect(Scry.error()).eq(undefined);
		});
	});

	describe("Symbology", () => {
		it("all", async () => {
			const symbology = await Scry.Symbology.all();
			expect(symbology.length).gte(63);
			expect(Scry.error()).eq(undefined);
		});

		it("parse mana cost", async () => {
			const manacost = await Scry.Symbology.parseMana("2ww");
			expect(manacost.cost).eq("{2}{W}{W}");
			expect(Scry.error()).eq(undefined);
		});
	});

	describe("Catalog", () => {
		it("card names", async () => {
			const result = await Scry.Catalog.cardNames();
			expect(result.length).gte(18059);
			expect(Scry.error()).eq(undefined);
		});

		it("artist names", async () => {
			const result = await Scry.Catalog.artistNames();
			expect(result.length).gte(676);
			expect(Scry.error()).eq(undefined);
		});

		it("word bank", async () => {
			const result = await Scry.Catalog.wordBank();
			expect(result.length).gte(12892);
			expect(Scry.error()).eq(undefined);
		});

		it("creature types", async () => {
			const result = await Scry.Catalog.creatureTypes();
			expect(result.length).gte(242);
			expect(Scry.error()).eq(undefined);
		});

		it("planeswalker types", async () => {
			const result = await Scry.Catalog.planeswalkerTypes();
			expect(result.length).gte(42);
			expect(Scry.error()).eq(undefined);
		});

		it("land types", async () => {
			const result = await Scry.Catalog.landTypes();
			expect(result.length).gte(13);
			expect(Scry.error()).eq(undefined);
		});

		it("artifact types", async () => {
			const result = await Scry.Catalog.artifactTypes();
			expect(result.length).gte(6);
			expect(Scry.error()).eq(undefined);
		});

		it("enchantment types", async () => {
			const result = await Scry.Catalog.enchantmentTypes();
			expect(result.length).gte(5);
			expect(Scry.error()).eq(undefined);
		});

		it("spell types", async () => {
			const result = await Scry.Catalog.spellTypes();
			expect(result.length).gte(2);
			expect(Scry.error()).eq(undefined);
		});

		it("powers", async () => {
			const result = await Scry.Catalog.powers();
			expect(result.length).gte(33);
			expect(Scry.error()).eq(undefined);
		});

		it("toughnesses", async () => {
			const result = await Scry.Catalog.toughnesses();
			expect(result.length).gte(35);
			expect(Scry.error()).eq(undefined);
		});

		it("loyalties", async () => {
			const result = await Scry.Catalog.loyalties();
			expect(result.length).gte(9);
			expect(Scry.error()).eq(undefined);
		});

		it("watermarks", async () => {
			const result = await Scry.Catalog.watermarks();
			expect(result.length).gte(50);
			expect(Scry.error()).eq(undefined);
		});
	});

	describe("Bulk Data", () => {
		let definitions: BulkDataDefinition[];

		describe("definitions", () => {
			it("all", async () => {
				definitions = await Scry.BulkData.definitions();

				expect(definitions).satisfies(Array.isArray);
				expect(definitions.length).gte(5);
				expect(Scry.error()).eq(undefined);
			});

			it("by id", async () => {
				const result = await Scry.BulkData.definitionById(definitions[0].id);

				expect(result.object).eq("bulk_data");
				expect(result.compressed_size).gte(10000);
			});

			it("by type", async () => {
				const result = await Scry.BulkData.definitionByType("all_cards");

				expect(result.object).eq("bulk_data");
				expect(result.type).eq("all_cards");
				expect(result.compressed_size).gte(10000);
			});
		});

		describe("download", () => {
			describe("by id", () => {
				it("no matter the last download time", async () => {
					const result = await Scry.BulkData.downloadById(definitions[0].id, 0);
					expect(result).instanceOf(Stream);
				});

				it("with the last download time more recent than the last update time", async () => {
					const result = await Scry.BulkData.downloadById(definitions[0].id, new Date(definitions[0].updated_at).getTime() + 10);
					expect(result).eq(undefined);
				});
			});

			describe("by type", () => {
				it("no matter the last download time", async () => {
					const result = await Scry.BulkData.downloadByType("rulings", 0);
					expect(result).instanceOf(Stream);
				});

				it("with the last download time more recent than the last update time", async () => {
					const rulingsDefinition = await Scry.BulkData.definitionByType("rulings");
					const result = await Scry.BulkData.downloadByType("rulings", new Date(rulingsDefinition.updated_at).getTime() + 10);
					expect(result).eq(undefined);
				});
			});
		});
	});

	describe("Misc", () => {
		it("homepage links", async () => {
			const result = await Scry.Misc.homepageLinks();
			expect(result).satisfies(Array.isArray);
			expect(Scry.error()).eq(undefined);
		});
	});

	describe("on errors", () => {
		it("should return the error", async () => {
			await Scry.Cards.byMultiverseId("bananas" as any);
			expect(Scry.error()).not.eq(undefined);
		});

		it("should overwrite the previous error", async () => {
			await Scry.Cards.byMultiverseId("bananas" as any);
			expect(Scry.error()).not.eq(undefined);
			await Scry.Cards.byMtgoId(48338);
			expect(Scry.error()).eq(undefined);
		});

		it("should retry", async () => {
			const then = Date.now();
			const attempts = 3;
			const timeout = 1000;
			Scry.setRetry(attempts, timeout);
			MagicQuerier.retry.forced = true;
			await Scry.Cards.byMultiverseId("bananas" as any);
			MagicQuerier.retry.forced = false;
			expect(Scry.error()).not.eq(undefined);
			expect(Date.now() - then).gt(attempts * timeout);
		});

		// todo figure out tests for the "can retry" stuff that doesn't rely on enabling 404/400 errors
	});
});
